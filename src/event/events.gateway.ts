import { Logger } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { EventType } from './datatypes/type/event.type';
import { GpsBody, GpsData } from './datatypes/interface/gps.interface';
import { MemeService } from 'MEME/meme.service';
import getDistance from 'gps-distance';
import { socketMap } from 'COMMON/const/socketMap.const';
import { verify } from 'jsonwebtoken';
import { Env } from 'ENV/dataTypes/types/env.type';
import { EnvService } from 'ENV/env.service';

@WebSocketGateway(3000, { transports: ['websocket'], cors: true })
export class EventsGateway {
    private logger = new Logger('Gateway');
    @WebSocketServer()
    server: Server;

    constructor(private readonly memeService: MemeService) {}

    handleConnection(@ConnectedSocket() socket: Socket) {
        this.logger.log(`💛 ${socket.id} 소켓 연결 💛`);
    }

    handleDisconnect(@ConnectedSocket() socket: Socket) {
        socketMap.delete(socket.id);
        this.logger.log(`💛 ${socket.id} 소켓 연결 해제 💛`);
    }

    @SubscribeMessage(EventType.SEND_GPS)
    async handleGPSMessage(@ConnectedSocket() socket: Socket, @MessageBody() gps: GpsBody) {
        const data: GpsData = { location: [gps.long, gps.lat] };
        if (gps.token) {
            const decoded: { userId: string } = verify(gps.token, process.env.JWT_KEY);
            data.userId = decoded.userId;
        }
        socketMap.set(socket.id, data);
        await this.resendMemes();
    }

    @SubscribeMessage(EventType.CREATE_MEME)
    async handleMemeMessage() {
        await this.resendMemes();
    }

    private resendMemes = async () => {
        const VALUE_IDX = 1;
        await Promise.all(
            Array.from(socketMap).map(async targetData => {
                const socketId = targetData[0];
                const [long1, lat1] = targetData[VALUE_IDX].location;
                const userIds = Array.from(socketMap)
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
