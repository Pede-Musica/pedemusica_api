import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/infra/database/prisma.service';
import { AuthDTO } from './dto/auth.dto';
import * as bcrypt from 'bcryptjs';
import { jwt } from '../../configs/env';
import { UserCreateDTO } from './dto/user-create.dto';
import { MailService } from 'src/external/mailer/mail.service';
import { UserSetPasswordDTO } from './dto/user-set-password';
import { ValidateToken } from './dto/validate-token.dto';
import { PersonCreateDTO } from '../person/dto/person-create.dto';
import { BooleanHandlerService } from 'src/shared/handlers/boolean.handler';
import { UserPaginateDTO } from './dto/user-paginate.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {

    constructor(
        private readonly prismaService: PrismaService,
        private jwtService: JwtService,
        private _mailService: MailService,
        public booleanHandlerService: BooleanHandlerService
    ) { }

    async exists(email: string) {
        const user = await this.prismaService.user.findUnique({
            where: {
                user: email,
            },
        });

        return !!user;
    }

    async authenticate(data: AuthDTO) {

        const email = data.email;

        const user = await this.prismaService.user.findUnique({
            where: { user: email },
            select: {
                id: true,
                user: true,
                person_id: true,
                isActive: true,
                password: true,
                created_at: true,
                updated_at: true,

                Person: true
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
            name: user.Person.name,
            email: user.Person.email,
            position: user.Person.position,
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
                name: user.Person.name,
                email: user.Person.email,
                position: user.Person.position,
            },
            expires_in: today
        };

        return {
            status: true,
            message: '',
            ...response
        };
    }


    async create(data: UserCreateDTO, person: PersonCreateDTO) {

        const user = await this.prismaService.user.create({
            data: {
                user: data.user,
                person_id: person.id,
                isActive: data.isActive,
            },
        });

        const payload = {
            id: user.id,
            name: person.name,
            email: person.email,
            position: person.position,
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
            to: person.email,
            subject: 'Bem vindo ao CooperFlow',
            text: `Olá ${person.name}! Este é um email para efetuar o primeiro acesso.`,
            name: person.name,
            token: token
        }

        await this._mailService.createAccount(email);

        const response = {
            id: user.id,
            user: user.user,
            createdAt: user.created_at,
            updatedAt: user.updated_at,
        };

        return response;
    }

    async setPassword(data: UserSetPasswordDTO) {

        const user = await this.prismaService.user.findUnique({
            where: {
                user: data.email
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
                user: data.email,
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


    async paginate(params: UserPaginateDTO) {
        const order: Prisma.SortOrder =
            (params.order as unknown as Prisma.SortOrder) || 'asc';
        const page = params.page ? +params.page : 1;
        const perPage = params.pageSize ? +params.pageSize : 10;


        const offset = perPage * (page - 1);

        const users = await this.prismaService.user.findMany({
            select: {
                id: true,
                is_active: true,
                email: true,
                created_at: true,
                updated_at: true,
                Person: true,
            },
            where: {
                Person: {
                    name: {
                        contains: params.search,
                        mode: 'insensitive',
                    },
                }
            },
            take: perPage,
            skip: offset,
            orderBy: {
                Person: {
                    name: order,
                }
            },
        });

        const total = users.length;

        const totalPages = Math.ceil(total / perPage);

        const response = {
            data: users,
            total,
            page,
            totalPages,
        };

        return response;
    }

}
