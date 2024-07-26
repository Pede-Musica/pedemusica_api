/* import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { CustomerPaginateDTO } from './dto/customer-paginate.dto';
import { Prisma } from '@prisma/client';
import { CustomerCreateDTO } from './dto/customer-create.dto';
import { CustomerDetailDTO } from './dto/customer-detail.dto';

@Injectable()
export class CustomerService {

    constructor(
        public prismaService: PrismaService
    ) { }

    async paginate(params: CustomerPaginateDTO) {
        const order: Prisma.SortOrder =
            (params.order as unknown as Prisma.SortOrder) || 'asc';
        const page = params.page ? +params.page : 1;
        const perPage = params.pageSize ? +params.pageSize : 10;

        const total = await this.prismaService.customer.count({
            where: {
                name: {
                    contains: params.search,
                    mode: 'insensitive',
                },
            },
        });

        const totalPages = Math.ceil(total / perPage);
        const offset = perPage * (page - 1);

        const producers = await this.prismaService.customer.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                isActive: true,
                address: true,
                phone: true,
                cpf_cnpj: true,
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

        const response = {
            data: producers,
            total,
            page,
            totalPages,
        };

        return response;
    }

    async create(data: CustomerCreateDTO, user_id: string) {

        try {
            const customer = await this.prismaService.customer.create({
                data: {
                    name: data.name,
                    email: data.email,
                    isActive: data.isActive,
                    address: data.address,
                    phone: data.phone,
                    type: data.type,
                    cpf_cnpj: data.cpf_cnpj
                }
            })

            return {
                message: 'Cliente criado com sucesso',
            };
        }
        catch (error) {
            throw new ConflictException(error.message)
        }
    }

    async detail(data: CustomerDetailDTO): Promise<CustomerCreateDTO> {
        const customer = await this.prismaService.customer.findUnique({
            where: {
                id: data.id,
            },
            select: {
                id: true,
                name: true,
                email: true,
                isActive: true,
                address: true,
                phone: true,
                type: true,
                cpf_cnpj: true,
                created_at: true,
                updated_at: true,
            },
        });


        if (customer) {
            return customer
        } else {
            throw new ConflictException('Cliente não encontrado')
        }
    }

    async update(data: CustomerCreateDTO, user_id: string) {
        const update = await this.prismaService.customer.findUnique({
            where: {
                id: user_id,
            },
        });

        const before = await this.prismaService.customer.findUnique({
            where: {
                id: data.id,
            },
        });

        const customer = await this.prismaService.customer.update({
            where: {
                id: data.id,
            },
            data: {
                name: data.name,
                email: data.email,
                isActive: data.isActive,
                address: data.address,
                phone: data.phone,
                type: data.type,
                cpf_cnpj: data.cpf_cnpj
            }
        });

        return {
            message: 'Cliente atualizado com sucesso',
            type: 'success'
        };
    }
}
 */