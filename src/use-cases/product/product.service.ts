import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { ProducerCreateDTO } from '../producer/dto/producer.dto';
import { Prisma } from '@prisma/client';
import { ProducerPaginateDTO } from '../producer/dto/producer-paginate.dto';
import { ProductCreateDTO } from './dto/product-create.dto';
import { ProducerDetailDTO } from '../producer/dto/producer-detail.dto';

@Injectable()
export class ProductService {

    constructor(
        public prismaService: PrismaService
    ) { }

    async paginate(params: ProducerPaginateDTO) {
        const order: Prisma.SortOrder =
            (params.order as unknown as Prisma.SortOrder) || 'asc';
        const page = params.page ? +params.page : 1;
        const perPage = params.pageSize ? +params.pageSize : 10;

        const total = await this.prismaService.product.count({
            where: {
                name: {
                    contains: params.search,
                    mode: 'insensitive',
                },
            },
        });

        const totalPages = Math.ceil(total / perPage);
        const offset = perPage * (page - 1);

        const producers = await this.prismaService.product.findMany({
            select: {
                id: true,
                name: true,
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

        const response = {
            data: producers,
            total,
            page,
            totalPages,
        };

        return response;
    }

    async create(data: ProductCreateDTO, user_id: string) {

        try {
            const customer = await this.prismaService.product.create({
                data: {
                    name: data.name,
                    isActive: data.isActive,
                }
            })

            return {
                message: 'Produto criado com sucesso',
            };
        }
        catch (error) {
            throw new ConflictException(error.message)
        }
    }

    async detail(data: ProducerDetailDTO): Promise<ProductCreateDTO> {
        const customer = await this.prismaService.product.findUnique({
            where: {
                id: data.id,
            },
            select: {
                id: true,
                name: true,
                isActive: true,
                created_at: true,
                updated_at: true,
            },
        });


        if (customer) {
            return customer
        } else {
            throw new ConflictException('Produto não encontrado')
        }
    }

    async update(data: ProductCreateDTO, user_id: string) {
        const update = await this.prismaService.product.findUnique({
            where: {
                id: user_id,
            },
        });

        const before = await this.prismaService.product.findUnique({
            where: {
                id: data.id,
            },
        });

        const product = await this.prismaService.product.update({
            where: {
                id: data.id,
            },
            data: {
                name: data.name,
                isActive: data.isActive,
            }
        });

        return {
            message: 'Produto atualizado com sucesso',
            type: 'success'
        };
    }
}
