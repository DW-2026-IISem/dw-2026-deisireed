import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserRepository } from '../persistence/user.repository';

@Controller('users')
export class UsersController {
  constructor(private readonly userRepository: UserRepository) {}

  @Get()
  async getAll() {
    return this.userRepository.findAll();
  }

  @Post()
  async create(@Body() body: any) {
    return this.userRepository.create(body);
  }
}
