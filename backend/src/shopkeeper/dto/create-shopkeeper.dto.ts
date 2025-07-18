import { IsEmail, IsString, MinLength, IsPhoneNumber, IsOptional } from 'class-validator';

export class CreateShopkeeperDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsString()
    @MinLength(2)
    shopName: string;

    @IsString()
    address: string;

    @IsPhoneNumber()
    @IsOptional()
    phone?: string;
}