import { EntityNotFoundException } from '../../../../../common/exceptions/entity-not-found.exception';

export class PointsMovementNotFoundException extends EntityNotFoundException {
  constructor(identifier: string | number) {
    super('MovimientoPuntos', identifier);
  }
}
