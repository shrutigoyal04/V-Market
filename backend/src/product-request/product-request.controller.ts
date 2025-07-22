// backend/src/product-request/product-request.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProductRequestService } from './product-request.service';
import { CreateProductRequestDto } from './dto/create-product-request.dto';
import { UpdateProductRequestDto } from './dto/update-product-request.dto';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: {
    shopkeeperId: string;
    email: string;
  };
}

@Controller('product-requests')
@UseGuards(AuthGuard('jwt')) // All routes in this controller require authentication
export class ProductRequestController {
  constructor(private readonly productRequestService: ProductRequestService) {}

  @Post('export') // Endpoint for initiator to create an export request
  @HttpCode(HttpStatus.CREATED)
  createExportRequest(@Req() req: AuthenticatedRequest, @Body() createProductRequestDto: CreateProductRequestDto) {
    return this.productRequestService.createExportRequest(req.user.shopkeeperId, createProductRequestDto);
  }

  @Get() // Get all requests related to the logged-in shopkeeper (as initiator or requester)
  findAllForShopkeeper(@Req() req: AuthenticatedRequest) {
    return this.productRequestService.findAllRequestsForShopkeeper(req.user.shopkeeperId);
  }

  @Get(':id') // Get a single request
  findOne(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.productRequestService.findOneRequest(id, req.user.shopkeeperId);
  }

  @Patch(':id/status') // Endpoint for initiator to update request status (accept/reject)
  updateStatus(@Param('id') id: string, @Req() req: AuthenticatedRequest, @Body() updateProductRequestDto: UpdateProductRequestDto) {
    return this.productRequestService.updateRequestStatus(id, req.user.shopkeeperId, updateProductRequestDto);
  }

  @Delete(':id') // Endpoint for initiator to cancel a pending request
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.productRequestService.removeRequest(id, req.user.shopkeeperId);
  }
}
