import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { MemeService } from './meme.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { IntegrateException } from 'EXCEPTION/integrateException';
import { ErrCode } from 'EXCEPTION/errCode';
import { ErrMsg } from 'EXCEPTION/errMsg';
import { MemeModel } from './entity/meme.model';
import { User } from 'COMMON/decorators/user.decorator';
import { UserModel } from 'SRC/user/entity/user.model';
import { Sticker } from './dataTypes/interface/sticker.interface';
import {
  differenceInMilliseconds,
  getDate,
  getHours,
  getMinutes,
  getMonth,
  getYear,
  toDate,
} from 'date-fns';
import { getClosestDeciminute } from 'COMMON/const/time.const';
import { pipe } from '@fxts/core';

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

  @Get('/:memeId/timespan')
  @HttpCode(HttpStatus.OK)
  async getMemesInTimespan(
    @Param('memeId') memeId: string,
    @Query('cursor') cursor: string,
  ) {
    if (isNaN(Number(cursor))) {
      throw new IntegrateException(
        ErrCode.PRECONDITION_FAILED,
        ErrMsg.PRECONDITION_FAILED,
        HttpStatus.BAD_REQUEST,
      );
    }
    const meme = await this.memeService.findMemeById(memeId);

    // 밈이 만들어진 시간과 가장 가까운 10분 간격을 계산한다
    const closestDeciminute = await pipe(
      meme.createdTs,
      getMinutes,
      getClosestDeciminute,
    );

    // 두 사이의 간격을 계산한다
    const difference = differenceInMilliseconds(
      toDate(meme.createdTs),
      new Date(
        getYear(meme.createdTs),
        getMonth(meme.createdTs),
        getDate(meme.createdTs),
        getHours(meme.createdTs),
        closestDeciminute,
      ),
    );

    // TODO: 클라이언트에 next cursor를 알려주어야 한다
    return this.memeService.findMemesByTimespan(
      {
        from: meme.createdTs - difference,
        to: meme.createdTs,
      },
      Number(cursor),
    );
  }

  @Put('/:memeId/stickers')
  @HttpCode(HttpStatus.OK)
  async putStickers(
    @Body('stickers') stickers: Sticker[],
    @Param('memeId') memeId: string,
  ) {
    return await this.memeService.putStickers(memeId, stickers);
  }

  private uploadImg = (img: Express.MulterS3.File): string => {
    if (!img)
      throw new IntegrateException(
        ErrCode.INVALID_IMG,
        ErrMsg.INVALID_IMG,
        HttpStatus.BAD_REQUEST,
      );
    return img.location;
  };
}
