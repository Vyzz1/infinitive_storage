import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User as UserType } from 'src/db/schema';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as UserType;
  },
);
