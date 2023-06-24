import { Module } from '@nestjs/common';
import { MemeService } from './meme.service';
import { MemeController } from './meme.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemeModel } from './entity/meme.model';
import { MulterModule } from '@nestjs/platform-express';
import { EnvModule } from 'ENV/env.module';
import { multerOptions } from 'COMMON/utils/multer.options.util';
import { EnvService } from 'ENV/env.service';
import { MemeRepository } from './repository/meme.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([MemeModel]),
        MulterModule.registerAsync({ imports: [EnvModule], useFactory: multerOptions, inject: [EnvService] }),
    ],
    providers: [MemeService, MemeRepository],
    controllers: [MemeController],
    exports: [MemeService],
})
export class MemeModule {}
