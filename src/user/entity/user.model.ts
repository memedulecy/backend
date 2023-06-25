import { BaseEntity } from 'DATABASE/entity/base.entity';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Column, Entity, ObjectId, ObjectIdColumn } from 'typeorm';
import { UserType } from '../dataTypes/type/user.type';

@Entity('user_model')
export class UserModel extends BaseEntity {
    @ObjectIdColumn()
    userId: ObjectId;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @Column({ nullable: false, comment: '이메일' })
    email: string;

    @IsNotEmpty()
    @Column({ nullable: false, comment: '로그인 타입' })
    type: UserType;

    @IsString()
    @IsNotEmpty()
    @Column({ nullable: false, comment: '닉네임' })
    nickname: string;

    @IsString()
    @IsNotEmpty()
    @Column({ nullable: false, comment: '프로필 사진' })
    profileImg: string = 'https://meme-dulecy.s3.ap-northeast-2.amazonaws.com/%EA%B3%A0%EC%96%91%EC%9D%B41_1687624100074.jpg';

    @Column({ nullable: false, comment: '마지막 로그인 시간' })
    lastLoginTs: number = Date.now();
}
