// backend/src/common/guards/ws-auth.guard.ts
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { AuthenticatedSocket, AuthenticatedUser } from '../interfaces/authenticated-socket.interface'; // Ensure AuthenticatedUser is imported

@Injectable()
export class WsAuthGuard extends AuthGuard('jwt') implements CanActivate {
  constructor() {
    super();
  }

  // Override getRequest to explicitly return AuthenticatedSocket
  getRequest(context: ExecutionContext): AuthenticatedSocket {
    return context.switchToWs().getClient<AuthenticatedSocket>(); // Explicitly cast here
  }

  // Override handleRequest to attach the authenticated user to the WebSocket client
  handleRequest<TUser = any>(err: any, user: TUser, info: any, context: ExecutionContext, status?: any): TUser {
    if (err || !user) {
      throw err || new UnauthorizedException('WebSocket Unauthorized');
    }
    const client: AuthenticatedSocket = this.getRequest(context);
    client.user = user as unknown as AuthenticatedUser; // <--- Corrected cast: cast to unknown first
    return user;
  }

  // canActivate is automatically called by AuthGuard
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }
}