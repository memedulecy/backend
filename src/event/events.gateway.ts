import { Logger } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { EventType } from './datatypes/type/event.type';
import { ObjectId } from 'mongodb';
import { GpsBody, GpsData } from './datatypes/interface/gps.interface';
import { MemeService } from 'MEME/meme.service';

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
        if (gps.token) data.userId = new ObjectId('649673d0a81c659607d29cd1');
        this.socketMap.set(socket.id, data);
        await this.resendMemes(30);
        this.server.to(socket.id).emit(EventType.SEND_MEMES, this.socketMap.get(socket.id));
    }

    public resendMemes = async (distance: number) => {
        const VALUE_IDX = 1;
        const userIds = Array.from(this.socketMap)
            .filter(([key, { location, userId }]) => userId && distance === 30)
            .map(v => v[VALUE_IDX].userId);
    };
}
