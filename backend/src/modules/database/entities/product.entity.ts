    // backend/src/modules/database/entities/product.entity.ts
    import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm'; // Import OneToMany
    import { BaseEntity } from './base.entity';
    import { Shopkeeper } from './shopkeeper.entity'; // Import Shopkeeper
    import { ProductRequest } from './product-request.entity'; // Import ProductRequest

    @Entity('products')
    export class Product extends BaseEntity {
      @Column()
      name: string;

      @Column({ type: 'text', nullable: true })
      description: string;

      @Column('decimal', { precision: 10, scale: 2 })
      price: number;

      @Column('int')
      quantity: number;

      @Column({ nullable: true })
      imageUrl: string;

      @Column({ type: 'uuid' })
      shopkeeperId: string;

      @ManyToOne(() => Shopkeeper, shopkeeper => shopkeeper.products)
      @JoinColumn({ name: 'shopkeeperId' })
      shopkeeper: Shopkeeper;

      @OneToMany(() => ProductRequest, productRequest => productRequest.product) // Inverse relationship
      productRequests: ProductRequest[];
    }