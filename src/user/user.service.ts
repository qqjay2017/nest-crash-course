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
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Event } from 'src/events/entities/event.entity/event.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private dataSource: DataSource,
  ) {}

  async findAll(paginationQueryDto: PaginationQueryDto) {
    const { current = 1, pageSize = 10 } = paginationQueryDto;
    return await this.userRepo.find({
      skip: (current - 1) * pageSize,
      take: pageSize,
    });
  }
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

  async recomendUser(user: User) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      user.recommendations++;
      const recommendEvent = new Event();
      recommendEvent.name = 'recommend_user';
      recommendEvent.type = 'user';
      recommendEvent.payload = {
        userId: user.id,
      };
      await queryRunner.manager.save(user);

      await queryRunner.manager.save(recommendEvent);

      await queryRunner.commitTransaction();
      return {
        recommendations: user.recommendations,
        id: user.id,
        name: user.name,
        email: user.email,
      };
    } catch (err) {
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
  }
}
