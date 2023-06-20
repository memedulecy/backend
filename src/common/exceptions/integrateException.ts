import { ErrMsg } from './errMsg';
import { ErrCode } from './errCode';

export class IntegrateException extends Error {
    public readonly res: ErrRes;

    constructor(errCode: ErrCode, errMsg: ErrMsg, statusCode: number) {
        super();
        this.res = { errCode, errMsg, statusCode };
    }
}

interface ErrRes {
    statusCode: number;
    errCode: ErrCode;
    errMsg: ErrMsg;
}
