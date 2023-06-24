import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvService } from 'ENV/env.service';
import { Env } from 'ENV/dataTypes/types/env.type';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { cors: true });
    const envService = new EnvService();
    const port = +envService.get<string>(Env.PORT) || 3000;
    await app.listen(port);
    console.log(`listening on port ${port}`);
}
bootstrap();
