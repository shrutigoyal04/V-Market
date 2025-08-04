// backend/src/common/interfaces/authenticated-socket.interface.ts
import { Socket } from 'socket.io';
import { Request } from 'express'; // Import Request from express for HTTP context

// Define the structure of the user object that will be attached to authenticated requests/sockets
export interface AuthenticatedUser {
  shopkeeperId: string; // This MUST match the key used in your JWT payload
  email: string;
  // Add any other user-related properties that are part of your JWT payload
}

// Interface for HTTP requests authenticated by JWT (e.g., in controllers)
export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser; // <--- The user object is attached to 'user' property
}

// Interface for WebSocket sockets authenticated by JWT
export interface AuthenticatedSocket extends Socket {
  user: AuthenticatedUser; // <--- The user object is attached to 'user' property
}
