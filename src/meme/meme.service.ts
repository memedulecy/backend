import { HttpStatus, Injectable } from '@nestjs/common';
import { MemeRepository } from './repository/meme.repository';
import { MemeModel } from './entity/meme.model';
import { IntegrateException } from 'EXCEPTION/integrateException';
import { ErrCode } from 'EXCEPTION/errCode';
import { ErrMsg } from 'EXCEPTION/errMsg';

@Injectable()
export class MemeService {
    constructor(private readonly memeRepository: MemeRepository) {}

    public create = async (imgUrl: string, message: string, creator: string): Promise<MemeModel> => {
        const newMeme: Partial<MemeModel> = { imgUrl, message, creator, updater: creator };
        return await this.memeRepository.create(newMeme);
    };

    public findDetail = async (memeId: string): Promise<MemeModel> => {
        const meme = await this.memeRepository.findOneById(memeId);
        if (!meme) throw new IntegrateException(ErrCode.NOT_FOUND, ErrMsg.NOT_FOUND, HttpStatus.NOT_FOUND);

        return meme;
    };
}
