import { EntityNotFoundException } from '../../../../../common/exceptions/entity-not-found.exception';

export class SupplyNotFoundException extends EntityNotFoundException {
  constructor(identifier: string | number) {
    super('Insumo', identifier);
  }
}
