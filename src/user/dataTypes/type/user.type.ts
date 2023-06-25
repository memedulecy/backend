export const UserType = {
    KAKAO: 'kakao',
} as const;
export type UserType = (typeof UserType)[keyof typeof UserType];
