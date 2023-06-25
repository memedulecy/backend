// library
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
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
import { MemeModule } from './meme/meme.module';
import { EventModule } from './event/event.module';
import { UserModule } from './user/user.module';
import { JwtMiddleware } from 'COMMON/middlewares/jwt.middleware';
import { UserController } from './user/user.controller';

@Module({
    imports: [EnvModule, TypeOrmModule.forRoot(new DBConfigProvider().createTypeOrmOptions()), MemeModule, EventModule, UserModule],
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
        consumer.apply(JwtMiddleware).exclude({ path: '/users/log-in/kakao', method: RequestMethod.POST }).forRoutes(UserController);
        consumer.apply(JwtMiddleware).forRoutes({ path: '/memes', method: RequestMethod.POST });
    }
}
