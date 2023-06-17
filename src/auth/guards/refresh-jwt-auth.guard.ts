import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { refreshKey } from '../constants';

@Injectable()
export class RefreshJwtGuard extends AuthGuard(refreshKey) {}
