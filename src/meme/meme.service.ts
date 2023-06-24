import { Injectable } from '@nestjs/common';
import { MemeRepository } from './repository/meme.repository';
import { MemeModel } from './entity/meme.model';

@Injectable()
export class MemeService {
    constructor(private readonly memeRepository: MemeRepository) {}

    public create = async (imgUrl: string, message: string, creator: string): Promise<MemeModel> => {
        const newMeme: Partial<MemeModel> = { imgUrl, message, creator, updater: creator };
        return await this.memeRepository.create(newMeme);
    };
}
