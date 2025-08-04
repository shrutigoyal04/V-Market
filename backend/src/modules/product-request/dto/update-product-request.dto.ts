// backend/src/modules/product-request/dto/update-product-request.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateProductRequestDto } from './create-product-request.dto';
import { ProductRequestStatus } from '../../database/entities/product-request.entity'; // Corrected Path: from product-request/dto up to product-request, then down to database/entities
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateProductRequestDto extends PartialType(CreateProductRequestDto) {
  @IsOptional()
  @IsEnum(ProductRequestStatus)
  status?: ProductRequestStatus;
}
