// backend/src/shopkeeper/shopkeeper.controller.ts
import {
  Controller,
  Get,
  Param,
  Query,
  Patch,
  Body,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ShopkeeperService } from './shopkeeper.service';
import { UpdateShopkeeperDto } from './dto/update-shopkeeper.dto';

@Controller('shopkeeper')
export class ShopkeeperController {
  constructor(private readonly shopkeeperService: ShopkeeperService) {}

  @Get()
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search?: string,
  ) {
    // FIX: Ensure parseInt result is not NaN, fallback to defaults
    const parsedPage = parseInt(page, 10);
    const parsedLimit = parseInt(limit, 10);

    const actualPage = isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage;
    const actualLimit = isNaN(parsedLimit) || parsedLimit < 1 ? 10 : parsedLimit; // Keep 10 as default

    return this.shopkeeperService.findAll(actualPage, actualLimit, search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shopkeeperService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Param('id') id: string,
    @Body() updateShopkeeperDto: UpdateShopkeeperDto,
    @Req() req: any,
  ) {
    if (req.user.shopkeeperId !== id) {
      throw new UnauthorizedException(
        "You are not authorized to update this shopkeeper's profile",
      );
    }
    return this.shopkeeperService.update(id, updateShopkeeperDto);
  }
}