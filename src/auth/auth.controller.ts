import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CreateUserDto } from 'src/user/dto/createUserDto';
import { UserService } from 'src/user/user.service';
import { JwtGuard } from './guards/jwt-auth.guard';
import { retry } from 'rxjs';
import { RefreshJwtGuard } from './guards/refresh-jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiTags('auth')
  @ApiOperation({ summary: '登录' })
  @HttpCode(HttpStatus.OK)
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
  @Post('register')
  @ApiTags('auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '注册' })
  async registerUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
  @Get('profile')
  @ApiBearerAuth()
  @ApiTags('auth')
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: '获取用户信息' })
  getProfile(@Request() req) {
    return req.user;
  }
  @Post('refresh')
  @ApiTags('auth')
  @UseGuards(RefreshJwtGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '刷新token' })
  @ApiResponse({
    status: 200,
    description: 'The found record',
  })
  async refreshToken(@Request() req) {
    return this.authService.refreshToken(req.user);
  }
}
