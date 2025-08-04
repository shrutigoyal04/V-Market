// backend/src/modules/notification/notification.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseFilters, UseGuards, Inject, forwardRef, Logger } from '@nestjs/common';
import { WsAuthGuard } from '../../common/guards/ws-auth.guard';
import { WsExceptionFilter } from '../../common/filters/ws-exception.filter';
import { NotificationService } from './notification.service';
import { AuthenticatedSocket, AuthenticatedUser } from '../../common/interfaces/authenticated-socket.interface'; // Ensure AuthenticatedUser is imported
import { JwtService } from '@nestjs/jwt'; // Import JwtService for manual verification
import { AuthService } from '../../modules/auth/auth.service'; // Import AuthService for fetching shopkeeper profile
import { ConfigService } from '@nestjs/config';

@UseGuards(WsAuthGuard) // This guard still protects @SubscribeMessage methods
@UseFilters(new WsExceptionFilter())
@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  namespace: 'notifications',
})
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(NotificationGateway.name);

  constructor(
    @Inject(forwardRef(() => NotificationService))
    private readonly notificationService: NotificationService,
    private readonly jwtService: JwtService, // Injected to manually verify tokens
    private readonly configService: ConfigService,
    private readonly authService: AuthService, // Injected to fetch full user profile
  ) {}

  async handleConnection(client: AuthenticatedSocket) { // Made async because we're doing async operations (profile lookup)
    const token = client.handshake.auth.token as string; // Get token from the handshake data

    if (!token) {
      this.logger.warn(`Unauthenticated client connected: ${client.id}. Missing token. Disconnecting.`);
      client.emit('connectionError', { message: 'Authentication token is missing.' });
      client.disconnect(true); // Disconnect immediately if no token
      return;
    }

    try {
      // 1. Manually verify the JWT token using JwtService
      const jwtSecret = this.configService.get<string>('JWT_SECRET');
      const payload: any = this.jwtService.verify(token, {
        secret: jwtSecret,
      });

      // 2. Use AuthService to get the full shopkeeper profile, similar to your JwtStrategy's validate method
      const shopkeeper = await this.authService.getShopkeeperProfile(payload.sub);

      if (!shopkeeper) {
        throw new Error('User associated with token not found.');
      }

      // 3. Manually attach the authenticated user object to the client socket
      // This ensures client.user is available for subsequent logic in handleConnection
      client.user = {
        shopkeeperId: shopkeeper.id,
        email: shopkeeper.email,
        shopName: shopkeeper.shopName,
      } as AuthenticatedUser; // Cast to your AuthenticatedUser interface

      const { shopkeeperId } = client.user; // Now client.user exists and has shopkeeperId
      this.logger.log(`Client connected: ${client.id} for shopkeeper ${shopkeeperId}`);
      client.join(shopkeeperId); // Join the room specific to this shopkeeper
      client.emit('connectionSuccess', { message: `Successfully connected for shopkeeper ${shopkeeperId}.` });

    } catch (err: any) {
      this.logger.warn(`Authentication failed for client ${client.id}: ${err.message}. Disconnecting.`);
      client.emit('connectionError', { message: 'Authentication failed', details: err.message });
      client.disconnect(true); // Disconnect if authentication fails
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    const shopkeeperId = client.user?.shopkeeperId; // Using optional chaining now, as client.user might not be present if connection failed

    if (shopkeeperId) {
      this.logger.log(`Client disconnected: ${client.id} for shopkeeper ${shopkeeperId}`);
      client.leave(shopkeeperId);
    } else {
      this.logger.log(`Unauthenticated client disconnected: ${client.id}`);
    }
  }

  // @SubscribeMessage methods are still protected by @UseGuards(WsAuthGuard)
  // client.user will be populated by WsAuthGuard before these methods are called
  @SubscribeMessage('readNotification')
  async handleReadNotification(@ConnectedSocket() client: AuthenticatedSocket, @MessageBody('id') notificationId: string) {
    const shopkeeperId = client.user.shopkeeperId;
    const updatedNotification = await this.notificationService.markAsRead(notificationId, shopkeeperId);
    client.emit('notificationRead', updatedNotification);
  }

  sendNotificationToUser(shopkeeperId: string, event: string, payload: any) {
    this.server.to(shopkeeperId).emit(event, payload);
    this.logger.debug(`Emitted event "${event}" to shopkeeper ${shopkeeperId} room.`);
  }
}