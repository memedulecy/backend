import { Module } from '@nestjs/common';
import { EnvService } from './env.service';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' })],
    providers: [{ provide: EnvService, useValue: new EnvService() }],
    exports: [EnvService],
})
export class EnvModule {}
