import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/createUserDto';
import { UserService } from './user.service';
import { CommentService } from 'src/comment/comment.service';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly commentService: CommentService,
  ) {}
  @Get('')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiTags('user')
  @ApiOperation({ summary: '用户分页' })
  findAll(@Query() paginationQueryDto: PaginationQueryDto) {
    return this.userService.findAll(paginationQueryDto);
  }
  @Get(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiTags('user')
  @ApiOperation({ summary: '用户详情' })
  findOne(@Param('id') id: number) {
    return this.userService.findOne(id);
  }
  @Post()
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiTags('user')
  @ApiOperation({ summary: '新增用户' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
  @Put(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiTags('user')
  @ApiOperation({ summary: '修改用户' })
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }
  @Get(':id/recomend')
  @ApiBearerAuth()
  @ApiTags('user')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: '推荐用户+1' })
  async findUserComments(@Param('id') id: number, @Request() req) {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return this.userService.recomendUser(user);
  }
}
