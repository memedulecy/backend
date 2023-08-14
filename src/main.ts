import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvService } from 'ENV/env.service';
import { Env } from 'ENV/dataTypes/types/env.type';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  // using swagger
  const config = new DocumentBuilder()
    .setTitle('Memedulecy API')
    .setDescription('The memedulecy API description')
    .setVersion('1.0')
    .addTag('memes')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useWebSocketAdapter(new IoAdapter(app));

  const envService = new EnvService();
  const port = +envService.get<string>(Env.PORT) || 8000;
  await app.listen(port);

  console.log(`listening on port ${port}`);
}

bootstrap();
