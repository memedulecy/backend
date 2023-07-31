import { Injectable } from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import axios from 'axios';
import { UserType } from './dataTypes/type/user.type';
import { sign } from 'jsonwebtoken';
import { EnvService } from 'ENV/env.service';
import { Env } from 'ENV/dataTypes/types/env.type';
import { UserModel } from './entity/user.model';
import { MemeRepository } from 'MEME/repository/meme.repository';
import { FindOptions } from 'typeorm';
import { MemeModel } from 'MEME/entity/meme.model';

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly envService: EnvService,
        private readonly memeRepository: MemeRepository,
    ) {}

    public login = async (code: string) => {
        const accessToken = await this.getToken(code);
        const { email, nickname } = await this.getUserData(accessToken);
        // 사용자 찾고 있으면 token 발행, 없으면 create하고 token 발생
        const user = await this.createIfNeed(email, nickname);
        const token = sign({ userId: user.userId.toString() }, this.envService.get<string>(Env.JWT_KEY));

        return { token };
    };

    public updateProfile = async (user: UserModel, nickname: string, imgUrl: string) => {
        const updatedUser = await this.userRepository.updateProfile(user, nickname, imgUrl);
        const filter = { creator: updatedUser.userId } as FindOptions<MemeModel>;
        const memes = await this.memeRepository.findByFilter(filter);
        await Promise.all(
            memes.map(async meme => await this.memeRepository.updateUserProfile(meme, updatedUser.nickname, updatedUser.profileImg)),
        );
        return updatedUser;
    };

    private createIfNeed = async (email: string, nickname: string) => {
        let user = await this.userRepository.findOneByEmail(email);
        if (!user) {
            const type = UserType.KAKAO;
            user = await this.userRepository.create({ email, type, nickname });
        } else {
            await this.userRepository.updateLastLoginTs(user);
        }
        return user;
    };

    private getToken = async (code: string) => {
        const baseUrl = this.envService.get<string>(Env.KAKAO_BASE_URL);
        const config = {
            client_id: this.envService.get<string>(Env.KAKAO_CLIENT),
            redirect_uri: this.envService.get<string>(Env.KAKAO_REDIRECT_URI),
            grant_type: 'authorization_code',
            code,
        };
        const params = new URLSearchParams(config);
        const url = decodeURIComponent(baseUrl + '?' + params);
        const tokenRequest = await axios.post(url, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
            },
        });
        return tokenRequest.data.access_token;
    };

    private getUserData = async (token: string) => {
        const url = this.envService.get<string>(Env.KAKAO_DATA_URL);
        const userData = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
        const email = userData.data.kakao_account.email;
        const nickname = userData.data.properties.nickname;
        return { email, nickname };
    };
}
