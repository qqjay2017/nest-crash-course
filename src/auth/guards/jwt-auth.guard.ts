import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { jwtKey } from '../constants';

@Injectable()
export class JwtGuard extends AuthGuard(jwtKey) {}
