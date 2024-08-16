import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { BooleanHandlerService } from 'src/shared/handlers/boolean.handler';
import { EntryCreateDTO } from './dto/entry-create.dto';
import { RegisterType } from 'src/shared/constants/register.enum';
import { RegisterPaginateDTO } from './dto/register-list.dto';
import { Prisma } from '@prisma/client';
import { RegisterDetailDTO } from './dto/register-detail.dto';
import { NotFoundError } from 'rxjs';
import { ExitStatus } from 'src/shared/constants/exit-types.enum';
import { ExitCreateDTO } from './dto/exit.create.dto';
import { VolumeService } from '../volume/volume.service';

@Injectable()
export class RegisterService {

    constructor(
        public prismaService: PrismaService,
        public booleanHandlerService: BooleanHandlerService,
        public volumeService: VolumeService
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

            const promises = products.map(async (product: any) => {

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

            await Promise.all(promises);

            return {
                message: 'Entrada feita com sucesso',
            };
        }
        catch (error) {
            throw new ConflictException(error.message)
        }
    }

    async createExit(data: ExitCreateDTO, user_id: string) {

        try {

            const newRegister = await this.prismaService.register.create({
                data: {
                    type: RegisterType.exit
                }
            })

            const exit = await this.prismaService.exit.create({
                data: {
                    register_id: newRegister.id,
                    user_id: user_id,
                    exit_at: data.exit_at,
                    observation: data.observation,
                    exit_type: data.exit_type,
                    person_id: data.customer.id,
                    status: ExitStatus.ongoing,
                }
            })

            return {
                message: 'Saída criada com sucesso',
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
                                Person: {
                                    select: {
                                        name: true
                                    }
                                }
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
                Exit: {
                    select: {
                        id: true,
                        observation: true,
                        Volume: true,
                        created_at: true,
                        Register: {
                            select: {
                                Entry: {
                                    select: {
                                        Producer: {
                                            select: {
                                                Person: true
                                            }
                                        }
                                    }
                                }
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
                        },
                        Person: true
                    }
                },
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
                        VolumeLog: {
                            select:{    
                                id: true,
                                created_at: true,
                                dropped_amount: true,
                                generated_history: true,
                                origin_history: true,
                                User: {
                                    select: {
                                        Person: true
                                    }
                                }
                            },
                            orderBy:{
                                created_at: 'asc'
                            }
                        }
                    }
                    
                },
                Exit: {
                    select:{
                        id: true,
                        Person: true,
                        User: {
                            select:{
                                Person: true
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
                    }
                },
                
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
            select: {
                id: true,
                created_at: true,
                Person: true,
                User: {
                    select: {
                        Person: true
                    }
                },
                exit_at: true,
                observation: true,
                exit_type: true,
                status: true
            },
            where:{
                status: ExitStatus.ongoing
            }
        })

        return exits;
    }

    async detailExit(data: {id: string}) {

        const exit_id = Number(data.id)
        
        const exit = await this.prismaService.exit.findUnique({
            where: {
                id: exit_id
            },
            select: {
                id: true,
                created_at: true,
                Person: true,
                User: {
                    select: {
                        Person: true
                    }
                },
                exit_at: true,
                observation: true,
                exit_type: true,
                status: true,
                Volume: {
                    select:{
                        id: true,
                        entry_id: true,
                        Entry: {
                            select:{
                                Register: true,
                                User: {
                                    select: {
                                        Person: true
                                    }
                                },
                                Producer: {
                                    select: {
                                        Person: true
                                    }
                                }
                            }
                        },
                        exit_id: true,
                        size: true,
                        type: true,
                        amount: true,
                        volume: true,
                        transformed: true,
                        exited: true,
                        Material: true,
                        created_at:true,
                        Product: true,
                        product_name: true
                    }
                }
            },
        })

        return exit;
    }

    async closeExit(data: { exit_id: number, date: string, invoice?: string}, user_id: string) {

        const exit = await this.prismaService.exit.findUnique({
            where: {
                id: data.exit_id
            },
            select: {
                register_id: true,
                Volume: true
            }
        })


        const update = await this.prismaService.exit.update({
            where:{
                id: data.exit_id
            },
            data: {
                exit_at: data.date,
                status: ExitStatus.closed,
                invoice: data.invoice
            }
        })

        const volumes = exit.Volume;

        const logs = volumes.map(async (vol) => {

            const material = await this.prismaService.material.findUnique({
                where: {
                    id: vol.material_id
                }
            })
            
            const log = {
                entry_id: vol.entry_id,
                origin_history: `Volume incluso na saída S${data.exit_id}`,
                dropped_amount: 0,
                generated_history: `${vol.product_name} • ${vol.type} ${vol.size} (⇧ ${vol.amount} ${vol.amount > 1 ? 'unidades' : 'unidade'} • ${vol.volume}kg) • ${material.name};` ,
                user_id: user_id
            }
    
            await this.volumeService.log(log)

        })

        await Promise.all(logs)

        return {
            message: 'Saída finalizada com sucesso'
        }
    }
}
