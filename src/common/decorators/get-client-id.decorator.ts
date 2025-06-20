import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetClientId = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): string => {
        const request = ctx.switchToHttp().getRequest();
        return request.user?.client_id;
    },
);