import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvService } from 'ENV/env.service';
import { Env } from 'ENV/dataTypes/types/env.type';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { cors: true });
    app.enableCors({
        origin: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });
    app.useWebSocketAdapter(new IoAdapter(app));
    const envService = new EnvService();
    const port = +envService.get<string>(Env.PORT) || 3000;
    await app.listen(port);
    console.log(`listening on port ${port}`);
}
bootstrap();
