import { DomainException } from '../../../../../common/exceptions/domain.exception';

export class InsufficientStockException extends DomainException {
  constructor(productName: string, available: number, requested: number) {
    super(
      `Stock insuficiente para '${productName}': disponible ${available}, solicitado ${requested}`,
    );
  }
}
