import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { MaterialPaginateDTO } from './dto/material-paginate.dto';
import { Prisma } from '@prisma/client';
import { MaterialCreateDTO } from './dto/material-create.dto';
import { MaterialDetailDTO } from './dto/material-detail.dto';
import { BooleanHandlerService } from 'src/shared/handlers/boolean.handler';

@Injectable()
export class MaterialService {


    constructor(
        public prismaService: PrismaService,
        public booleanHandlerService: BooleanHandlerService
    ) { }

    async paginate(params: MaterialPaginateDTO) {

        const traceable = await this.booleanHandlerService.convert(params.traceable);

        const order: Prisma.SortOrder =
            (params.order as unknown as Prisma.SortOrder) || 'asc';
        const page = params.page ? +params.page : 1;
        const perPage = params.pageSize ? +params.pageSize : 10;

        const total = await this.prismaService.material.count({
            where: {
                name: {
                    contains: params.search,
                    mode: 'insensitive',
                },
            },
        });

        const totalPages = Math.ceil(total / perPage);
        const offset = perPage * (page - 1);

        const materials = await this.prismaService.material.findMany({
            select: {
                id: true,
                name: true,
                isActive: true,
                volume: true,
                traceable: true,
                description: true,
                created_at: true,
                updated_at: true,
            },
            where: {
                name: {
                    contains: params.search,
                    mode: 'insensitive',
                },
                traceable: traceable
            },
            take: perPage,
            skip: offset,
            orderBy: {
                name: order,
            },
        });

        const response = {
            data: materials,
            total,
            page,
            totalPages,
        };

        return response;
    }

    async create(data: MaterialCreateDTO, user_id: string) {

        try {
            const material = await this.prismaService.material.create({
                data: {
                    name: data.name,
                    isActive: data.isActive,
                    volume: data.volume,
                    in_stock: data.in_stock,
                    traceable: data.traceable,
                    description: data.description
                }
            })

            return {
                message: 'Material criado com sucesso',
            };
        }
        catch (error) {
            throw new ConflictException(error.message)
        }
    }

    async detail(data: MaterialDetailDTO): Promise<MaterialCreateDTO> {
        const material = await this.prismaService.material.findUnique({
            where: {
                id: data.id,
            },
            select: {
                id: true,
                name: true,
                isActive: true,
                volume: true,
                in_stock: true,
                traceable: true,
                description: true,
                created_at: true,
                updated_at: true,
            },
        });


        if (material) {
            return material
        } else {
            throw new ConflictException('Material não encontrado')
        }
    }

    async update(data: MaterialCreateDTO, user_id: string) {
        const update = await this.prismaService.material.findUnique({
            where: {
                id: user_id,
            },
        });

        const before = await this.prismaService.material.findUnique({
            where: {
                id: data.id,
            },
        });

        const material = await this.prismaService.material.update({
            where: {
                id: data.id,
            },
            data: {
                name: data.name,
                isActive: data.isActive,
                volume: data.volume,
                in_stock: data.in_stock,
                traceable: data.traceable,
                description: data.description
            }
        });

        return {
            message: 'Material atualizado com sucesso',
            type: 'success'
        };
    }

    async combolist() {
        const materials = await this.prismaService.material.findMany({
            where: {
                isActive: true,
                traceable: true
            },
            orderBy: {
                name: 'asc'
            }
        });

        return materials
    }
}
