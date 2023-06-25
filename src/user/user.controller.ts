import { Controller, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { UserType } from './dataTypes/type/user.type';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('/log-in/kakao')
    @HttpCode(HttpStatus.OK)
    async kakaoLogin(@Query('code') code: string): Promise<{ token: string }> {
        return await this.userService.login(code, UserType.KAKAO);
    }

    @Post('/log-in/naver')
    @HttpCode(HttpStatus.OK)
    async naverLogin(@Query('code') code: string): Promise<{ token: string }> {
        return await this.userService.login(code, UserType.NAVER);
    }
}
