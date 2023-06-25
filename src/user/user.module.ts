import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './repository/user.repository';
import { UserModel } from './entity/user.model';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([UserModel])],
    providers: [UserService, UserRepository],
    controllers: [UserController],
})
export class UserModule {}
