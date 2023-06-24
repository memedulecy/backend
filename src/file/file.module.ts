import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { MulterModule } from '@nestjs/platform-express';
import { EnvModule } from 'ENV/env.module';
import { multerOptions } from 'COMMON/utils/multer.options.util';
import { EnvService } from 'ENV/env.service';

@Module({
    imports: [MulterModule.registerAsync({ imports: [EnvModule], useFactory: multerOptions, inject: [EnvService] })],
    providers: [FileService],
    controllers: [FileController],
})
export class FileModule {}
