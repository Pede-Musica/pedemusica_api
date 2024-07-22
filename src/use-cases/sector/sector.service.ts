import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { Prisma } from '@prisma/client';
import { SectorPaginateDTO } from './dto/sector-paginate.dto';
import { SectorCreateDTO } from './dto/sector-create.dto';
import { SectorDetailDTO } from './dto/sector-detail.dto';

@Injectable()
export class SectorService {

    constructor(
        public prismaService: PrismaService
    ) { }

    async paginate(params: SectorPaginateDTO) {
        const order: Prisma.SortOrder =
            (params.order as unknown as Prisma.SortOrder) || 'asc';
        const page = params.page ? +params.page : 1;
        const perPage = params.pageSize ? +params.pageSize : 10;

        const total = await this.prismaService.sector.count({
            where: {
                name: {
                    contains: params.search,
                    mode: 'insensitive',
                },
            },
        });

        const totalPages = Math.ceil(total / perPage);
        const offset = perPage * (page - 1);

        const sectors = await this.prismaService.sector.findMany({
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
            data: sectors,
            total,
            page,
            totalPages,
        };

        return response;
    }

    async create(data: SectorCreateDTO, user_id: string) {

        try {
            const location = await this.prismaService.sector.create({
                data: {
                    name: data.name,
                    isActive: data.isActive,
                }
            })

            return {
                message: 'Setor criado com sucesso',
            };
        }
        catch (error) {
            throw new ConflictException(error.message)
        }
    }

    async detail(data: SectorDetailDTO): Promise<SectorCreateDTO> {
        const sector = await this.prismaService.sector.findUnique({
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


        if (sector) {
            return sector
        } else {
            throw new ConflictException('Setor não encontrado')
        }
    }

    async update(data: SectorCreateDTO, user_id: string) {
        const update = await this.prismaService.sector.findUnique({
            where: {
                id: user_id,
            },
        });

        const before = await this.prismaService.sector.findUnique({
            where: {
                id: data.id,
            },
        });

        const sector = await this.prismaService.sector.update({
            where: {
                id: data.id,
            },
            data: {
                name: data.name,
                isActive: data.isActive,
            }
        });

        return {
            message: 'Setor atualizado com sucesso',
            type: 'success'
        };
    }

    async combolist() {

        const setors = this.prismaService.sector.findMany({
            where: {
                isActive: true
            }
        })

        return setors;
    }
}
