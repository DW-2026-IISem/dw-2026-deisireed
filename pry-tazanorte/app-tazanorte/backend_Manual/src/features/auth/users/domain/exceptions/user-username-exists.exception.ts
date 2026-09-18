import { DomainException } from '../../../../../common/exceptions/domain.exception';

export class UserUsernameExistsException extends DomainException {
  constructor(username: string) {
    super(`El username ${username} ya está registrado`);
  }
}
