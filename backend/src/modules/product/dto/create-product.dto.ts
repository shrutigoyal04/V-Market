import { IsString, IsNumber, IsOptional, IsNotEmpty, IsPositive, MinLength } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  name: string;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price: number;

  @IsNotEmpty()
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @IsPositive()
  quantity: number;

  @IsOptional()
  @IsString()
  description?: string;

  // Assuming imageUrl is a string URL, and it's optional
  @IsOptional()
  @IsString()
  imageUrl?: string;
}