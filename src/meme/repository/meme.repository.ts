import { InjectRepository } from '@nestjs/typeorm';
import { Sticker } from 'MEME/dataTypes/interface/sticker.interface';
import { MemeModel } from 'MEME/entity/meme.model';
import { ObjectId } from 'mongodb';
import { FindOptions, MongoRepository } from 'typeorm';

export class MemeRepository {
  constructor(@InjectRepository(MemeModel) private readonly memeRepository: MongoRepository<MemeModel>) {}

  public create = async (newMeme: Partial<MemeModel>): Promise<MemeModel> => {
    const meme = this.memeRepository.create(newMeme);
    return await this.memeRepository.save(meme);
  };

  public findOneById = async (memeId: string): Promise<MemeModel> => {
    return await this.memeRepository.findOne({ where: { _id: new ObjectId(memeId) } });
  };

  public findByFilter = async (filter: FindOptions<MemeModel>, limit?: number) => {
    if (!!limit) await this.memeRepository.find({ where: filter, order: { createdTs: 'DESC' }, take: limit });

    return await this.memeRepository.find({ where: filter, order: { createdTs: 'DESC' } });
  };

  public putStickers = async (meme: MemeModel, stickers: Sticker[]) => {
    meme.stickers.push(...stickers);
    return await this.memeRepository.save(meme);
  };

  public updateUserProfile = async (meme: MemeModel, nickname: string, profileImg: string) => {
    meme.nickname = nickname;
    meme.profileImg = profileImg;
    return await this.memeRepository.save(meme);
  };
}
