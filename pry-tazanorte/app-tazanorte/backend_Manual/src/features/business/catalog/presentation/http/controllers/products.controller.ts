import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CreateProductUseCase } from '../../../application/use-cases/create-product.use-case';
import { GetProductByIdUseCase } from '../../../application/use-cases/get-product-by-id.use-case';
import { ListProductsUseCase } from '../../../application/use-cases/list-products.use-case';
import { CreateProductDto } from '../../../application/dto/create-product.dto';

@ApiTags('Products')
@ApiBearerAuth()
@Controller('products')
export class ProductsController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly getProductByIdUseCase: GetProductByIdUseCase,
    private readonly listProductsUseCase: ListProductsUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo producto' })
  create(@Body() dto: CreateProductDto) {
    return this.createProductUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los productos' })
  findAll() {
    return this.listProductsUseCase.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un producto por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.getProductByIdUseCase.execute(id);
  }
}
