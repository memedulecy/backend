export const EventType = {
    SEND_GPS: 'sendGPS',
    SEND_MEMES: 'sendMemes',
    CREATE_MEME: 'createMeme',
} as const;
export type EventType = (typeof EventType)[keyof typeof EventType];
