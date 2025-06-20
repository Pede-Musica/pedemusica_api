import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthDTO } from '../dto/auth.dto';
import * as bcrypt from 'bcryptjs';
import { jwt } from '../../../common/configs/env';
import { UserCreateDTO } from '../dto/user-create.dto';
import { UserSetPasswordDTO } from '../dto/user-set-password';
import { ValidateToken } from '../dto/validate-token.dto';
import { UserPaginateDTO } from '../dto/user-paginate.dto';
import { Prisma, User } from '@prisma/client';
import { FindUserByIdDTO } from '../dto/find-user-by-id.dto';
import { LogService } from '../../logs/services/log.service';
import { MailService } from '../../mailer/services/mail.service';
import { ClientService } from 'src/modules/clients/services/client.service';
import { PersonService } from 'src/modules/persons/services/person.service';
import { UserRepository } from '../repositories/user.repository';
import { NewUserService } from 'src/modules/new-users/services/new-user.service';

@Injectable()
export class UserService {
    constructor(
        private jwtService: JwtService,
        private _mailService: MailService,
        private _logService: LogService,
        private readonly userRepository: UserRepository,
        private readonly clienteService: ClientService,
        private readonly personService: PersonService,
        private readonly newUserService: NewUserService
    ) { }

    async findByEmail(email: string): Promise<User | null> {
        return await this.userRepository.findByEmail(email);
    }

    async authenticate(data: AuthDTO) {
        const user = await this.findByEmail(data.email);

        if (!user) {
            throw new NotFoundException('Usuário não encontrado');
        }

        if (!user.password) {
            throw new UnauthorizedException(
                'Por favor, defina sua senha de primeiro acesso',
            );
        }

        if (!user.is_active) {
            throw new UnauthorizedException(
                'Usuário não encontrado',
            );
        }

        const isMatch = await bcrypt.compare(data.password, user.password);

        if (!isMatch) {
            throw new UnauthorizedException(
                'Credenciais inválidas',
            );
        }

        const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            client_id: user.client_id
        };

        const clients = user.client_id ? await this.clienteService.findMany(user.client_id) : null

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
                clients: clients ?? []
            },
            expires_in: today
        };

        return {
            status: true,
            message: '',
            ...response
        };
    }

    async create(data: UserCreateDTO, user_id: string, client_id: string) {
        const exist = await this.findByEmail(data.email);

        if (exist) {
            await this._logService.createLogUser({
                user_id: user_id,
                class: 'UserService',
                success: false,
                log: `Falha ao tentar criar usuário. E-mail já existe: ${data.email}`
            })
            throw new ConflictException(('E-mail já existe'))
        }

        const personData = {
            name: data.name,
            position: '',
            phone: data.phone,
            phone2: data.phone2,
            address: data.address,
            cpf_cnpj: data.cpf_cnpj
        }

        const person = await this.personService.create(personData);

        const userData = {
            email: data.email,
            name: data.name,
            person_id: person.id,
            is_active: true,
            sys_admin: false,
            client_admin: false,
            client_id: client_id,
        }

        const user = await this.userRepository.create(userData);

        const payload = {
            id: user.id,
            name: data.name,
            email: data.email,
            position: '',
        };

        const token = await this.jwtService.signAsync(payload, {
            secret: jwt.create_account.secret,
            expiresIn: jwt.create_account.expiresIn,
        });

        const newUserData = {
            token: token,
            user_id: user.id,
        };

        await this.newUserService.create(newUserData);

        const email = {
            to: user.email,
            subject: 'Primeiro acesso Hangodash',
            text: `Olá ${person.name}! Este é um email para efetuar o primeiro acesso.`,
            name: person.name,
            token: token
        }

        await this._mailService.createAccount(email);

        const response = {
            id: user.id,
            user: user.email,
            createdAt: user.created_at,
            updatedAt: user.updated_at,
        };

        return {
            message: 'Usuário criado com sucesso'
        };
    }

    async setPassword(data: UserSetPasswordDTO) {
        const user = await this.findByEmail(data.email);

        if (!user) {
            throw new NotFoundException('Usuário não encontrado');
        }

        const token = await this.newUserService.findByToken(data.token);

        if (!token || (token && token.user_id !== user.id)) {
            throw new UnauthorizedException('Invalid token');
        }

        const password = await bcrypt.hash(data.password, 10);

        await this.userRepository.update(
            {
                password: password,
                is_active: true,
            },
            {
                id: user.id,
            },
        );

        await this.newUserService.deleteMany({
            user_id: user.id,
            token: data.token,
        })

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

            const tokenAlreadyExists = await this.newUserService.findByToken(data.token);

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

        const users = await this.userRepository.paginate(params);

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

    async detail(data: FindUserByIdDTO) {

        const { id } = data;

        const user = await this.userRepository.detail(id);

        if (user) {
            const response = {
                id: user.id,
                name: user.person.name,
                cpf_cnpj: user.person.cpf_cnpj,
                email: user.email,
                phone: user.person.phone,
                phone2: user.person.phone2,
                address: user.person.address,
                is_active: user.is_active
            }

            return response
        }
        else {
            throw new NotFoundException('Usuário não encontrado');
        }
    }

    async forgotPassword(data: { email: string }) {

        const { email } = data;

        const user = await this.userRepository.findByEmail(email);

        if (!user) {
            throw new NotFoundException('Usuário não encontrado');
        }

        return {
            message: 'E-mail de recuperação de senha enviado com sucesso'
        }
    }
}
