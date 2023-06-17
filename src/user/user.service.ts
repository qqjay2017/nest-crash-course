import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/createUserDto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}
  async findOne(id: number) {
    return await this.userRepo.findOne({
      where: {
        id: id,
      },
    });
  }
  async findOnByUserName(username: string) {
    return this.userRepo.findOne({
      where: {
        email: username,
      },
    });
  }
  async create(createUserDto: CreateUserDto) {
    const user = this.userRepo.create(createUserDto);

    await this.userRepo.save(user);
    const { password, ...result } = user;
    return result;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.userRepo.update(id, updateUserDto);
  }
}
