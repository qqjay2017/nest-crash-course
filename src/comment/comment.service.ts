import { Injectable } from '@nestjs/common';

@Injectable()
export class CommentService {
  findUserComments(id: string) {
    return 'findUserComments' + id;
  }
}
