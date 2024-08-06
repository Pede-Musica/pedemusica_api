import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { Prisma } from '@prisma/client';
import { ProducerPaginateDTO } from '../producer/dto/producer-paginate.dto';
import { LogService } from '../log/log.service';
import { LogType } from 'src/shared/constants/log.enum';
import { PersonCreateDTO } from './dto/person-create.dto';
import { PersonDetailDTO } from './dto/person-detail.dto';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/external/mailer/mail.service';
import { jwt } from '../../configs/env';
import { UserService } from '../user/user.service';
import { ProducerService } from '../producer/producer.service';
import { PersonPaginateDTO } from './dto/person-paginate.dto';
import { BooleanHandlerService } from 'src/shared/handlers/boolean.handler';


@Injectable()
export class PersonService {


    constructor(
        public prismaService: PrismaService,
        private _logService: LogService,
        private _producerService: ProducerService,
        private _userService: UserService,
        public booleanHandlerService: BooleanHandlerService
    ) { }

    async paginate(params: PersonPaginateDTO) {
        const order: Prisma.SortOrder =
            (params.order as unknown as Prisma.SortOrder) || 'asc';
        const page = params.page ? +params.page : 1;
        const perPage = params.pageSize ? +params.pageSize : 10;

        
        const offset = perPage * (page - 1);

        const isUser = await this.booleanHandlerService.convert(params.isUser);
        const isProducer = await this.booleanHandlerService.convert(params.isProducer);
        const isCustomer = await this.booleanHandlerService.convert(params.isCustomer);

        const producers = await this.prismaService.person.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                position: true,
                phone: true,
                phone2: true,
                address: true,
                type: true,
                cpf_cnpj: true,
                created_at: true,
                updated_at: true,
                isCustomer: true,
                isProducer: true,
                isUser: true,
                sysAdmin: true,

                User: true,
                Customer: true,
                Producer: true
            },
            where: {
                name: {
                    contains: params.search,
                    mode: 'insensitive',
                },
                isUser: isUser,
                isProducer: isProducer,
                isCustomer: isCustomer
            },
            take: perPage,
            skip: offset,
            orderBy: {
                name: order,
            },
        });

        const total = producers.length;

        const totalPages = Math.ceil(total / perPage);

        const response = {
            data: producers,
            total,
            page,
            totalPages,
        };

        return response;
    }

    async create(data: PersonCreateDTO, user_id: string) {

        try {

            const user = data.user;
            const producer = data.producer;

            const person: any = await this.prismaService.person.create({
                data: {
                    name: data.name,
                    email: data.email,
                    position: data.position,
                    phone: data.phone,
                    phone2: data.phone2,
                    address: data.address,
                    type: data.type,
                    cpf_cnpj: data.cpf_cnpj,
                    isCustomer: data.isCustomer,
                    isProducer: data.isProducer,
                    isUser: data.isUser,
                    sysAdmin: false
                }
            })

            if (data.isUser) {
                const checkUser = await this.prismaService.user.findUnique({
                    where: {
                        user: user.user
                    }
                })

                if (checkUser) {
                    throw new ConflictException(`Usuário ${user.user} já existe`);
                }

                const newUser = await this._userService.create(user, person);
            }

            if (data.isProducer) {
                const newProducer = await this._producerService.create(producer, person.id);
            }


            await this._logService.log({
                user_id: user_id,
                type: LogType.person,
                action: 'Criou uma pessoa.',
                before: null,
                after: person.toString() ?? null
            })


            return {
                message: 'Pessoa criada com sucesso',
            };
        }
        catch (error) {
            throw new ConflictException(error.message)
        }
    }

    async detail(data: PersonDetailDTO): Promise<any> {
        const customer = await this.prismaService.person.findUnique({
            where: {
                id: data.id,
            },
            select: {
                id: true,
                name: true,
                email: true,
                position: true,
                phone: true,
                phone2: true,
                address: true,
                type: true,
                cpf_cnpj: true,
                created_at: true,
                updated_at: true,
                isCustomer: true,
                isProducer: true,
                isUser: true,
                sysAdmin: true,

                User: true,
                Customer: true,
                Producer: true
            },
        });


        if (customer) {
            return customer
        } else {
            throw new ConflictException('Pessoa não encontrada')
        }
    }

    async update(data: PersonCreateDTO, user_id: string) {

        const user = data.user;
        const producer = data.producer;

        const person = await this.prismaService.person.update({
            where: {
                id: data.id,
            },
            data: {
                name: data.name,
                email: data.email,
                position: data.position,
                phone: data.phone,
                phone2: data.phone2,
                address: data.address,
                type: data.type,
                cpf_cnpj: data.cpf_cnpj,
                isCustomer: data.isCustomer,
                isProducer: data.isProducer,
                isUser: data.isUser,
            }
        });

        if (data.isUser) {

            const currentUser = await this.prismaService.user.findUnique({
                where: {
                    person_id: person.id
                }
            })

            if(currentUser) {
                const updateUser = await this.prismaService.user.update({
                    where: {
                        person_id: person.id
                    },
                    data: {
                        isActive: user.isActive
                    }
                })
            } else {
                const newUser = await this._userService.create(user, data);
            }
        }

        if (data.isProducer) {
            
            const currentProducer = await this.prismaService.producer.findUnique({
                where: {
                    person_id: person.id
                }
            })

            if(currentProducer) {
                const updateProducer = await this.prismaService.producer.update({
                    where: {
                        person_id: person.id
                    },
                    data: {
                        cad_pro: producer.cad_pro,
                        ggn: producer.ggn
                    }
                })
            } else {
                const newProducer = await this._producerService.create(producer, person.id);
            }
        }


        await this._logService.log({
            user_id: user_id,
            type: LogType.person,
            action: 'Criou uma pessoa.',
            before: null,
            after: person.toString() ?? null
        })

        await this._logService.log({
            user_id: user_id,
            type: LogType.person,
            action: 'Atualizou uma pessoa.',
            before: null,
            after: null
        })

        return {
            message: 'Pessoa atualizada com sucesso',
            type: 'success'
        };
    }
}
