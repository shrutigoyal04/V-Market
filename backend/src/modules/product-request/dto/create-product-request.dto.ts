import { IsUUID, IsNumber, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateProductRequestDto {
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @IsUUID()
  @IsNotEmpty()
  requesterId: string; // The ID of the shopkeeper who will receive the product

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  quantity: number;
}
