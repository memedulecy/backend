import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response, Request } from 'express';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
    private logger = new Logger('HTTP');

    use(req: Request, res: Response, next: NextFunction) {
        const { ip, method, originalUrl } = req;
        const userAgent = req.get('user-agent');
        res.on('close', () => {
            const { statusCode } = res;
            this.logger.log(`${method} ${originalUrl} ${statusCode} - ${userAgent} ${ip}`);
        });
        next();
    }
}
