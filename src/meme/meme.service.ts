import { HttpStatus, Injectable } from '@nestjs/common';
import { MemeRepository } from './repository/meme.repository';
import { MemeModel } from './entity/meme.model';
import { IntegrateException } from 'EXCEPTION/integrateException';
import { ErrCode } from 'EXCEPTION/errCode';
import { ErrMsg } from 'EXCEPTION/errMsg';
import { FindOptions } from 'typeorm';
import { UserModel } from 'SRC/user/entity/user.model';
import { Sticker } from './dataTypes/interface/sticker.interface';

@Injectable()
export class MemeService {
  constructor(private readonly memeRepository: MemeRepository) {}

  public create = async (
    imgUrl: string,
    message: string,
    creator: UserModel,
  ): Promise<MemeModel> => {
    const newMeme: Partial<MemeModel> = {
      imgUrl,
      message,
      nickname: creator.nickname,
      profileImg: creator.profileImg,
      creator: creator.userId.toString(),
      updater: creator.userId.toString(),
    };

    return await this.memeRepository.create(newMeme);
  };

  public findMemeById = async (memeId: string) => {
    return this.memeRepository.findOneById(memeId);
  };

  public findMemesByTimespan = async (
    timespan: {
      from: number;
      to: number;
    },
    skip: number,
  ) => {
    return this.memeRepository.findAndCount(
      {
        createdTs: {
          $gt: timespan.from,
          $lte: timespan.to,
        },
      },
      skip,
    );
  };

  public findDetail = async (memeId: string): Promise<MemeModel> => {
    const meme = await this.memeRepository.findOneById(memeId);
    if (!meme)
      throw new IntegrateException(
        ErrCode.NOT_FOUND_MEME,
        ErrMsg.NOT_FOUND_MEME,
        HttpStatus.NOT_FOUND,
      );
    if (!meme.imgUrl) meme.imgUrl = null;
    if (!meme.message) meme.message = null;
    return meme;
  };

  public findByUserIds = async (
    userIds: string[],
    time: { gte: number; lt: number },
    limit?: number,
  ): Promise<MemeModel[]> => {
    const filter = {
      creator: { $in: userIds },
      createdTs: { $gte: time.gte, $lt: time.lt },
    } as FindOptions<MemeModel>;

    return await this.memeRepository.findByFilter(filter, limit);
  };

  public putStickers = async (memeId: string, stickers: Sticker[]) => {
    const meme = await this.findDetail(memeId);
    return await this.memeRepository.putStickers(meme, stickers);
  };
}
