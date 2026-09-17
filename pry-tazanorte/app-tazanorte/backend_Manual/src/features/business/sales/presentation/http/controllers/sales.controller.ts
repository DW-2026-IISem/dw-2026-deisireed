import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ParsePositiveIntPipe } from '../../../../../../common/pipes/parse-positive-int.pipe';
import { CreateSaleDto } from '../../../application/dto/create-sale.dto';
import { SaleFilterDto } from '../../../application/dto/sale-filter.dto';
import { SaleResponseDto } from '../../../application/dto/sale-response.dto';
import { CreateSaleUseCase } from '../../../application/use-cases/create-sale.use-case';
import { CancelSaleUseCase } from '../../../application/use-cases/cancel-sale.use-case';
import { GetSaleUseCase } from '../../../application/use-cases/get-sale.use-case';
import { ListSalesUseCase } from '../../../application/use-cases/list-sales.use-case';

@ApiTags('Sales')
@Controller('sales')
export class SalesController {
  constructor(
    private readonly createSaleUseCase: CreateSaleUseCase,
    private readonly cancelSaleUseCase: CancelSaleUseCase,
    private readonly getSaleUseCase: GetSaleUseCase,
    private readonly listSalesUseCase: ListSalesUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear una venta' })
  @ApiCreatedResponse({ type: SaleResponseDto })
  create(@Body() dto: CreateSaleDto) {
    return this.createSaleUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar ventas' })
  @ApiOkResponse({ type: [SaleResponseDto] })
  findAll(@Query() filter: SaleFilterDto) {
    return this.listSalesUseCase.execute(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una venta por ID' })
  @ApiOkResponse({ type: SaleResponseDto })
  findOne(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.getSaleUseCase.execute(id);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancelar una venta' })
  @ApiOkResponse({ type: SaleResponseDto })
  cancel(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.cancelSaleUseCase.execute(id);
  }
}
