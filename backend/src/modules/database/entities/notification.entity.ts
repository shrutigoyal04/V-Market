// backend/src/modules/database/entities/notification.entity.ts
import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Shopkeeper } from './shopkeeper.entity';

export enum NotificationType {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  PRODUCT_REQUEST_SENT = 'PRODUCT_REQUEST_SENT',
  PRODUCT_REQUEST_ACCEPTED = 'PRODUCT_REQUEST_ACCEPTED',
  PRODUCT_REQUEST_REJECTED = 'PRODUCT_REQUEST_REJECTED',
  PRODUCT_REQUEST_CANCELLED = 'PRODUCT_REQUEST_CANCELLED',
}

@Entity('notifications')
@Index(['receiverId', 'isRead', 'createdAt'])
export class Notification extends BaseEntity {
  @Column({ type: 'enum', enum: NotificationType, default: NotificationType.INFO })
  type: NotificationType;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'text', nullable: true })
  link?: string | null;

  @Column({ default: false })
  isRead: boolean;

  @Column({ type: 'text', nullable: true }) // <--- CORRECTED: Explicitly set type to 'text'
  relatedEntityId?: string | null;

  @Column({ nullable: true, type: 'timestamp with time zone' })
  expiresAt?: Date;

  @ManyToOne(() => Shopkeeper, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'senderId' })
  sender?: Shopkeeper | null;

  @Column({ nullable: true })
  senderId?: string | null;

  @ManyToOne(() => Shopkeeper, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'receiverId' })
  receiver: Shopkeeper;

  @Column()
  receiverId: string;
}