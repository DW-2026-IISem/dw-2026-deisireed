import { EntityNotFoundException } from '../../../../../common/exceptions/entity-not-found.exception';

export class CashRegisterShiftNotFoundException extends EntityNotFoundException {
  constructor(identifier: string | number) {
    super('TurnoCaja', identifier);
  }
}
