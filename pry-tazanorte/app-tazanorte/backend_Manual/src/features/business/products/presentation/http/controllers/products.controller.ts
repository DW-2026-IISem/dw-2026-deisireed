import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateProductDto } from '../../../application/dto/create-product.dto';
import { ProductResponseDto } from '../../../application/dto/product-response.dto';
import { CreateProductUseCase } from '../../../application/use-cases/create-product.use-case';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly createProductUseCase: CreateProductUseCase) {}

  @Post()
  @ApiOperation({ summary: 'Crear un producto' })
  @ApiCreatedResponse({ type: ProductResponseDto })
  create(@Body() dto: CreateProductDto) {
    return this.createProductUseCase.execute(dto);
  }
}
