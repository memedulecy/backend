// library
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
// common
import { HttpExceptionFilter } from 'COMMON/filters/httpException.filter';
import { ResponseInterceptor } from 'COMMON/interceptors/response.interceptor';
import { HttpLoggerMiddleware } from 'COMMON/middlewares/httpLogger.middleware';
// controller
import { AppController } from './app.controller';
// module
import { EnvModule } from './env/env.module';
// service
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DBConfigProvider } from 'DATABASE/dbConfig.provider';
import { FileModule } from './file/file.module';
import { MemeModule } from './meme/meme.module';
import { EventModule } from './event/event.module';

@Module({
    imports: [EnvModule, TypeOrmModule.forRoot(new DBConfigProvider().createTypeOrmOptions()), FileModule, MemeModule, EventModule],
    controllers: [AppController],
    providers: [
        AppService,
        { provide: APP_FILTER, useClass: HttpExceptionFilter },
        { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(HttpLoggerMiddleware).forRoutes('*');
    }
}
