import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Public } from 'src/decorators/auth-guard.decorator';
import { PrismaService } from 'src/infra/database/prisma.service';
import { AuthDTO } from './dto/auth.dto';
import * as bcrypt from 'bcryptjs';
import { jwt } from '../../configs/env';


@Injectable()
export class UserService {

    constructor(
        private readonly prismaService: PrismaService,
        private jwtService: JwtService,
    ) { }

    async exists(email: string) {
        const user = await this.prismaService.user.findUnique({
            where: {
                email,
            },
        });

        return !!user;
    }

    async authenticate(data: AuthDTO) {

        const email = data.email;

        const user = await this.prismaService.user.findUnique({
            where: { email },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                password: true,
                created_at: true,
                updated_at: true,
            },
        });

        if (!user.password) {
            throw new UnauthorizedException(
                'Por favor, defina sua senha de primeiro acesso',
            );
        }

        const isMatch = await bcrypt.compare(data.password, user.password);

        if (!isMatch) {
            // throw new UnauthorizedException('Invalid credentials');
            return {
                message: 'Credencias inválidas',
                status: false
            }
        }

        const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        };

        const token = await this.jwtService.signAsync(payload, {
            secret: jwt.auth.secret,
            expiresIn: jwt.auth.expiresIn,
        });

        const response = {
            access_token: token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        };

        return {
            status: true,
            message: '',
            ...response
        };
    }
}
