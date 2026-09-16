import { EntityNotFoundException } from '../../../../../common/exceptions/entity-not-found.exception';

export class ProductNotFoundException extends EntityNotFoundException {
  constructor(id: number) {
    super('Producto', id);
  }
}
