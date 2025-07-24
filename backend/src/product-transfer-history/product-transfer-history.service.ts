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
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Shopkeeper)
    private shopkeeperRepository: Repository<Shopkeeper>,
  ) {}

  async findAllHistoryForShopkeeper(shopkeeperId: string): Promise<ProductTransferHistory[]> {
    return this.productTransferHistoryRepository.find({
      where: [
        { initiatorShopkeeper: { id: shopkeeperId } },
        { receiverShopkeeper: { id: shopkeeperId } },
      ],
      relations: ['product', 'initiatorShopkeeper', 'receiverShopkeeper', 'request'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOneHistory(id: string, shopkeeperId: string): Promise<ProductTransferHistory> {
    const historyRecord = await this.productTransferHistoryRepository.findOne({
      where: [
        { id, initiatorShopkeeper: { id: shopkeeperId } },
        { id, receiverShopkeeper: { id: shopkeeperId } },
      ],
      relations: ['product', 'initiatorShopkeeper', 'receiverShopkeeper', 'request'],
    });

    if (!historyRecord) {
      throw new NotFoundException(`Product transfer history record with ID "${id}" not found or unauthorized.`);
    }
    return historyRecord;
  }
}

