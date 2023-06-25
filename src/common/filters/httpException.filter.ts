// library
import { Response } from 'express';
import { ExceptionFilter, ArgumentsHost, Catch, HttpStatus, NotFoundException } from '@nestjs/common';
// exception
import { ErrMsg } from 'EXCEPTION/errMsg';
import { ErrCode } from 'EXCEPTION/errCode';
import { IntegrateException } from 'EXCEPTION/integrateException';
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(err, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse();
        console.error(err);

        if (err instanceof IntegrateException) {
            this.integrateErrRes(res, err);
        } else if (err instanceof NotFoundException) {
            this.pathErrRes(res, err);
        } else if (err.response) {
            if (Array.isArray(err.response.message) && err.response.message.length) {
                this.validationErrRes(res, err);
            } else {
                this.nestErrRes(res, err);
            }
        } else if (err instanceof Error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ errMsg: err.message, errCode: ErrCode.INTERNAL_SERVER_ERROR });
        } else {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                errMsg: ErrMsg.INTERNAL_SERVER_ERROR,
                errCode: ErrCode.INTERNAL_SERVER_ERROR,
            });
        }
    }

    private integrateErrRes(res: Response, err: IntegrateException): void {
        const { statusCode, errCode, errMsg } = err.res;
        res.status(statusCode).json({ errMsg, errCode });
    }

    private pathErrRes(res: Response, err: NotFoundException): void {
        res.status(err.getStatus()).json({ errMsg: ErrMsg.INVALID_PATH, errCode: ErrCode.INVALID_PATH });
    }

    private validationErrRes(res: Response, err: any): void {
        const REPRESENT_IDX = 0;
        const TYPE_IDX = 0;
        const represent = err.response.message[REPRESENT_IDX].split(' ')[TYPE_IDX].toUpperCase();

        res.status(err.getStatus()).json({
            errDetail: err.response.message,
            errMsg: `ERROR_TYPE_${represent}`,
            errCode: ErrCode.BAD_REQUEST,
        });
    }

    private nestErrRes(res: Response, err: any): void {
        res.status(HttpStatus.BAD_REQUEST).json({ errMsg: err.response.message, errCode: ErrCode.BAD_REQUEST });
    }
}
