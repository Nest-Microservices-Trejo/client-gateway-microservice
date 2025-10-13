import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { CurrentUser } from '../interfaces/current-user.interface';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { user: CurrentUser }>();

    if (!request.user) {
      throw new InternalServerErrorException(
        'User not found in request (AuthGuard called?)',
      );
    }

    return request.user;
  },
);
