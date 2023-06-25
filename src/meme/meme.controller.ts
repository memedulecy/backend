import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { MemeService } from './meme.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { IntegrateException } from 'EXCEPTION/integrateException';
import { ErrCode } from 'EXCEPTION/errCode';
import { ErrMsg } from 'EXCEPTION/errMsg';
import { MemeModel } from './entity/meme.model';
import { User } from 'COMMON/decorators/user.decorator';
import { UserModel } from 'SRC/user/entity/user.model';

@Controller('memes')
export class MemeController {
    constructor(private readonly memeService: MemeService) {}

    @Post('')
    @HttpCode(HttpStatus.CREATED)
    @UseInterceptors(FileInterceptor('img'))
    async create(
        @UploadedFile() img: Express.MulterS3.File,
        @Body() body: { message: string },
        @User() user: UserModel,
    ): Promise<MemeModel> {
        const imgUrl = this.uploadImg(img);
        const message = body.message;

        return this.memeService.create(imgUrl, message, user);
    }

    @Get('/:memeId')
    @HttpCode(HttpStatus.OK)
    async findDetail(@Param('memeId') memeId: string): Promise<MemeModel> {
        return await this.memeService.findDetail(memeId);
    }

    private uploadImg = (img: Express.MulterS3.File): string => {
        if (!img) throw new IntegrateException(ErrCode.INVALID_IMG, ErrMsg.INVALID_IMG, HttpStatus.BAD_REQUEST);
        return img.location;
    };
}
