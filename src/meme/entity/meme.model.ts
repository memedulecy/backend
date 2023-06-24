import { BaseEntity } from 'DATABASE/entity/base.entity';
import { IsOptional, IsString } from 'class-validator';
import { Column, Entity, ObjectId, ObjectIdColumn } from 'typeorm';

@Entity('meme_model')
export class MemeModel extends BaseEntity {
    @ObjectIdColumn()
    memeId: ObjectId;

    @IsString()
    @IsOptional()
    @Column({ nullable: false, comment: '이미지 url' })
    imgUrl: string = '';

    @IsString()
    @IsOptional()
    @Column({ nullable: false, comment: '메세지' })
    message: string = '';
}
