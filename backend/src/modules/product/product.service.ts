import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common'; // Keep BadRequestException
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, ILike } from 'typeorm'; // Import ILike
import { Product } from '../database/entities/product.entity';
import { Shopkeeper } from '../database/entities/shopkeeper.entity';
import { ProductRequest, ProductRequestStatus } from '../database/entities/product-request.entity'; // Keep ProductRequest and ProductRequestStatus
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

// Utility function to normalize strings for search (backend equivalent)
const normalizeString = (str: string | null | undefined): string => {
  if (str === null || str === undefined) {
    return '';
  }
  return String(str) // Ensure it's treated as a string
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, '') // Remove anything that's not a letter, number, or whitespace
    .replace(/\s+/g, ' '); // Replace one or more whitespace characters with a single space
};


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

  async findAll(page: number = 1, limit: number = 10, search?: string): Promise<{ products: Product[]; total: number }> {
    const skip = (page - 1) * limit;
    
    let whereConditions: any = {};
    if (search) {
      const normalizedSearch = normalizeString(search); // Normalize the search term
      whereConditions = [
        { name: ILike(`%${normalizedSearch}%`) },
        { description: ILike(`%${normalizedSearch}%`) },
        { shopkeeper: { shopName: ILike(`%${normalizedSearch}%`) } }
      ];
    }

    const [products, total] = await this.productsRepository.findAndCount({
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
    