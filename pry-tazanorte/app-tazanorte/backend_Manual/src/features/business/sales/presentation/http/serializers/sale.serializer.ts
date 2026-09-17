import { Sale } from '../../../domain/entities/sale.entity';
import { SaleResponseDto } from '../../../application/dto/sale-response.dto';
import { SaleMapper } from '../../../application/mappers/sale.mapper';

export class SaleSerializer {
  static serialize(entity: Sale): SaleResponseDto {
    return SaleMapper.toResponse(entity);
  }
}
