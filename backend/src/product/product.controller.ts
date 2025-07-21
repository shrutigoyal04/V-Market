import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Request } from 'express'; // Import Request from express

interface AuthenticatedRequest extends Request {
  user: {
    shopkeeperId: string; // Assuming your JWT strategy attaches shopkeeperId to req.user
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
  findAll() {
    return this.productService.findAll();
  }

  @UseGuards(AuthGuard('jwt')) // Protect this route
  @Get('my-products') // New endpoint for shopkeeper's own products
  findMyProducts(@Req() req: AuthenticatedRequest) {
    return this.productService.findByShopkeeperId(req.user.shopkeeperId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto, @Req() req: AuthenticatedRequest) {
    console.log('Shopkeeper ID from token:', req.user.shopkeeperId); // Add this line
    return this.productService.update(id, updateProductDto, req.user.shopkeeperId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.productService.remove(id, req.user.shopkeeperId);
  }
}
