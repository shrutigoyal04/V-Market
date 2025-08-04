// backend/src/modules/notification/notification.controller.ts
import { Controller, Get, UseGuards, Request, Param, Patch, Query, ParseBoolPipe, DefaultValuePipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { NotificationService } from './notification.service';
import { AuthenticatedRequest } from '../../common/interfaces/authenticated-socket.interface'; // Adjust path based on common folder location

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @UseGuards(AuthGuard('jwt')) // Protect HTTP endpoints with JWT AuthGuard
  @Get()
  async getNotifications(
    @Request() req: AuthenticatedRequest, // Type the request object
    @Query('isRead') isRead?: boolean, // Optional: filter by read status
  ) {
    const shopkeeperId = req.user.shopkeeperId; // Access shopkeeperId from authenticated user
    return this.notificationService.getNotificationsForUser(shopkeeperId, isRead);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/read')
  async markAsRead(@Request() req: AuthenticatedRequest, @Param('id') notificationId: string) {
    const shopkeeperId = req.user.shopkeeperId;
    return this.notificationService.markAsRead(notificationId, shopkeeperId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('mark-all-read')
  async markAllAsRead(@Request() req: AuthenticatedRequest) {
    const shopkeeperId = req.user.shopkeeperId;
    return this.notificationService.markAllAsRead(shopkeeperId);
  }
}
