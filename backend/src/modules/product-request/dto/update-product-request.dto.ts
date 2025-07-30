// backend/src/product-request/dto/update-product-request.dto.ts
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ProductRequestStatus } from '../../database/entities/product-request.entity';
export class UpdateProductRequestDto {
  @IsEnum(ProductRequestStatus)
  @IsNotEmpty()
  status: ProductRequestStatus;
}
