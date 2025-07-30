import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Product } from './product.entity';
import { Shopkeeper } from './shopkeeper.entity';
import { ProductRequest } from './product-request.entity'; // Import ProductRequest

@Entity('product_transfer_history')
export class ProductTransferHistory extends BaseEntity {
  @ManyToOne(() => Product, { nullable: false, eager: true })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ type: 'uuid' }) // Storing product ID directly
  productId: string;

  @ManyToOne(() => Shopkeeper, { nullable: false, eager: true })
  @JoinColumn({ name: 'initiatorShopkeeperId' }) // The shopkeeper who sent the product
  initiatorShopkeeper: Shopkeeper;

  @Column({ type: 'uuid' })
  initiatorShopkeeperId: string;

  @ManyToOne(() => Shopkeeper, { nullable: false, eager: true })
  @JoinColumn({ name: 'receiverShopkeeperId' }) // The shopkeeper who received the product
  receiverShopkeeper: Shopkeeper;

  @Column({ type: 'uuid' })
  receiverShopkeeperId: string;

  @Column('int')
  quantityTransferred: number;

  @ManyToOne(() => ProductRequest, { nullable: true }) // Link to the original request
  @JoinColumn({ name: 'requestId' })
  request: ProductRequest;

  @Column({ type: 'uuid', nullable: true })
  requestId: string;

  @Column({ type: 'text', nullable: true })
  notes: string; // Any additional notes about the transfer
}
