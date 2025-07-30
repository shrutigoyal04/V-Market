// backend/src/shopkeeper/shopkeeper.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm'; // Import ILike
import { Shopkeeper } from '../database/entities/shopkeeper.entity';
import { UpdateShopkeeperDto } from './dto/update-shopkeeper.dto';

@Injectable()
export class ShopkeeperService {
  constructor(
    @InjectRepository(Shopkeeper)
    private shopkeeperRepository: Repository<Shopkeeper>,
  ) {}

  async findAll(page: number = 1, limit: number = 10, search?: string): Promise<{ shopkeepers: Shopkeeper[]; total: number }> {
    const skip = (page - 1) * limit;

    let whereConditions: any = {};
    if (search) {
      whereConditions = [
        { shopName: ILike(`%${search}%`) },
        { email: ILike(`%${search}%`) }
      ];
    }

    const [shopkeepers, total] = await this.shopkeeperRepository.findAndCount({
      where: whereConditions,
      select: ['id', 'email', 'shopName', 'address', 'phone', 'createdAt', 'updatedAt'],
      order: {
        createdAt: 'DESC',
      },
      skip: skip,
      take: limit,
    });
    return { shopkeepers, total };
  }

  async findOne(id: string): Promise<Shopkeeper> {
    const shopkeeper = await this.shopkeeperRepository.findOne({
      where: { id },
      select: ['id', 'email', 'shopName', 'address', 'phone', 'createdAt', 'updatedAt'],
    });
    if (!shopkeeper) {
      throw new NotFoundException('Shopkeeper not found');
    }
    return shopkeeper;
  }

  async update(id: string, updateShopkeeperDto: UpdateShopkeeperDto): Promise<Shopkeeper> {
    const shopkeeper = await this.shopkeeperRepository.preload({
      id: id,
      ...updateShopkeeperDto,
    });

    if (!shopkeeper) {
      throw new NotFoundException(`Shopkeeper with ID ${id} not found`);
    }
    return this.shopkeeperRepository.save(shopkeeper);
  }
}