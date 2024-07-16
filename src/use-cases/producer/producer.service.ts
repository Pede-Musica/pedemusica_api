import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { ProducerCreateDTO } from './dto/producer.dto';
import { ProducerPaginateDTO } from './dto/producer-paginate.dto';
import { Prisma } from '@prisma/client';
import { ProducerDetailDTO } from './dto/producer-detail.dto';

@Injectable()
export class ProducerService {

    constructor(
        public prismaService: PrismaService
    ) { }

    async create(data: ProducerCreateDTO, user_id: string) {

        try {
            const producer = await this.prismaService.producer.create({
                data: {
                    name: data.name,
                    email: data.email,
                    isActive: data.isActive,
                    address: data.address,
                    phone: data.phone
                }
            })

            return {
                message: 'Produtor criado com sucesso',
            };
        }
        catch (error) {
            throw new ConflictException(error.message)
        }
    }

    async paginate(params: ProducerPaginateDTO) {
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

        const producers = await this.prismaService.producer.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                isActive: true,
                address: true,
                phone: true,
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

    async detail(data: ProducerDetailDTO): Promise<ProducerCreateDTO> {
        const producer = await this.prismaService.producer.findUnique({
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
                created_at: true,
                updated_at: true,
            },
        });


        if (producer) {
            return producer
        } else {
            throw new ConflictException('Produtor não encontrado')
        }
    }

    async update(data: ProducerCreateDTO, user_id: string) {
        const producerUpdated = await this.prismaService.producer.findUnique({
            where: {
                id: user_id,
            },
        });

        const producerBefore = await this.prismaService.producer.findUnique({
            where: {
                id: data.id,
            },
        });

        const producer = await this.prismaService.producer.update({
            where: {
                id: data.id,
            },
            data: {
                name: data.name,
                email: data.email,
                isActive: data.isActive,
                address: data.address,
                phone: data.phone
            }
        });

        return {
            message: 'Produtor atualizado com sucesso',
            type: 'success'
        };
    }
}
