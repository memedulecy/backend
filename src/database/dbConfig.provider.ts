import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { EnvService } from 'ENV/env.service';
import { Env } from 'ENV/dataTypes/types/env.type';
import { entities } from './const/entities.const';

@Injectable()
export class DBConfigProvider implements TypeOrmOptionsFactory {
    private readonly host: string;
    private readonly port: number;
    private readonly database: string;

    constructor(private envService = new EnvService()) {
        this.host = envService.get<string>(Env.DB_HOST);
        this.port = envService.get<number>(Env.DB_PORT);
        this.database = envService.get<string>(Env.DB_DATABASE);
    }

    createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            type: 'mongodb',
            host: this.host,
            port: this.port,
            database: this.database,
            synchronize: true,
            logging: true,
            entities,
        };
    }
}
