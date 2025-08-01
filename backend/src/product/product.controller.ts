import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpCode, HttpStatus, Query } from '@nestjs/common'; // Add Query
import { AuthGuard } from '@nestjs/passport';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: {
    shopkeeperId: string;
    email: string;
    shopName: string;
  };
}

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProductDto: CreateProductDto, @Req() req: AuthenticatedRequest) {
    return this.productService.create(createProductDto, req.user.shopkeeperId);
  }

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

    return this.productService.findAll(actualPage, actualLimit, search);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('my-products')
  async findMyProducts(@Req() req: AuthenticatedRequest) {
    const shopkeeperId = req.user.shopkeeperId;
    const products = await this.productService.findByShopkeeperId(shopkeeperId);
    return { shopkeeperId, products };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Get('shop/:shopkeeperId')
  findShopkeeperProductsPublic(@Param('shopkeeperId') shopkeeperId: string) {
    return this.productService.findProductsByShopkeeperIdPublic(shopkeeperId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto, @Req() req: AuthenticatedRequest) {
    return this.productService.update(id, updateProductDto, req.user.shopkeeperId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.productService.remove(id, req.user.shopkeeperId);
  }
}
