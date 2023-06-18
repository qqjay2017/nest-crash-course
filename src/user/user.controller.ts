import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/createUserDto';
import { UserService } from './user.service';
import { CommentService } from 'src/comment/comment.service';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly commentService: CommentService,
  ) {}
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiTags('user')
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.userService.findOne(id);
  }
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiTags('user')
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiTags('user')
  @Put(':id')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @ApiBearerAuth()
  @ApiTags('user')
  @UseGuards(JwtGuard)
  @Get(':id/comments')
  findUserComments(@Param('id') id: string, @Request() req) {
    return this.commentService.findUserComments(id);
  }
}
