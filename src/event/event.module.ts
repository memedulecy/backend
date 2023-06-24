import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { MemeModule } from 'MEME/meme.module';

@Module({ imports: [MemeModule], providers: [EventsGateway] })
export class EventModule {}
