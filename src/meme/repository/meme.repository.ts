import { InjectRepository } from '@nestjs/typeorm';
import { MemeModel } from 'MEME/entity/meme.model';
import { MongoRepository } from 'typeorm';

export class MemeRepository {
    constructor(@InjectRepository(MemeModel) private readonly memeRepository: MongoRepository<MemeModel>) {}

    public create = async (newMeme: Partial<MemeModel>): Promise<MemeModel> => {
        const meme = this.memeRepository.create(newMeme);
        return await this.memeRepository.save(meme);
    };
}
