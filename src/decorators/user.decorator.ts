import {
    createParamDecorator,
    ExecutionContext,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtDTO } from '../dtos/jwt.dto';

export const User = createParamDecorator(
    async (data: unknown, context: ExecutionContext) => {
        const jwtService = new JwtService();

        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            throw new UnauthorizedException('No token provided');
        }

        const payload: JwtDTO = jwtService.decode(token);
        
        if (!payload.id) {
            throw new NotFoundException('User not found');
        }

        return payload?.id;
    },
);
