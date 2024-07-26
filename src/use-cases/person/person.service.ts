import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { ProducerCreateDTO } from '../producer/dto/producer.dto';
import { Prisma } from '@prisma/client';
import { ProducerPaginateDTO } from '../producer/dto/producer-paginate.dto';
import { ProducerDetailDTO } from '../producer/dto/producer-detail.dto';
import { LogService } from '../log/log.service';
import { LogType } from 'src/shared/constants/log.enum';
import { PersonCreateDTO } from './dto/person-create.dto';
import { PersonDetailDTO } from './dto/person-detail.dto';

@Injectable()
export class PersonService {


    constructor(
        public prismaService: PrismaService,
        private _logService: LogService
    ) { }

    async paginate(params: ProducerPaginateDTO) {
        const order: Prisma.SortOrder =
            (params.order as unknown as Prisma.SortOrder) || 'asc';
        const page = params.page ? +params.page : 1;
        const perPage = params.pageSize ? +params.pageSize : 10;

        const total = await this.prismaService.person.count({
            where: {
                name: {
                    contains: params.search,
                    mode: 'insensitive',
                },
            },
        });

        const totalPages = Math.ceil(total / perPage);
        const offset = perPage * (page - 1);

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
            },
            take: perPage,
            skip: offset,
            orderBy: {
                name: order,
            },
        });

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

            const person = await this.prismaService.person.create({
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


        const update = await this.prismaService.person.findUnique({
            where: {
                id: data.id,
            },
        });

        const before = await this.prismaService.person.findUnique({
            where: {
                id: data.id,
            },
        });

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

        await this._logService.log({
            user_id: user_id,
            type: LogType.person,
            action: 'Atualizou uma pessoa.',
            before: null,
            after: null
        })

        return {
            message: 'Pessoao atualizada com sucesso',
            type: 'success'
        };
    }
}
