import { Logger } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { EventType } from './datatypes/type/event.type';
import { ObjectId } from 'mongodb';
import { GpsBody, GpsData } from './datatypes/interface/gps.interface';
import { MemeService } from 'MEME/meme.service';
import getDistance from 'gps-distance';

@WebSocketGateway(3000, { transports: ['websocket'], cors: true })
export class EventsGateway {
    private logger = new Logger('Gateway');
    private socketMap: Map<string, GpsData> = new Map();
    @WebSocketServer()
    server: Server;

    constructor(private readonly memeService: MemeService) {}

    handleConnection(@ConnectedSocket() socket: Socket) {
        this.logger.log(`💛 ${socket.id} 소켓 연결 💛`);
    }

    handleDisconnect(@ConnectedSocket() socket: Socket) {
        this.socketMap.delete(socket.id);
        this.logger.log(`💛 ${socket.id} 소켓 연결 해제 💛`);
    }

    @SubscribeMessage(EventType.SEND_GPS)
    async handleMessage(@ConnectedSocket() socket: Socket, @MessageBody() gps: GpsBody) {
        const data: GpsData = { location: [gps.long, gps.lat] };
        if (gps.token) data.userId = '649673d0a81c659607d29cd1';
        this.socketMap.set(socket.id, data);
        await this.resendMemes();
    }

    public resendMemes = async () => {
        const VALUE_IDX = 1;
        await Promise.all(
            Array.from(this.socketMap).map(async targetData => {
                const socketId = targetData[0];
                const [long1, lat1] = targetData[VALUE_IDX].location;
                const userIds = Array.from(this.socketMap)
                    .filter(socketData => {
                        if (!socketData[VALUE_IDX].userId || targetData[VALUE_IDX].userId === socketData[VALUE_IDX].userId) return false;
                        const [long2, lat2] = socketData[VALUE_IDX].location;
                        return getDistance(lat1, long1, lat2, long2) <= 1;
                    })
                    .map(v => v[VALUE_IDX].userId);
                const memes = await this.memeService.findByUserIds(userIds);
                this.server.to(socketId).emit(EventType.SEND_MEMES, memes);
            }),
        );
    };
}
