export interface GpsBody {
    lat: number;
    long: number;
    token?: string;
}

export interface GpsData {
    location: [number, number];
    userId?: string;
}
