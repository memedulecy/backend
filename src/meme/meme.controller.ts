import { Body, Controller, HttpStatus, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { MemeService } from './meme.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { IntegrateException } from 'EXCEPTION/integrateException';
import { ErrCode } from 'EXCEPTION/errCode';
import { ErrMsg } from 'EXCEPTION/errMsg';

@Controller('memes')
export class MemeController {
    constructor(private readonly memeService: MemeService) {}

    @Post('')
    @UseInterceptors(FileInterceptor('img'))
    async create(@UploadedFile() img: Express.MulterS3.File, @Body() body: { message: string }) {
        const imgUrl = this.uploadImg(img);
        const message = body.message;
        const creator = 'DOHEE';
        console.log('imgUrl', imgUrl);
        console.log('message', message);
        console.log('creator', creator);

        return this.memeService.create(imgUrl, message, creator);
    }

    private uploadImg = (img: Express.MulterS3.File): string => {
        if (!img) throw new IntegrateException(ErrCode.BAD_REQUEST, ErrMsg.BAD_REQUEST, HttpStatus.BAD_REQUEST);
        return img.location;
    };
}
