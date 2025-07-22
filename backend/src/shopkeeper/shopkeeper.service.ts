// backend/src/shopkeeper/shopkeeper.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shopkeeper } from '../database/entities/shopkeeper.entity'; // Adjust path if needed

@Injectable()
export class ShopkeeperService {
  constructor(
    @InjectRepository(Shopkeeper)
    private shopkeeperRepository: Repository<Shopkeeper>,
  ) {}

  async findAll(): Promise<Shopkeeper[]> {
    // Exclude sensitive information like password when fetching all shopkeepers
    return this.shopkeeperRepository.find({
      select: ['id', 'email', 'shopName', 'address', 'phone', 'createdAt', 'updatedAt'],
    });
  }

  async findOne(id: string): Promise<Shopkeeper> {
    const shopkeeper = await this.shopkeeperRepository.findOne({
      where: { id },
      select: ['id', 'email', 'shopName', 'address', 'phone', 'createdAt', 'updatedAt'],
    });
    if (!shopkeeper) {
      throw new Error('Shopkeeper not found'); // Consider using NestJS NotFoundException
    }
    return shopkeeper;
  }
}