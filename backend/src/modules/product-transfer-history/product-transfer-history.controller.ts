import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { ProductTransferHistoryService } from './product-transfer-history.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedRequest } from '../../common/interfaces/authenticated-socket.interface'; // Import AuthenticatedRequest

@Controller('product-transfer-history')
@UseGuards(AuthGuard('jwt'))
export class ProductTransferHistoryController {
  constructor(private readonly productTransferHistoryService: ProductTransferHistoryService) {}

  @Get()
  async findAll(@Request() req: AuthenticatedRequest) { // Type req as AuthenticatedRequest
    const shopkeeperId = req.user.shopkeeperId; // Access shopkeeperId from the user object
    return this.productTransferHistoryService.findAllForShopkeeper(shopkeeperId); // Corrected method name
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: AuthenticatedRequest) { // Type req as AuthenticatedRequest
    // Note: The service's findOne doesn't take shopkeeperId, only the record ID.
    // If you need to authorize this, add logic in the service (e.g., check if record belongs to shopkeeperId)
    return this.productTransferHistoryService.findOne(id); // Corrected method name
  }
}

