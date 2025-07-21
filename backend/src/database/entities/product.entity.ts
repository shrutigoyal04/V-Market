import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Shopkeeper } from './shopkeeper.entity';

@Entity('products')
export class Product extends BaseEntity {
  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  quantity: number;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  imageUrl: string;

  @ManyToOne(() => Shopkeeper, shopkeeper => shopkeeper.products)
  shopkeeper: Shopkeeper;
}