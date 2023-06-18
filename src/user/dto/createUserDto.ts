import { IsEmail, IsNumberString, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
export class CreateUserDto {
  @ApiProperty({ example: '用户名称', description: '用户名称' })
  @IsString()
  name: string;

  @ApiProperty({ example: '22@qq.com', description: '邮箱(登录名称)' })
  @IsEmail()
  email?: string;
  // @IsNumberString()
  // phone: string;

  @ApiProperty({ example: '123', description: '密码' })
  @IsString()
  password: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
