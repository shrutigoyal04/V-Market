import { Entity, Column, BeforeInsert, OneToMany } from 'typeorm';
import { IsEmail, MinLength, IsString, IsPhoneNumber } from 'class-validator';
import { BaseEntity } from './base.entity';
import * as bcrypt from 'bcrypt';
import { Product } from './product.entity';
import { ProductRequest } from './product-request.entity';
import { Notification } from './notification.entity';

@Entity('shopkeepers')
export class Shopkeeper extends BaseEntity {
  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @MinLength(6)
  password: string;

  @Column()
  @IsString()
  @MinLength(2)
  shopName: string;

  @Column()
  @IsString()
  address: string;

  @Column({ nullable: true })
  @IsPhoneNumber()
  phone: string;

  // One-to-Many relationships
  @OneToMany(() => Product, product => product.shopkeeper)
  products: Product[];

  @OneToMany(() => ProductRequest, request => request.requester)
  sentRequests: ProductRequest[]; // Requests initiated by this shopkeeper

  @OneToMany(() => ProductRequest, request => request.initiator)
  receivedRequests: ProductRequest[]; // Requests received by this shopkeeper (where this shopkeeper is the product owner)

  @OneToMany(() => Notification, notification => notification.sender)
  sentNotifications: Notification[]; // Notifications sent by this shopkeeper

  @OneToMany(() => Notification, notification => notification.receiver)
  receivedNotifications: Notification[]; // Notifications received by this shopkeeper


  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}