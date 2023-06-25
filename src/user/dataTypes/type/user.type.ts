export const UserType = {
    KAKAO: 'kakao',
    NAVER: 'naver',
} as const;
export type UserType = (typeof UserType)[keyof typeof UserType];
