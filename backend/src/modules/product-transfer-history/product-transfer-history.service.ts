import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductTransferHistory } from '../database/entities/product-transfer-history.entity';
import { Product } from '../database/entities/product.entity';
import { Shopkeeper } from '../database/entities/shopkeeper.entity';

@Injectable()
export class ProductTransferHistoryService {
  constructor(
    @InjectRepository(ProductTransferHistory)
    private productTransferHistoryRepository: Repository<ProductTransferHistory>,
  ) {}

  async findAllForShopkeeper(shopkeeperId: string): Promise<ProductTransferHistory[]> {
    return this.productTransferHistoryRepository.find({
      where: [
        { initiatorShopkeeperId: shopkeeperId },
        { receiverShopkeeperId: shopkeeperId },
      ],
      relations: ['product', 'initiatorShopkeeper', 'receiverShopkeeper', 'request'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: string): Promise<ProductTransferHistory> {
    const record = await this.productTransferHistoryRepository.findOne({
      where: { id },
      relations: ['product', 'initiatorShopkeeper', 'receiverShopkeeper', 'request'],
    });
    if (!record) {
      throw new NotFoundException(`Product transfer history record with ID ${id} not found.`);
    }
    return record;
  }
}

