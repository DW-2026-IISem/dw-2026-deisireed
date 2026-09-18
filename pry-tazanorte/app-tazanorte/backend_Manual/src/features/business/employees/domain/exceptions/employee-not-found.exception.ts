import { EntityNotFoundException } from '../../../../../common/exceptions/entity-not-found.exception';

export class EmployeeNotFoundException extends EntityNotFoundException {
  constructor(identifier: string | number) {
    super('Empleado', identifier);
  }
}
