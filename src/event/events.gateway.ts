import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import getDistance from 'gps-distance';
import { verify } from 'jsonwebtoken';
import { pipe, map, toArray, each, curry, filter } from '@fxts/core';

import { GpsBody, GpsData } from './datatypes/interface/gps.interface';
import { EventType } from './datatypes/type/event.type';
import { generateTimespan } from 'COMMON/const/time.const';
import { socketMap } from 'COMMON/const/socketMap.const';
import { MemeService } from 'MEME/meme.service';
import { MemeModel } from 'MEME/entity/meme.model';

@WebSocketGateway({ transports: ['websocket'], cors: true })
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
  async handleGPSMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() gps: GpsBody,
  ) {
    const data: GpsData = { location: [gps.long, gps.lat] };

    if (gps.token) {
      const decoded: { userId: string } = verify(
        gps.token,
        process.env.JWT_KEY,
      );
      data.userId = decoded.userId;
    }

    this.logger.log(
      `💜 ${socket.id} gps 정보 전송 [ lat: ${gps.lat} / long: ${gps.long} ] 💜`,
    );
    socketMap.set(socket.id, data);

    await this.resendMemes();
  }

  @SubscribeMessage(EventType.CREATE_MEME)
  async handleMemeMessage() {
    await this.resendMemes();
  }

  private resendMemes = async () => {
    interface User {
      location: Array<number>;
      userId: string;
      socketId: string;
    }

    type Meme = Partial<MemeModel>;
    type Memes = Array<Array<Meme>>;
    type MemeWithDistance = Meme & { distance: number };

    const users = (await pipe(
      socketMap,
      map(([socketId, userInfo]) => ({ ...userInfo, socketId })),
      filter(({ userId }) => userId),
      toArray,
    )) as Array<User>;

    const filterUsersByDistance = curry((users: Array<User>, user: User) => {
      return users.filter(({ location }) => {
        const [long1, lat1] = user.location;
        const [long2, lat2] = location;
        const distance = getDistance(lat1, long1, lat2, long2);
        const isInDistance = distance <= 50;

        return isInDistance;
      });
    });

    const getMemes = async (users: Array<User>): Promise<Memes> => {
      const findMemes = await pipe(
        users,
        map(({ userId }) => userId),
        toArray,
        curry(this.memeService.findByUserIds),
      );

      const findMemesWithTimespan = async (
        timespan: { lt: number; gte: number },
        limit: number,
      ) => await findMemes(timespan, limit);

      const timespans = await generateTimespan();

      return await Promise.all(
        timespans.map(
          async timespan => await findMemesWithTimespan(timespan, 5),
        ),
      );
    };

    const createDistanceMap = (
      users: Array<User>,
      userLocation: Array<number>,
    ) => {
      const distanceMap = new Map<string, number>();

      pipe(
        users,
        each(({ userId, location }) => {
          const [long1, lat1] = userLocation;
          const [long2, lat2] = location;
          const distance: number = getDistance(lat1, long1, lat2, long2);

          distanceMap.set(userId, distance);
        }),
      );

      return distanceMap;
    };

    const mapDistance = curry(
      (
        distanceMap: Map<string, number>,
        memes: Memes,
      ): Array<Array<MemeWithDistance>> =>
        memes.map((el: Array<Meme>) =>
          el.map((meme: Meme) => ({
            ...meme,
            distance: 1000 * distanceMap.get(meme.creator),
          })),
        ),
    );

    const sendMemesTo = curry(
      (socketId: string, memes: Array<Array<MemeWithDistance>>) => {
        this.server.to(socketId).emit(EventType.SEND_MEMES, memes);
      },
    );

    pipe(
      users,
      each(async user => {
        const filteredUsers = filterUsersByDistance(users, user);
        const memes = await getMemes(filteredUsers);
        const distanceMap = createDistanceMap(filteredUsers, user.location);
        const memesWithDistance = await mapDistance(distanceMap, memes);

        sendMemesTo(user.socketId, memesWithDistance);
      }),
    );
  };
}
