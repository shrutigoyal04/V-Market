import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express'; // Ensure Request is imported
import { Shopkeeper } from '../database/entities/shopkeeper.entity'; // Import Shopkeeper entity

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
    // Fetch the full shopkeeper profile using the shopkeeperId from the token
    const shopkeeper = await this.authService.getShopkeeperProfile(req.user.shopkeeperId);
    return shopkeeper; // Return the full shopkeeper object
  }
}
