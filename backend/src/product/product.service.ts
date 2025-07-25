import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common'; // Keep BadRequestException
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm'; // Keep In operator
import { Product } from '../database/entities/product.entity';
import { Shopkeeper } from '../database/entities/shopkeeper.entity';
import { ProductRequest, ProductRequestStatus } from '../database/entities/product-request.entity'; // Keep ProductRequest and ProductRequestStatus
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Shopkeeper)
    private shopkeepersRepository: Repository<Shopkeeper>,
    @InjectRepository(ProductRequest) // Keep ProductRequest repository injection
    private productRequestRepository: Repository<ProductRequest>,
  ) {}

  async create(createProductDto: CreateProductDto, shopkeeperId: string): Promise<Product> {
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

  // REVERTED: Changed back to original findAll without pagination
  async findAll(): Promise<Product[]> {
    return this.productsRepository.find({
      relations: ['shopkeeper'],
      order: {
        createdAt: 'DESC', // Keep sorting by createdAt
      },
    });
  }

  async findByShopkeeperId(shopkeeperId: string): Promise<Product[]> {
    const products = await this.productsRepository.find({
      where: { shopkeeper: { id: shopkeeperId } },
      relations: ['shopkeeper'],
    });
    return products;
  }

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

    // KEEP THIS LOGIC: Check for pending or accepted transfer requests
    const activeRequestsCount = await this.productRequestRepository.count({
      where: {
        product: { id: id },
        status: In([ProductRequestStatus.PENDING, ProductRequestStatus.ACCEPTED]),
      },
    });

    if (activeRequestsCount > 0) {
      throw new BadRequestException('This product cannot be deleted as it has pending or accepted transfer requests.');
    }
    // END KEPT LOGIC

    await this.productsRepository.remove(product);
  }
}
    