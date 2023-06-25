import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './repository/user.repository';
import { UserModel } from './entity/user.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemeModule } from 'MEME/meme.module';
import { EnvModule } from 'ENV/env.module';

@Module({
    imports: [TypeOrmModule.forFeature([UserModel]), EnvModule, MemeModule],
    providers: [UserService, UserRepository],
    controllers: [UserController],
    exports: [UserRepository],
})
export class UserModule {}
