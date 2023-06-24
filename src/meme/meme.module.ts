import { Module } from '@nestjs/common';
import { MemeService } from './meme.service';
import { MemeController } from './meme.controller';

@Module({
    providers: [MemeService],
    controllers: [MemeController],
})
export class MemeModule {}
