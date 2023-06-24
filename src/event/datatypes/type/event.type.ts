export const EventType = {
    SEND_GPS: 'sendGPS',
    SEND_MEMES: 'sendMemes',
} as const;
export type EventType = (typeof EventType)[keyof typeof EventType];
