import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserModel } from 'SRC/user/entity/user.model';

export const User = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.user as UserModel;
});
