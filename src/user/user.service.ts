import { Injectable } from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import axios from 'axios';
import { UserType } from './dataTypes/type/user.type';
import { sign } from 'jsonwebtoken';
import { EnvService } from 'ENV/env.service';
import { Env } from 'ENV/dataTypes/types/env.type';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository, private readonly envService: EnvService) {}

    public login = async (code: string, type: UserType) => {
        const accessToken = await this.getToken(code, type);
        const email = await this.getUserEmail(accessToken, type);
        // 사용자 찾고 있으면 token 발행, 없으면 create하고 token 발생
        const user = await this.createIfNeed(email, type);
        const token = sign({ userId: user.userId }, this.envService.get<string>(Env.JWT_KEY));
        return { token };
    };

    private createIfNeed = async (email: string, type: UserType) => {
        let user = await this.userRepository.findOneByEmail(email);
        if (!user) {
            const nickname = '임시 닉네임';
            user = await this.userRepository.create({ email, type, nickname });
        } else {
            await this.userRepository.updateLastLoginTs(user);
        }
        return user;
    };

    private getToken = async (code: string, type: UserType) => {
        const baseUrl = this.getBaseUrl(type);
        const config = this.getConfig(code, type);
        const params = new URLSearchParams(config);
        const url = baseUrl + '?' + params;
        const tokenRequest = await axios.post(url, config);
        return tokenRequest.data.access_token;
    };

    private getBaseUrl = (type: UserType) => {
        switch (type) {
            case UserType.KAKAO:
                return this.envService.get<string>(Env.KAKAO_BASE_URL);
            case UserType.NAVER:
                return this.envService.get<string>(Env.NAVER_BASE_URL);
        }
    };

    private getConfig = (code: string, type: UserType) => {
        switch (type) {
            case UserType.KAKAO:
                return {
                    client_id: this.envService.get<string>(Env.KAKAO_CLIENT),
                    redirect_uri: this.envService.get<string>(Env.KAKAO_REDIRECT_URI),
                    grant_type: 'authorization_code',
                    code,
                };
            case UserType.NAVER:
                return {
                    client_id: this.envService.get<string>(Env.NAVER_CLIENT),
                    client_secret: this.envService.get<string>(Env.NAVER_SECRET),
                    redirect_uri: this.envService.get<string>(Env.NAVER_REDIRECT_URI),
                    grant_type: 'authorization_code',
                    code,
                };
        }
    };

    private getUserEmail = async (token: string, type: UserType) => {
        switch (type) {
            case UserType.KAKAO:
                return this.getKakaoEmail(token);
            case UserType.NAVER:
                return this.getNaverEmail(token);
        }
    };

    private getKakaoEmail = async (token: string) => {
        const url = this.envService.get<string>(Env.KAKAO_DATA_URL);
        const userData = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
        return userData.data.kakao_account.email;
    };

    private getNaverEmail = async (token: string) => {
        const url = this.envService.get<string>(Env.NAVER_DATA_URL);
        const userData = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
        return userData.data.response.email;
    };
}
