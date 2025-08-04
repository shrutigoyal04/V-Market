// backend/src/modules/auth/auth.service.ts
import { Injectable, BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shopkeeper } from '../database/entities/shopkeeper.entity'; // Corrected Path: from auth to database (sibling in modules)
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Shopkeeper)
    private shopkeeperRepository: Repository<Shopkeeper>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingShopkeeper = await this.shopkeeperRepository.findOne({ where: { email: registerDto.email } });
    if (existingShopkeeper) {
      throw new BadRequestException('Email already registered.');
    }

    const shopkeeper = this.shopkeeperRepository.create(registerDto);
    await this.shopkeeperRepository.save(shopkeeper);
    return this.generateToken(shopkeeper);
  }

  async login(loginDto: LoginDto) {
    const shopkeeper = await this.shopkeeperRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!shopkeeper || !(await shopkeeper.validatePassword(loginDto.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateToken(shopkeeper);
  }

  private generateToken(shopkeeper: Shopkeeper) {
    const payload = { sub: shopkeeper.id, email: shopkeeper.email, shopName: shopkeeper.shopName, shopkeeperId: shopkeeper.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async getShopkeeperProfile(id: string) {
    const shopkeeper = await this.shopkeeperRepository.findOne({
      where: { id },
    });

    if (!shopkeeper) {
      throw new NotFoundException('Shopkeeper not found');
    }

    return shopkeeper;
  }
}