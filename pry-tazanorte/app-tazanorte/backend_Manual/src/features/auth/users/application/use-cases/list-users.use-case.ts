import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from '../../domain/interfaces/user-repository.interface';
import type { IUserRepository } from '../../domain/interfaces/user-repository.interface';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class ListUsersUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute() {
    const users = await this.userRepository.findAll();
    return users.map(UserMapper.toResponse);
  }
}
