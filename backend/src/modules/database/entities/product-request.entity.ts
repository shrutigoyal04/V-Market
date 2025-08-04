// backend/src/modules/database/entities/product-request.entity.ts
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Product } from './product.entity';
import { Shopkeeper } from './shopkeeper.entity';

export enum ProductRequestStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED', // <--- THIS MUST BE PRESENT AND CORRECTLY SPELLED/CAPITALIZED
}

@Entity('product_requests')
export class ProductRequest extends BaseEntity {
  @ManyToOne(() => Product, product => product.productRequests, { eager: true }) // eager: true to load product details automatically
  @JoinColumn({ name: 'productId' }) // Explicitly define join column name
  product: Product;

  @Column()
  productId: string; // Storing the product ID directly for relation reference

  @ManyToOne(() => Shopkeeper, shopkeeper => shopkeeper.sentRequests, { eager: true })
  @JoinColumn({ name: 'requesterId' }) // Shopkeeper requesting the product
  requester: Shopkeeper;

  @Column()
  requesterId: string;

  @ManyToOne(() => Shopkeeper, shopkeeper => shopkeeper.receivedRequests, { eager: true })
  @JoinColumn({ name: 'initiatorId' }) // Shopkeeper initiating the request (the owner of the product)
  initiator: Shopkeeper; // Renamed from 'owner' to 'initiator' for clarity in a request

  @Column()
  initiatorId: string;

  @Column('int')
  quantity: number;

  @Column({
    type: 'enum',
    enum: ProductRequestStatus,
    default: ProductRequestStatus.PENDING,
  })
  status: ProductRequestStatus;

  @Column({ nullable: true })
  notes: string;
}
