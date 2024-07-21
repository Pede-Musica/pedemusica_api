import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { ProducerCreateDTO } from '../producer/dto/producer.dto';
import { Prisma } from '@prisma/client';
import { ProducerPaginateDTO } from '../producer/dto/producer-paginate.dto';
import { ProductCreateDTO } from './dto/product-create.dto';
import { ProducerDetailDTO } from '../producer/dto/producer-detail.dto';
import { LogService } from '../log/log.service';
import { LogType } from 'src/shared/constants/log.enum';

@Injectable()
export class ProductService {

    constructor(
        public prismaService: PrismaService,
        private _logService: LogService
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

                ProductSize: true,
                ProductType: true,
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

            const types = data.types;
            const sizes = data.sizes;

            const product = await this.prismaService.product.create({
                data: {
                    name: data.name,
                    isActive: data.isActive,
                }
            })

            await Promise.all(
                types.map(async (type) => {
                    await this.prismaService.productType.create({
                        data: {
                            name: type.name,
                            isActive: type.isActive,
                            product_id: product.id
                        }
                    })
                })
            )

            await Promise.all(
                sizes.map(async (size) => {
                    await this.prismaService.productSize.create({
                        data: {
                            name: size.name,
                            isActive: size.isActive,
                            product_id: product.id
                        }
                    })
                })
            )

            await this._logService.log({
                user_id: user_id,
                type: LogType.producer,
                action: 'Atualizou um produto.',
                before: null,
                after: null
            })


            return {
                message: 'Produto criado com sucesso',
            };
        }
        catch (error) {
            throw new ConflictException(error.message)
        }
    }

    async detail(data: ProducerDetailDTO): Promise<any> {
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

                ProductSize: {
                    select: {
                        id: true,
                        name: true,
                        isActive: true
                    }
                },
                ProductType: {
                    select: {
                        id: true,
                        name: true,
                        isActive: true
                    }
                },
            },
        });


        if (customer) {
            return customer
        } else {
            throw new ConflictException('Produto não encontrado')
        }
    }

    async update(data: ProductCreateDTO, user_id: string) {

        const types = data.types;
        const sizes = data.sizes;

        const update = await this.prismaService.product.findUnique({
            where: {
                id: data.id,
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

        await this.prismaService.productType.deleteMany({
            where: {
                product_id: data.id,
            }
        })

        await this.prismaService.productSize.deleteMany({
            where: {
                product_id: data.id,
            }
        })

        await Promise.all(
            types.map(async (type) => {
                await this.prismaService.productType.create({
                    data: {
                        name: type.name,
                        isActive: type.isActive,
                        product_id: product.id
                    }
                })
            })
        )

        await Promise.all(
            sizes.map(async (size) => {
                await this.prismaService.productSize.create({
                    data: {
                        name: size.name,
                        isActive: size.isActive,
                        product_id: product.id
                    }
                })
            })
        )

        await this._logService.log({
            user_id: user_id,
            type: LogType.producer,
            action: 'Atualizou um produto.',
            before: null,
            after: null
        })

        return {
            message: 'Produto atualizado com sucesso',
            type: 'success'
        };
    }
}
