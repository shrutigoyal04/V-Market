// backend/src/shopkeeper/shopkeeper.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { ShopkeeperService } from './shopkeeper.service';

@Controller('shopkeeper') // This defines the base route for this controller
export class ShopkeeperController {
  constructor(private readonly shopkeeperService: ShopkeeperService) {}

  @Get() // Handles GET /shopkeeper
  findAll() {
    return this.shopkeeperService.findAll();
  }

  @Get(':id') // Handles GET /shopkeeper/:id
  findOne(@Param('id') id: string) {
    return this.shopkeeperService.findOne(id);
  }
}