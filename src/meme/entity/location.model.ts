import { Column } from 'typeorm';

export class LocationModel {
    @Column({ comment: '위치 타입' })
    type: 'Point' = 'Point';

    @Column({ comment: '위경도' })
    coordinates: [number, number];

    constructor(lat: number, long: number) {
        this.coordinates = [long, lat];
    }
}
