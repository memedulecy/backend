import { Controller, Get, HttpCode, HttpStatus, Post, Put, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { UserType } from './dataTypes/type/user.type';
import { UserModel } from './entity/user.model';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('/log-in/kakao')
    @HttpCode(HttpStatus.OK)
    async kakaoLogin(@Query('code') code: string): Promise<{ token: string }> {
        return await this.userService.login(code);
    }

    @Get('/')
    @HttpCode(HttpStatus.OK)
    async getProfile(): Promise<UserModel> {
        return {} as UserModel;
    }

    @Put('/')
    @HttpCode(HttpStatus.OK)
    async updateProfile(): Promise<UserModel> {
        const user = {} as UserModel;
        const nickname = 'dohee';
        const imgUrl = '';
        return await this.userService.updateProfile(user, nickname, imgUrl);
    }
}
