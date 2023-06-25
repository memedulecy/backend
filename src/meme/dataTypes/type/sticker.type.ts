// type StickerTypes ="glasses" | "heart" | "laugh" | "monkey" | "words";

export const StickerType = {
    GLASSES: 'glasses',
    HEART: 'heart',
    LAUGH: 'laugh',
    MONKEY: 'monkey',
    WORDS: 'words',
};

export type StickerType = (typeof StickerType)[keyof typeof StickerType];
