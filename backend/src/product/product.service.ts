import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../database/entities/product.entity';
import { Shopkeeper } from '../database/entities/shopkeeper.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Shopkeeper)
    private shopkeepersRepository: Repository<Shopkeeper>,
  ) {}

  async create(createProductDto: CreateProductDto, shopkeeperId: string): Promise<Product> {
    // console.log('ProductService.create: shopkeeperId received:', shopkeeperId);
    const shopkeeper = await this.shopkeepersRepository.findOneBy({ id: shopkeeperId });
    if (!shopkeeper) {
      throw new NotFoundException('Shopkeeper not found.');
    }

    const product = this.productsRepository.create({
      ...createProductDto,
      shopkeeper: shopkeeper,
    });
    return this.productsRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return this.productsRepository.find({
      relations: ['shopkeeper'],
      order: {
        createdAt: 'DESC', // Sort by createdAt in descending order
      },
    });
  }

  // New method to find products by shopkeeper ID
  async findByShopkeeperId(shopkeeperId: string): Promise<Product[]> {
    // console.log('ProductService.findByShopkeeperId: Filtering by shopkeeperId:', shopkeeperId);
    const products = await this.productsRepository.find({
      where: { shopkeeper: { id: shopkeeperId } },
      relations: ['shopkeeper'],
    });
    // console.log('ProductService.findByShopkeeperId: Products found:', products);
    return products;
  }

  // NEW METHOD: Find products by any shopkeeper ID for public viewing
  async findProductsByShopkeeperIdPublic(shopkeeperId: string): Promise<Product[]> {
    const shopkeeper = await this.shopkeepersRepository.findOneBy({ id: shopkeeperId });
    if (!shopkeeper) {
      throw new NotFoundException('Shopkeeper not found.');
    }
    return this.productsRepository.find({
      where: { shopkeeper: { id: shopkeeperId } },
      relations: ['shopkeeper'],
    });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productsRepository.findOne({ where: { id }, relations: ['shopkeeper'] });
    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found.`);
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto, shopkeeperId: string): Promise<Product> {
    const product = await this.productsRepository.findOne({ where: { id }, relations: ['shopkeeper'] });

    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found.`);
    }

    if (product.shopkeeper.id !== shopkeeperId) {
      throw new ForbiddenException('You are not authorized to update this product.');
    }

    Object.assign(product, updateProductDto);
    return this.productsRepository.save(product);
  }

  async remove(id: string, shopkeeperId: string): Promise<void> {
    const product = await this.productsRepository.findOne({ where: { id }, relations: ['shopkeeper'] });

    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found.`);
    }

    if (product.shopkeeper.id !== shopkeeperId) {
      throw new ForbiddenException('You are not authorized to delete this product.');
    }

    await this.productsRepository.remove(product);
  }
}
    