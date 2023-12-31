export const Env = {
    PORT: 'PORT',
    DB_HOST: 'DB_HOST',
    DB_PORT: 'DB_PORT',
    DB_DATABASE: 'DB_DATABASE',
    DB_USERNAME: 'DB_USERNAME',
    DB_PASSWORD: 'DB_PASSWORD',
    AWS_BUCKET_REGION: 'AWS_BUCKET_REGION',
    AWS_BUCKET_NAME: 'AWS_BUCKET_NAME',
    AWS_ACCESS_KEY_ID: 'AWS_ACCESS_KEY_ID',
    AWS_SECRET_ACCESS_KEY: 'AWS_SECRET_ACCESS_KEY',
    JWT_KEY: 'JWT_KEY',
    KAKAO_BASE_URL: 'KAKAO_BASE_URL',
    KAKAO_REDIRECT_URI: 'KAKAO_REDIRECT_URI',
    KAKAO_DATA_URL: 'KAKAO_DATA_URL',
    KAKAO_CLIENT: 'KAKAO_CLIENT',
} as const;

export type Env = (typeof Env)[keyof typeof Env];
