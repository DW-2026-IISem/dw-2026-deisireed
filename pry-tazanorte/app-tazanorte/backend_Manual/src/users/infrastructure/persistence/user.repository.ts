import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserModel } from './user.model';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(UserModel)
    private readonly userModel: typeof UserModel,
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    const created = await this.userModel.create(userData as any);
    return created.toJSON() as User;
  }

  async findAll(): Promise<User[]> {
    const users = await this.userModel.findAll();
    return users.map((u) => u.toJSON() as User);
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = await this.userModel.findOne({ where: { username } });
    return user ? (user.toJSON() as User) : null;
  }
}
