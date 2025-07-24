import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { ProductTransferHistoryService } from './product-transfer-history.service';
import { AuthGuard } from '@nestjs/passport'; // Correct import for AuthGuard
import { Shopkeeper } from '../database/entities/shopkeeper.entity'; // This import might not be strictly needed here, but keeping for now

@Controller('product-transfer-history')
@UseGuards(AuthGuard('jwt')) // Correct usage of AuthGuard with 'jwt' strategy
export class ProductTransferHistoryController {
  constructor(private readonly productTransferHistoryService: ProductTransferHistoryService) {}

  @Get()
  async findAll(@Request() req: any) {
    console.log('ProductTransferHistoryController: req.user in findAll', req.user); // TEMPORARY LOG - you can remove this after verification
    const shopkeeperId = req.user.shopkeeperId; // Assuming shopkeeperId is in the JWT payload
    return this.productTransferHistoryService.findAllHistoryForShopkeeper(shopkeeperId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: any) {
    console.log('ProductTransferHistoryController: req.user in findOne', req.user); // TEMPORARY LOG - you can remove this after verification
    const shopkeeperId = req.user.shopkeeperId;
    return this.productTransferHistoryService.findOneHistory(id, shopkeeperId);
  }
}

