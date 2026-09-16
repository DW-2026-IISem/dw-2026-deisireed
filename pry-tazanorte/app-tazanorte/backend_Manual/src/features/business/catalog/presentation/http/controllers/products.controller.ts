import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ParsePositiveIntPipe } from '../../../../../../common/pipes/parse-positive-int.pipe';
import { CreateProductDto } from '../../../application/dto/create-product.dto';
import { UpdateProductDto } from '../../../application/dto/update-product.dto';
import { ProductFilterDto } from '../../../application/dto/product-filter.dto';
import { ProductResponseDto } from '../../../application/dto/product-response.dto';
import { CreateProductUseCase } from '../../../application/use-cases/create-product.use-case';
import { UpdateProductUseCase } from '../../../application/use-cases/update-product.use-case';
import { DeleteProductUseCase } from '../../../application/use-cases/delete-product.use-case';
import { GetProductUseCase } from '../../../application/use-cases/get-product.use-case';
import { ListProductsUseCase } from '../../../application/use-cases/list-products.use-case';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase,
    private readonly getProductUseCase: GetProductUseCase,
    private readonly listProductsUseCase: ListProductsUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear un producto' })
  @ApiCreatedResponse({ type: ProductResponseDto })
  create(@Body() dto: CreateProductDto) {
    return this.createProductUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar productos' })
  @ApiOkResponse({ type: [ProductResponseDto] })
  findAll(@Query() filter: ProductFilterDto) {
    return this.listProductsUseCase.execute(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un producto por ID' })
  @ApiOkResponse({ type: ProductResponseDto })
  findOne(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.getProductUseCase.execute(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un producto' })
  @ApiOkResponse({ type: ProductResponseDto })
  update(
    @Param('id', ParsePositiveIntPipe) id: number,
    @Body() dto: UpdateProductDto,
  ) {
    return this.updateProductUseCase.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un producto' })
  @ApiNoContentResponse()
  remove(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.deleteProductUseCase.execute(id);
  }
}
