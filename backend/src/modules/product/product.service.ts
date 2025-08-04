import { Injectable, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Product } from '../database/entities/product.entity'; // Corrected Path: from product to database (sibling in modules)
import { Shopkeeper } from '../database/entities/shopkeeper.entity'; // Corrected Path: from product to database (sibling in modules)
import { ProductRequest, ProductRequestStatus } from '../database/entities/product-request.entity'; // Corrected Path: from product to database (sibling in modules)
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Shopkeeper)
    private shopkeeperRepository: Repository<Shopkeeper>,
  ) {}

  async create(createProductDto: CreateProductDto, shopkeeperId: string): Promise<Product> {
    const shopkeeper = await this.shopkeeperRepository.findOne({ where: { id: shopkeeperId } });
    if (!shopkeeper) {
      throw new NotFoundException(`Shopkeeper with ID ${shopkeeperId} not found.`);
    }

    const product = this.productRepository.create({
      ...createProductDto,
      shopkeeper,
    });
    return this.productRepository.save(product);
  }

  async findAll(page: number = 1, limit: number = 10, search?: string): Promise<{ products: Product[]; total: number }> {
    const skip = (page - 1) * limit;

    let whereConditions: any = {};
    if (search) {
      whereConditions = [
        { name: ILike(`%${search}%`) },
        { description: ILike(`%${search}%`) },
        { shopkeeper: { shopName: ILike(`%${search}%`) } },
      ];
    }

    const [products, total] = await this.productRepository.findAndCount({
      where: whereConditions,
      relations: ['shopkeeper'],
      order: {
        createdAt: 'DESC',
      },
      skip: skip,
      take: limit,
    });
    return { products, total };
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['shopkeeper'],
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found.`);
    }
    return product;
  }

  async findByShopkeeperId(shopkeeperId: string): Promise<Product[]> {
    const products = await this.productRepository.find({
      where: { shopkeeper: { id: shopkeeperId } },
      relations: ['shopkeeper'],
      order: {
        createdAt: 'DESC',
      },
    });
    return products;
  }

  async findProductsByShopId(shopkeeperId: string): Promise<Product[]> {
    const products = await this.productRepository.find({
      where: { shopkeeper: { id: shopkeeperId } },
      relations: ['shopkeeper'],
      order: {
        createdAt: 'DESC',
      },
    });
    return products;
  }

  async update(id: string, updateProductDto: UpdateProductDto, shopkeeperId: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['shopkeeper'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found.`);
    }
    if (product.shopkeeper.id !== shopkeeperId) {
      throw new UnauthorizedException('You are not authorized to update this product.');
    }

    const updatedProduct = this.productRepository.merge(product, updateProductDto);
    return this.productRepository.save(updatedProduct);
  }

  async delete(id: string, shopkeeperId: string): Promise<void> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['shopkeeper'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found.`);
    }
    if (product.shopkeeper.id !== shopkeeperId) {
      throw new UnauthorizedException('You are not authorized to delete this product.');
    }

    const pendingRequests = await this.productRepository.manager.getRepository(ProductRequest).find({
      where: {
        productId: id,
        status: ProductRequestStatus.PENDING,
      },
    });

    if (pendingRequests.length > 0) {
      throw new BadRequestException('Cannot delete product: There are pending transfer requests for this product.');
    }

    await this.productRepository.remove(product);
  }
}
    