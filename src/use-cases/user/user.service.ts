import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/infra/database/prisma.service';
import { AuthDTO } from './dto/auth.dto';
import * as bcrypt from 'bcryptjs';
import { jwt } from '../../configs/env';
import { UserCreateDTO } from './dto/user-create.dto';
import { UserPaginateDTO } from './dto/user-paginate.dto';
import { Prisma } from '@prisma/client';
import { FindUserByIdDTO } from './dto/find-user-by-id.dto';
import { UserDTO } from './dto/user.dto';
import { MailService } from 'src/external/mailer/mail.service';
import { UserSetPasswordDTO } from './dto/user-set-password';
import { ValidateToken } from './dto/validate-token.dto';


@Injectable()
export class UserService {

    constructor(
        private readonly prismaService: PrismaService,
        private jwtService: JwtService,
        private _mailService: MailService
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
                position: true,
                isActive: true,
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

        if (!user.isActive) {
            throw new UnauthorizedException(
                'Usuário não encontrado',
            );
        }

        const isMatch = await bcrypt.compare(data.password, user.password);

        if (!isMatch) {
            // throw new UnauthorizedException('Invalid credentials');
            throw new UnauthorizedException(
                'Credenciais inválidas',
            );
        }

        const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            position: user.position,
        };

        const today = new Date();

        today.setDate(today.getDate() + Number(jwt.auth.expiresIn))

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
                position: user.position,
            },
            expires_in: today
        };

        return {
            status: true,
            message: '',
            ...response
        };
    }


    async create(data: UserCreateDTO, user_id: string) {
        const userCreatedUser = await this.prismaService.user.findUnique({
            where: { email: data.email },
        });

        if (userCreatedUser) {
            throw new ConflictException('E-mail já existe')
        }

        const user = await this.prismaService.user.create({
            data: {
                name: data.name,
                email: data.email,
                isActive: data.isActive,
                position: data.position,
            },
        });

        const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
        };

        const token = await this.jwtService.signAsync(payload, {
            secret: jwt.create_account.secret,
            expiresIn: jwt.create_account.expiresIn,
        });

        await this.prismaService.newUser.create({
            data: {
                token: token,
                user_id: user.id,
            },
        });

        const email = {
            to: user.email,
            subject: 'Bem vindo ao CooperFlow',
            text: `Olá ${user.name}! Este é um email para efetuar o primeiro acesso.`,
            name: user.name,
            token: token
        }

        await this._mailService.createAccount(email);

        const response = {
            id: user.id,
            name: user.name,
            email: user.email,
            position: user.position,
            createdAt: user.created_at,
            updatedAt: user.updated_at,
        };

        return {
            message: 'Usuário criado com sucesso',
            submessage: `Um e-mail de acesso foi enviado para ${user.email}`,
            type: 'success'
        };
    }

    async paginate(params: UserPaginateDTO) {
        const order: Prisma.SortOrder =
            (params.order as unknown as Prisma.SortOrder) || 'asc';
        const page = params.page ? +params.page : 1;
        const perPage = params.pageSize ? +params.pageSize : 10;

        const total = await this.prismaService.user.count({
            where: {
                name: {
                    contains: params.search,
                    mode: 'insensitive',
                },
            },
        });

        const totalPages = Math.ceil(total / perPage);
        const offset = perPage * (page - 1);

        const users = await this.prismaService.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                password: false,
                position: true,
                isActive: true,
                created_at: true,
                updated_at: true,
            },
            where: {
                name: {
                    contains: params.search,
                    mode: 'insensitive',
                },
            },
            take: perPage,
            skip: offset,
            orderBy: {
                name: order,
            },
        });

        const result = users.map((user) => {
            return {
                id: user.id,
                name: user.name,
                email: user.email,
                isActive: user.isActive,
                position: user.position,
                created_at: user.created_at,
                updated_at: user.updated_at,
            };
        });

        const response = {
            data: result,
            total,
            page,
            totalPages,
        };

        return response;
    }

    async detail(data: FindUserByIdDTO): Promise<UserDTO> {
        const user = await this.prismaService.user.findUnique({
            where: {
                id: data.id,
            },
            select: {
                id: true,
                name: true,
                email: true,
                password: false,
                position: true,
                isActive: true,
                created_at: true,
                updated_at: true,
            },
        });


        if (user) {
            return user
        } else {
            throw new ConflictException('Usuário não encontrado')
        }
    }

    async update(data: UserCreateDTO, user_id: string) {
        const userUpdated = await this.prismaService.user.findUnique({
            where: {
                id: user_id,
            },
        });

        const userBefore = await this.prismaService.user.findUnique({
            where: {
                id: data.id,
            },
        });

        const user = await this.prismaService.user.update({
            where: {
                id: data.id,
            },
            data: {
                name: data.name,
                email: data.email,
                isActive: data.isActive,
                position: data.position,
            },
        });

        return {
            message: 'Usuário atualizado com sucesso',
            type: 'success'
        };
    }

    async setPassword(data: UserSetPasswordDTO) {

        const user = await this.prismaService.user.findUnique({
            where: {
                email: data.email
            },
        })

        if (!user) {
            throw new NotFoundException('Usuário não encontrado');
        }

        const token = await this.prismaService.newUser.findUnique({
            where: {
                token: data.token,
            },
        });

        if (!token || (token && token.user_id !== user.id)) {
            throw new UnauthorizedException('Invalid token');
        }

        const password = await bcrypt.hash(data.password, 10);

        await this.prismaService.user.update({
            where: {
                email: data.email,
            },
            data: {
                password,
            },
        });

        await this.prismaService.newUser.deleteMany({
            where: {
                user_id: user.id,
            },
        });

        const response = {
            message: 'Senha alterada com sucesso',
        };

        return response;
    }

    async validateToken(data: ValidateToken) {
        try {
            const validateToken = await this.jwtService.verifyAsync(data.token, {
                secret: jwt.create_account.secret,
            });

            if (!validateToken) {
                throw new UnauthorizedException('Expired token');
            }

            const tokenAlreadyExists = await this.prismaService.newUser.findFirst({
                where: {
                    token: data.token,
                },
            });

            if (!tokenAlreadyExists) {
                throw new UnauthorizedException('Invalid token');
            }

            const decode = await this.jwtService.decode(data.token);

            const response = {
                name: decode['name'],
                email: decode['email'],
            };

            return response;
        } catch (error) {
            throw new UnauthorizedException(error.message);
        }
    }

}
