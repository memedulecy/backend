import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './repository/user.repository';
import { UserModel } from './entity/user.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemeModule } from 'MEME/meme.module';
import { EnvModule } from 'ENV/env.module';
import { multerOptions } from 'COMMON/utils/multer.options.util';
import { EnvService } from 'ENV/env.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserModel]),
        MulterModule.registerAsync({ imports: [EnvModule], useFactory: multerOptions, inject: [EnvService] }),
        EnvModule,
        MemeModule,
    ],
    providers: [UserService, UserRepository],
    controllers: [UserController],
    exports: [UserRepository],
})
export class UserModule {}
