import { Logger } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway(3000, { transports: ['websocket'], cors: true })
export class EventsGateway {
    private logger = new Logger('Gateway');
    private socketMap = new Map();
    @WebSocketServer()
    server: Server;

    handleConnection(@ConnectedSocket() socket: Socket) {
        this.socketMap.set(socket.id, 1);
        this.logger.log(`${socket.id} 소켓 연결`);
    }

    handleDisconnect(@ConnectedSocket() socket: Socket) {
        this.socketMap.delete(socket.id);
        this.logger.log(`${socket.id} 소켓 연결 해제 ❌`);
    }

    @SubscribeMessage('sendGPS')
    async handleMessage(@ConnectedSocket() socket: Socket, @MessageBody() gps: { lat: number; long: number }) {
        this.socketMap.set(socket.id, [gps.long, gps.lat]);
        this.server.to(socket.id + 1).emit('sendMemes', this.socketMap.get(socket.id));
    }
}
