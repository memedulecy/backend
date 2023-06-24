import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvService } from 'SRC/env/env.service';
import { Env } from 'SRC/env/dataTypes/types/env.type';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { cors: true });
    const envService = new EnvService();
    const port = +envService.get<string>(Env.PORT) || 3000;
    await app.listen(port);
    console.log(`listening on port ${port}`);
}
bootstrap();
