// backend/src/modules/auth/auth.controller.ts
import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Shopkeeper } from '../database/entities/shopkeeper.entity'; // Corrected Path: from auth to database (sibling in modules)

interface AuthenticatedRequest extends Request {
  user: {
    shopkeeperId: string;
    email: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto);
    return result;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  async getProfile(@Req() req: AuthenticatedRequest) {
    const shopkeeper = await this.authService.getShopkeeperProfile(req.user.shopkeeperId);
    return shopkeeper;
  }
}