import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Env } from 'ENV/dataTypes/types/env.type';
import { EnvService } from 'ENV/env.service';
import { ErrCode } from 'EXCEPTION/errCode';
import { ErrMsg } from 'EXCEPTION/errMsg';
import { IntegrateException } from 'EXCEPTION/integrateException';
import { UserRepository } from 'SRC/user/repository/user.repository';
import { NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
    constructor(private readonly userRepository: UserRepository, private readonly envService: EnvService) {}

    async use(req: Request, _: Response, next: NextFunction) {
        if (req.headers['authorization'] && req.headers['authorization'].startsWith('Bearer')) {
            const token = req.headers['authorization'].split(' ')[1];
            let decoded: { userId: string };
            try {
                decoded = verify(token, this.envService.get<string>(Env.JWT_KEY));
            } catch (err) {
                throw new IntegrateException(
                    ErrCode.INVALID_TOKEN_UNAUTHORIZED,
                    ErrMsg.INVALID_TOKEN_UNAUTHORIZED,
                    HttpStatus.UNAUTHORIZED,
                );
            }
            const user = await this.userRepository.findOneById(decoded.userId);
            if (!user) throw new IntegrateException(ErrCode.NOT_FOUND_USER, ErrMsg.NOT_FOUND_USER, HttpStatus.NOT_FOUND);
            req['user'] = user;
        } else {
            throw new IntegrateException(ErrCode.NO_TOKEN_UNAUTHORIZED, ErrMsg.NO_TOKEN_UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
        }
        next();
    }
}
