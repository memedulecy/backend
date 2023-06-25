import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { EnvService } from 'ENV/env.service';
import { Env } from 'ENV/dataTypes/types/env.type';
import { entities } from './const/entities.const';

@Injectable()
export class DBConfigProvider implements TypeOrmOptionsFactory {
    private readonly host: string;
    private readonly database: string;
    private readonly username: string;
    private readonly password: string;

    constructor(private envService = new EnvService()) {
        this.host = envService.get<string>(Env.DB_HOST);
        this.database = envService.get<string>(Env.DB_DATABASE);
        this.username = envService.get<string>(Env.DB_USERNAME);
        this.password = envService.get<string>(Env.DB_PASSWORD);
    }

    // createTypeOrmOptions(): TypeOrmModuleOptions {
    //     return {
    //         type: 'mongodb',
    //         url: `mongodb+srv://${this.username}:${this.password}@${this.host}/${this.database}?retryWrites=true&w=majority`,
    //         synchronize: true,
    //         logging: true,
    //         entities,
    //     };
    // }

    createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            type: 'mongodb',
            // url: `mongodb+srv://${this.username}:${this.password}@${this.host}/${this.database}?retryWrites=true&w=majority`,
            host: this.host,
            port: 27017,
            database: this.database,
            synchronize: true,
            logging: true,
            entities,
        };
    }
}
