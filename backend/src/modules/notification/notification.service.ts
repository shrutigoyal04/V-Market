// backend/src/modules/notification/notification.service.ts
import { Injectable, NotFoundException, UnauthorizedException, forwardRef, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull, In, LessThan } from 'typeorm';
import { Notification, NotificationType } from '../database/entities/notification.entity';
import { Shopkeeper } from '../database/entities/shopkeeper.entity';
import { ProductRequest, ProductRequestStatus } from '../database/entities/product-request.entity'; // Correctly includes CANCELLED now
import { ProductTransferHistory } from '../database/entities/product-transfer-history.entity';
import { Product } from '../database/entities/product.entity';
import { NotificationGateway } from './notification.gateway';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(Shopkeeper)
    private shopkeeperRepository: Repository<Shopkeeper>,
    @InjectRepository(ProductRequest)
    private productRequestRepository: Repository<ProductRequest>,
    @InjectRepository(ProductTransferHistory)
    private productTransferHistoryRepository: Repository<ProductTransferHistory>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @Inject(forwardRef(() => NotificationGateway))
    private notificationGateway: NotificationGateway,
  ) {}

  async createNotification(
    senderId: string | null,
    receiverId: string,
    type: NotificationType,
    message: string,
    relatedEntityId?: string | null,
    link?: string | null,
  ): Promise<Notification> {
    // --- CORRECTED: Directly instantiate and assign properties to bypass DeepPartial issues ---
    const notification = new Notification();
    notification.senderId = senderId; // Assign foreign key ID directly
    notification.receiverId = receiverId; // Assign foreign key ID directly
    notification.type = type;
    notification.message = message;
    notification.relatedEntityId = relatedEntityId;
    notification.link = link;
    notification.isRead = false;

    const savedNotification = await this.notificationRepository.save(notification);

    // Fetch with relations for sending via WebSocket, explicitly typing the result
    const populatedNotification: Notification | null = await this.notificationRepository.findOne({
        where: { id: savedNotification.id },
        relations: ['sender', 'receiver'],
    });

    if (populatedNotification) {
        this.notificationGateway.sendNotificationToUser(receiverId, 'notification.new', populatedNotification);
    }
    
    return savedNotification;
  }

  async getNotificationsForUser(userId: string, isRead?: boolean): Promise<Notification[]> {
    const findOptions: any = {
      where: {
        receiver: { id: userId },
      },
      relations: ['sender', 'receiver'],
      order: { createdAt: 'DESC' },
    };

    if (isRead !== undefined) {
      findOptions.where.isRead = isRead;
    }

    // This should now correctly return Notification[], resolving previous inference issues
    return this.notificationRepository.find(findOptions);
  }

  async markAsRead(notificationId: string, userId: string): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id: notificationId, receiver: { id: userId } },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found or not authorized.');
    }

    notification.isRead = true;
    const updatedNotification = await this.notificationRepository.save(notification);
    
    this.notificationGateway.sendNotificationToUser(userId, 'notification.updated', updatedNotification);
    return updatedNotification;
  }

  async markAllAsRead(userId: string): Promise<{ message: string }> {
    const result = await this.notificationRepository.update(
      { receiver: { id: userId }, isRead: false },
      { isRead: true },
    );

    if (result.affected && result.affected > 0) {
      this.notificationGateway.sendNotificationToUser(userId, 'notification.all-read', { message: 'All notifications marked as read.' });
    }
    return { message: `${result.affected || 0} notifications marked as read.` };
  }

  async deleteNotification(notificationId: string, shopkeeperId: string): Promise<void> {
    const result = await this.notificationRepository.delete({ id: notificationId, receiverId: shopkeeperId });

    if (result.affected === 0) {
      throw new NotFoundException(`Notification with ID ${notificationId} not found or you are not the receiver.`);
    }

    this.notificationGateway.sendNotificationToUser(shopkeeperId, 'notification.deleted', { id: notificationId });
  }

  async cleanupExpiredNotifications(): Promise<{ deleted: number }> {
    const result = await this.notificationRepository.delete({
      expiresAt: LessThan(new Date()),
    });
    console.log(`Cleaned up ${result.affected || 0} expired notifications.`);
    return { deleted: result.affected || 0 };
  }

  async handleProductRequestSent(productRequest: ProductRequest) {
    const fullProductRequest = await this.productRequestRepository.findOne({
      where: { id: productRequest.id },
      relations: ['product', 'requester', 'initiator'],
    });

    if (!fullProductRequest) {
      console.error('Product request not found for notification:', productRequest.id);
      return;
    }

    const message = `New product transfer request for "${fullProductRequest.product.name}" from "${fullProductRequest.initiator.shopName}" for quantity ${fullProductRequest.quantity}.`;
    await this.createNotification(
      fullProductRequest.initiator.id,    // senderId (product owner)
      fullProductRequest.requester.id,    // receiverId (shopkeeper receiving the request)
      NotificationType.PRODUCT_REQUEST_SENT,
      message,
      fullProductRequest.id,
      `/requests?requestId=${fullProductRequest.id}`
    );
  }

  async handleProductRequestStatusUpdate(productRequest: ProductRequest, newStatus: ProductRequestStatus) {
    const fullProductRequest = await this.productRequestRepository.findOne({
      where: { id: productRequest.id },
      relations: ['product', 'requester', 'initiator'],
    });

    if (!fullProductRequest) {
      console.error('Product request not found for notification update:', productRequest.id);
      return;
    }

    if (newStatus === ProductRequestStatus.ACCEPTED) {
      const message = `Your product transfer request for "${fullProductRequest.product.name}" (qty: ${fullProductRequest.quantity}) was ACCEPTED by "${fullProductRequest.requester.shopName}".`;
      await this.createNotification(
        fullProductRequest.requester.id,   // senderId (shopkeeper who accepted)
        fullProductRequest.initiator.id,   // receiverId (product owner)
        NotificationType.PRODUCT_REQUEST_ACCEPTED,
        message,
        fullProductRequest.id,
        `/requests?requestId=${fullProductRequest.id}`
      );
      this.notificationGateway.server
        .to(fullProductRequest.requester.id) // The requester's socket room
        .emit('productRequest.updated', {
          requestId: fullProductRequest.id,
          status: 'ACCEPTED',
          updatedRequest: fullProductRequest, // Optionally send the whole updated request
        });
    }
    // You can add similar logic for REJECTED or CANCELLED if needed
  }
}