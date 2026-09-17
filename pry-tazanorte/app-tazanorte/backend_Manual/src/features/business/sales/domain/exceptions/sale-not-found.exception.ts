import { EntityNotFoundException } from '../../../../../common/exceptions/entity-not-found.exception';

export class SaleNotFoundException extends EntityNotFoundException {
  constructor(id: number) {
    super('Venta', id);
  }
}
