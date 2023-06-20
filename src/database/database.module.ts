import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DBConfigProvider } from 'SRC/database/dbConfig.provider';

@Module({
    imports: [TypeOrmModule.forRootAsync({ useClass: DBConfigProvider })],
    exports: [TypeOrmModule],
})
export class DatabaseModule {}
