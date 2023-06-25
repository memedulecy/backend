import { Body, Controller, Get, HttpCode, HttpStatus, Post, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { UserModel } from './entity/user.model';
import { User } from 'COMMON/decorators/user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

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
    async getProfile(@User() user: UserModel): Promise<UserModel> {
        return user;
    }

    @Put('/')
    @HttpCode(HttpStatus.OK)
    @UseInterceptors(FileInterceptor('img'))
    async updateProfile(
        @UploadedFile() img: Express.MulterS3.File,
        @User() user: UserModel,
        @Body() body: { nickname?: string; imgUrl?: string },
    ): Promise<UserModel> {
        const nickname = body.nickname;
        const imgUrl = body.imgUrl || img?.location || '';
        return await this.userService.updateProfile(user, nickname, imgUrl);
    }
}
