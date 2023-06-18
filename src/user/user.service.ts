import {
  BadRequestException,
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/createUserDto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private dataSource: DataSource,
  ) {}
  async findOne(id: number) {
    const user = await this.userRepo.findOne({
      where: {
        id: id,
      },
    });

    if (!user) {
      // throw new HttpException(`user #${id} not found`, HttpStatus.NOT_FOUND);
      throw new NotFoundException(`user #${id} not found`);
    }

    return user;
  }
  async findOnByUserName(username: string) {
    return this.userRepo.findOne({
      where: {
        email: username,
      },
    });
  }
  async create(createUserDto: CreateUserDto) {
    try {
      const user = this.userRepo.create(createUserDto);

      await this.userRepo.save(user);
      const { password, ...result } = user;
      return result;
    } catch (error) {
      throw new BadRequestException(`注册失败,用户已存在 `);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      delete updateUserDto.password;
    }
    const user = await this.userRepo.preload({
      id,
      ...updateUserDto,
    });

    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return await this.userRepo.save(user);
  }
}
