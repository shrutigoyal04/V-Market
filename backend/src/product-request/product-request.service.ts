import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ProductRequest, ProductRequestStatus } from '../database/entities/product-request.entity';
import { Product } from '../database/entities/product.entity';
import { Shopkeeper } from '../database/entities/shopkeeper.entity';
import { CreateProductRequestDto } from './dto/create-product-request.dto';
import { UpdateProductRequestDto } from './dto/update-product-request.dto';

@Injectable()
export class ProductRequestService {
  constructor(
    @InjectRepository(ProductRequest)
    private productRequestRepository: Repository<ProductRequest>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Shopkeeper)
    private shopkeeperRepository: Repository<Shopkeeper>,
    private dataSource: DataSource, // Inject DataSource for transactions
  ) {}

  // Initiator (owner of product) makes an export request
  async createExportRequest(
    initiatorId: string, // The shopkeeper initiating the export (owner of product)
    createProductRequestDto: CreateProductRequestDto,
  ): Promise<ProductRequest> {
    const { productId, requesterId, quantity } = createProductRequestDto;

    // 1. Verify product exists and belongs to initiator
    const product = await this.productRepository.findOne({
      where: { id: productId, shopkeeper: { id: initiatorId } },
      relations: ['shopkeeper'],
    });
    if (!product) {
      throw new NotFoundException('Product not found or does not belong to you.');
    }
    if (product.quantity < quantity) {
      throw new BadRequestException('Requested quantity exceeds available stock.');
    }

    // 2. Verify requester exists and is not the initiator
    const requester = await this.shopkeeperRepository.findOneBy({ id: requesterId });
    if (!requester) {
      throw new NotFoundException('Requester shopkeeper not found.');
    }
    if (requesterId === initiatorId) {
      throw new BadRequestException('Cannot make a request to yourself.');
    }

    // 3. Create the product request
    const productRequest = this.productRequestRepository.create({
      product,
      productId: product.id,
      requester,
      requesterId: requester.id,
      initiator: product.shopkeeper, // The owner of the product is the initiator
      initiatorId: initiatorId,
      quantity,
      status: ProductRequestStatus.PENDING,
    });

    return this.productRequestRepository.save(productRequest);
  }

  // Requester (target shopkeeper) makes an import request (similar to createExportRequest, but semantic difference)
  // This could also be a separate endpoint, but for now, it's covered by createExportRequest
  // as the initiating shopkeeper is always the product owner.

  async findAllRequestsForShopkeeper(shopkeeperId: string): Promise<ProductRequest[]> {
    return this.productRequestRepository.find({
      // Corrected 'where' clause for OR condition
      where: [
        { initiator: { id: shopkeeperId } },
        { requester: { id: shopkeeperId } },
      ],
      relations: ['product', 'requester', 'initiator'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOneRequest(id: string, shopkeeperId: string): Promise<ProductRequest> {
    const request = await this.productRequestRepository.findOne({
      // Corrected 'where' clause for OR condition
      where: [
        { id, initiator: { id: shopkeeperId } }, // Option 1: Request with ID and initiator is current shopkeeper
        { id, requester: { id: shopkeeperId } }, // Option 2: Request with ID and requester is current shopkeeper
      ],
      relations: ['product', 'requester', 'initiator'],
    });

    if (!request) {
      throw new NotFoundException(`Product request with ID "${id}" not found or unauthorized.`);
    }
    return request;
  }

  // Initiator (product owner) accepts/rejects the request
  async updateRequestStatus(
    requestId: string,
    currentShopkeeperId: string, // The ID of the shopkeeper currently logged in
    updateProductRequestDto: UpdateProductRequestDto,
  ): Promise<ProductRequest> {
    const { status } = updateProductRequestDto;

    const request = await this.productRequestRepository.findOne({
      where: { id: requestId },
      relations: ['product', 'initiator', 'requester'],
    });

    if (!request) {
      throw new NotFoundException(`Product request with ID "${requestId}" not found.`);
    }

    // --- CRITICAL FIX HERE: Change authorization logic ---
    // A request can be accepted/rejected ONLY by the requester
    // A request can be CANCELLED by the initiator (handled in removeRequest or a separate status)
    // Here, for ACCEPTED/REJECTED, only the requester can perform it.
    if (request.requester.id !== currentShopkeeperId) {
      throw new ForbiddenException('You are not authorized to accept or reject this request.');
    }
    // --- END CRITICAL FIX ---

    if (request.status !== ProductRequestStatus.PENDING) {
      throw new BadRequestException(`Request is already ${request.status}. Cannot change status.`);
    }

    // Handle ACCEPTED status with transaction
    if (status === ProductRequestStatus.ACCEPTED) {
      if (request.product.quantity < request.quantity) {
        throw new BadRequestException('Insufficient stock to fulfill the request.');
      }

      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        // 1. Decrease initiator's product quantity
        request.product.quantity -= request.quantity;
        await queryRunner.manager.save(request.product);

        // 2. Increase requester's product quantity (create if not exists, update if exists)
        let requesterProduct = await this.productRepository.findOne({
          where: { name: request.product.name, shopkeeper: { id: request.requesterId } },
        });

        if (requesterProduct) {
          requesterProduct.quantity += request.quantity;
          await queryRunner.manager.save(requesterProduct);
        } else {
          // Create new product for requester if they don't have it
          const newProduct = this.productRepository.create({
            name: request.product.name,
            description: request.product.description,
            price: request.product.price,
            imageUrl: request.product.imageUrl,
            quantity: request.quantity,
            shopkeeper: request.requester,
          });
          await queryRunner.manager.save(newProduct);
        }

        // 3. Update request status to ACCEPTED
        request.status = ProductRequestStatus.ACCEPTED;
        const updatedRequest = await queryRunner.manager.save(request);

        await queryRunner.commitTransaction();
        return updatedRequest;

      } catch (err) {
        await queryRunner.rollbackTransaction();
        throw err;
      } finally {
        await queryRunner.release();
      }
    } else if (status === ProductRequestStatus.REJECTED) {
      request.status = ProductRequestStatus.REJECTED;
      return this.productRequestRepository.save(request);
    } else {
      throw new BadRequestException('Invalid status update. Only ACCEPTED or REJECTED are allowed.');
    }
  }

  // For completeness, a method to remove requests (e.g., initiator can cancel pending request)
  // This method's logic is fine as initiator should be able to cancel.
  async removeRequest(requestId: string, shopkeeperId: string): Promise<void> {
    const request = await this.productRequestRepository.findOne({
      where: { id: requestId },
      relations: ['initiator'],
    });

    if (!request) {
      throw new NotFoundException(`Product request with ID "${requestId}" not found.`);
    }

    // Only the initiator can cancel a pending request
    if (request.initiator.id !== shopkeeperId || request.status !== ProductRequestStatus.PENDING) {
      throw new ForbiddenException('You are not authorized to cancel this request or it is not pending.');
    }

    await this.productRequestRepository.remove(request);
  }
}
