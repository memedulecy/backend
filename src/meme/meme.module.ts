import { Module } from '@nestjs/common';
import { MemeService } from './meme.service';
import { MemeController } from './meme.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemeModel } from './entity/meme.model';

@Module({
    imports: [TypeOrmModule.forFeature([MemeModel])],
    providers: [MemeService],
    controllers: [MemeController],
})
export class MemeModule {}
