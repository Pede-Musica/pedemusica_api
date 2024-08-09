import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { BooleanHandlerService } from 'src/shared/handlers/boolean.handler';
import { EntryCreateDTO } from './dto/entry-create.dto';
import { RegisterType } from 'src/shared/constants/register.enum';
import { RegisterPaginateDTO } from './dto/register-list.dto';
import { Prisma } from '@prisma/client';
import { RegisterDetailDTO } from './dto/register-detail.dto';
import { NotFoundError } from 'rxjs';

@Injectable()
export class RegisterService {

    constructor(
        public prismaService: PrismaService,
        public booleanHandlerService: BooleanHandlerService
    ) { }

    async createEntry(data: EntryCreateDTO, user_id: string) {

        try {

            const products = data.products;

            if (products.length === 0) {
                throw new ConflictException('Sem produtos de entrada');
            }

            const newRegister = await this.prismaService.register.create({
                data: {
                    type: RegisterType.entry
                }
            })

            const newEntry = await this.prismaService.entry.create({
                data: {
                    register_id: newRegister.id,
                    user_id: user_id,
                    producer_id: data.producer?.Producer?.id,
                    field: data.field,
                    entry_at: data.entry_at,
                    observation: data.observation
                }
            })

            products.map(async (product: any) => {

                product?.volumes?.map(async (volume: any) => {

                    await this.prismaService.volume.create({
                        data: {
                            entry_id: newEntry.id,
                            product_id: product.id,
                            product_name: product.name,
                            amount: volume.amount,
                            size: volume.size,
                            type: volume.type,
                            volume: volume.material.volume,
                            material_id: volume.material.id,
                            location_id: volume.location.id,
                        }
                    })

                    await this.prismaService.volumeEnter.create({
                        data: {
                            entry_id: newEntry.id,
                            product_id: product.id,
                            product_name: product.name,
                            amount: volume.amount,
                            size: volume.size,
                            type: volume.type,
                            volume: volume.material.volume,
                            material_id: volume.material.id,
                            location_id: volume.location.id,
                        }
                    })
                })

            })

            return {
                message: 'Entrada feita com sucesso',
            };
        }
        catch (error) {
            throw new ConflictException(error.message)
        }
    }

    async getRegister(params: RegisterPaginateDTO) {
        const order: Prisma.SortOrder =
            (params.order as unknown as Prisma.SortOrder) || 'desc';
        const page = params.page ? +params.page : 1;
        const perPage = params.pageSize ? +params.pageSize : 10;

        const total = await this.prismaService.register.count();

        const totalPages = Math.ceil(total / perPage);
        const offset = perPage * (page - 1);

        const registers = await this.prismaService.register.findMany({
            select:{
                id: true,
                type: true,
                created_at: true,
                Entry: {
                    select: {
                        id: true,
                        observation: true,
                        VolumeEnter: true,
                        Producer: {
                            select: {
                                Person: true
                            }
                        },
                        User: {
                            select: {
                                Person: {
                                    select: {
                                        name: true
                                    }
                                }
                            }
                        }
                    }
                },
                Exit: true,
            },
            take: perPage,
            skip: offset,
            orderBy: {
                created_at: order,
            },
        })

        const response = {
            data: registers,
            total,
            page,
            totalPages,
        };

        return response;
    }

    async detail(data: RegisterDetailDTO){

        const register = await this.prismaService.register.findUnique({
            where: {
                id: data.id
            },
            select: {
                id: true,
                type: true,
                created_at: true,
                updated_at: true,
                Entry: {
                    select:{
                        id: true,
                        created_at: true,
                        field: true,
                        entry_at: true,
                        observation: true,
                        Producer: {
                            select: {
                                Person: true
                            }
                        },
                        User:{
                            select:{
                                Person: true
                            }
                        },
                        VolumeEnter: {
                            select: {
                                id: true,
                                created_at: true,
                                entry_id: true,
                                Entry: {
                                    select: {
                                        Register: true,
                                        Producer: {
                                            select: {
                                                Person: true
                                            }
                                        },
                                    }
                                },
                                Product: true,
                                Material: true,
                                product_name: true,
                                amount: true,
                                size: true,
                                type: true,
                                volume: true,
                                Location: true,
                            }
                        },
                        Volume: {
                            select: {
                                id: true,
                                created_at: true,
                                entry_id: true,
                                Entry: {
                                    select: {
                                        Register: true,
                                        Producer: {
                                            select: {
                                                Person: true
                                            }
                                        },
                                    }
                                },
                                Product: true,
                                Material: true,
                                product_name: true,
                                amount: true,
                                size: true,
                                type: true,
                                volume: true,
                                Location: true,
                            }
                        },
                        VolumeExit: true,
                        VolumeLog: {
                            orderBy:{
                                created_at: 'asc'
                            }
                        }
                    }
                    
                },
                Exit: true,
            }
        })

        if(register){
            return register
        } else {
            throw new NotFoundException('Registro não encontrado')
        }
    }

    async listExit() {

        const exits = await this.prismaService.exit.findMany({
            where:{
                
            }
        })
    }
}
