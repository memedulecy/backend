import { InjectRepository } from '@nestjs/typeorm';
import { LocationModel } from 'MEME/entity/location.model';
import { MemeModel } from 'MEME/entity/meme.model';
import { ObjectId } from 'mongodb';
import { FindOptions, MongoRepository } from 'typeorm';

export class MemeRepository {
    constructor(@InjectRepository(MemeModel) private readonly memeRepository: MongoRepository<MemeModel>) {}

    public create = async (newMeme: Partial<MemeModel>, lat: number, long: number): Promise<MemeModel> => {
        const meme = this.memeRepository.create(newMeme);
        meme.location = new LocationModel(lat, long);
        return await this.memeRepository.save(meme);
    };

    public findOneById = async (memeId: string): Promise<MemeModel> => {
        return await this.memeRepository.findOne({ where: { _id: new ObjectId(memeId) } });
    };

    public findByFilter = async (filter: FindOptions<MemeModel>) => {
        return await this.memeRepository.find({ where: filter, order: { createdTs: 'DESC' } });
    };
}
