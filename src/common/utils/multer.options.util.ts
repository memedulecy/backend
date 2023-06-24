import { S3Client } from '@aws-sdk/client-s3';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { Env } from 'SRC/env/dataTypes/types/env.type';
import { EnvService } from 'SRC/env/env.service';
import multerS3 from 'multer-s3';
import path from 'path';

export const multerOptions = (envService: EnvService): MulterOptions => {
    const s3 = new S3Client({
        region: envService.get<string>(Env.AWS_BUCKET_REGION),
        credentials: {
            accessKeyId: envService.get<string>(Env.AWS_ACCESS_KEY_ID),
            secretAccessKey: envService.get<string>(Env.AWS_SECRET_ACCESS_KEY),
        },
    });

    return {
        storage: multerS3({
            s3,
            bucket: envService.get<string>(Env.AWS_BUCKET_NAME),
            key(_req, file, done) {
                const ext = path.extname(file.originalname);
                const basename = path.basename(file.originalname, ext);
                console.log('ext', ext);
                console.log('basename', basename);
                done(null, `${basename}_${Date.now()}${ext}`);
            },
        }),
        limits: { files: 5 * 1024 * 1024 },
    };
};
