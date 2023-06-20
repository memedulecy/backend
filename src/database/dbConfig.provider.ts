import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { EnvService } from 'SRC/env/env.service';
import { Env } from 'SRC/env/dataTypes/types/env.type';

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
        };
    }
}
