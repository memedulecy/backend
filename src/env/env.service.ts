import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Env } from 'SRC/env/dataTypes/types/env.type';

@Injectable()
export class EnvService {
    constructor(private readonly configService = new ConfigService()) {}
    public get<T>(key: Env, defaultValue?: T): T {
        return (this.configService.get(Env[key]) as T) || defaultValue;
    }
}
