import { DomainException } from '../../../../../common/exceptions/domain.exception';

export class UserEmailExistsException extends DomainException {
  constructor(email: string) {
    super(`El email ${email} ya está registrado`);
  }
}
