import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { UserModel } from '../entity/user.model';

export class UserRepository {
    constructor(@InjectRepository(UserModel) private readonly userRepository: MongoRepository<UserModel>) {}

    public create = async (newUser: Partial<UserModel>): Promise<UserModel> => {
        const user = this.userRepository.create(newUser);
        return await this.userRepository.save(user);
    };

    public findOneByEmail = async (email: string): Promise<UserModel> => {
        return await this.userRepository.findOne({ where: { email } });
    };

    public updateLastLoginTs = async (user: UserModel) => {
        user.lastLoginTs = Date.now();
        return await this.userRepository.save(user);
    };
}
