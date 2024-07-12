import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { JwtDTO } from 'src/dtos/jwt.dto';
import { UserRole } from 'src/shared/constants/roles.enum';

@Injectable()
export class RoleInterceptor implements NestInterceptor {
    constructor(
        private readonly reflector: Reflector,
        private jwtSecret: JwtService,
    ) { }
    intercept(context: ExecutionContext, next: CallHandler) {
        const response = context.switchToHttp().getRequest();
        const token = response.headers.authorization?.replace('Bearer ', '');
        const payload: JwtDTO = this.jwtSecret.decode(token);

        const role = this.reflector.get<UserRole>(
            'request-role',
            context.getHandler() || context.getClass(),
        );

        if (payload?.role != role) {
            throw new UnauthorizedException('Unauthorized');
        }

        return next.handle();
    }
}
