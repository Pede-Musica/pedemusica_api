import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { LocationPaginateDTO } from './dto/location-paginate.dto';
import { Prisma } from '@prisma/client';
import { LocationCreateDTO } from './dto/location-create.dto';
import { LocationDetailDTO } from './dto/location-detail.dto';

@Injectable()
export class LocationService {

    constructor(
        public prismaService: PrismaService
    ) { }

    async paginate(params: LocationPaginateDTO) {
        const order: Prisma.SortOrder =
            (params.order as unknown as Prisma.SortOrder) || 'asc';
        const page = params.page ? +params.page : 1;
        const perPage = params.pageSize ? +params.pageSize : 10;

        const total = await this.prismaService.location.count({
            where: {
                name: {
                    contains: params.search,
                    mode: 'insensitive',
                },
            },
        });

        const totalPages = Math.ceil(total / perPage);
        const offset = perPage * (page - 1);

        const locations = await this.prismaService.location.findMany({
            select: {
                id: true,
                name: true,
                isActive: true,
                description: true,
                sector_id: true,
                Sector: true,
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
            data: locations,
            total,
            page,
            totalPages,
        };

        return response;
    }

    async create(data: LocationCreateDTO, user_id: string) {

        try {
            const location = await this.prismaService.location.create({
                data: {
                    name: data.name,
                    isActive: data.isActive,
                    sector_id: data.sector_id,
                    description: data.description
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

    async detail(data: LocationDetailDTO): Promise<LocationCreateDTO> {
        const customer = await this.prismaService.location.findUnique({
            where: {
                id: data.id,
            },
            select: {
                id: true,
                name: true,
                isActive: true,
                description: true,
                sector_id: true,
                Sector: true,
                created_at: true,
                updated_at: true,
            },
        });


        if (customer) {
            return customer
        } else {
            throw new ConflictException('Localização não encontrada')
        }
    }

    async update(data: LocationCreateDTO, user_id: string) {
        const update = await this.prismaService.location.findUnique({
            where: {
                id: user_id,
            },
        });

        const before = await this.prismaService.location.findUnique({
            where: {
                id: data.id,
            },
        });

        const location = await this.prismaService.location.update({
            where: {
                id: data.id,
            },
            data: {
                name: data.name,
                isActive: data.isActive,
                sector_id: data.sector_id,
                description: data.description
            }
        });

        return {
            message: 'Localização atualizada com sucesso',
            type: 'success'
        };
    }

    async getSectors() {

        const sectors = await this.prismaService.sector.findMany();

        return{
            data: sectors
        }
    }
}
