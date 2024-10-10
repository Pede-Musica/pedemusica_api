import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { VolumeDetailDTO } from './dto/volume-detail.dto';
import { VolumeTransformDTO } from './dto/volume-transform.dto';

@Injectable()
export class VolumeService {

    constructor(
        public prismaService: PrismaService,
    ) { }

    async detail(data: VolumeDetailDTO): Promise<any> {
        const volume = await this.prismaService.volume.findUnique({
            where: {
                id: data.id,
            },
            select: {
                id: true,
                entry_id: true,
                Entry: {
                    select: {
                        created_at: true,
                        entry_at: true,
                        field: true,
                        id: true,
                        observation: true,
                        Producer: {
                            select: {
                                Person: true,
                                ggn: true,
                                cad_pro: true
                            }
                        },
                        Register: true,
                        User: {
                            select: {
                                Person: true
                            }
                        }
                    }
                },
                product_id: true,
                Product: {
                    select:{
                        name: true,
                        isActive: true,
                        ProductSize: true,
                        ProductType: true,
                    }
                },
                size: true,
                type: true,
                volume: true,
                Material: true,
                Location: {
                    select: {
                        id: true,
                        name: true,
                        Sector: true
                    }
                },
                amount: true,
                weight: true,
                transformed: true,
                exited: true,
                product_name: true,
                created_at: true,
                updated_at: true,
            },
        });


        if (volume) {
            return volume
        } else {
            throw new ConflictException('Volume não encontrado')
        }
    }

    async transform(data: VolumeTransformDTO, user_id: string) {

        try {
            const current_volume: any = await this.detail({ id: data.current_volume.id })

            const volumes = data.new_volumes;
            const remaining = current_volume.weight- data.drawn_weight;
            const date = current_volume.updated_at.toISOString();
            let remove: string | null = '';

            if (date !== String(data.updated_at)) {
                throw new NotFoundException('Os dados deste volumes estão desatualizados')
            }

            if (data.drawn_weight < 0) {
                throw new ConflictException('O peso a ser retirado não pode ser negativo')
            }

            if (remaining === 0) {
                remove = null;
            } else {
                remove = current_volume.location_id
            }

            const update = await this.prismaService.volume.update({
                where: {
                    id: data.current_volume.id
                },
                data: {
                    weight: remaining,
                    location_id: remove
                }
            })

            if (update) {

                const log = {
                    entry_id: current_volume.entry_id,
                    origin_history: `[${current_volume.Location.name}] Retirado ⇩ ${data.drawn_weight} kg • ${current_volume.volume}kg de ${current_volume.product_name} • ${current_volume.type} • ${current_volume.size}`,
                    dropped_weight: data.drawn_weight,
                    generated_history: '',
                    user_id: user_id
                }
    
                await this.log(log)

                const promises = volumes.map(async (vol) => {

                    const new_material = await this.prismaService.material.findUnique({ where: { id: vol?.material_id } });
                    const new_location = await this.prismaService.location.findUnique({ where: { id: vol?.location_id } });
                    let volume = 0;

                    if(vol.single) {
                        volume = vol.volume;
                        vol.material_id = null;
                    } else {
                        volume = new_material.volume;
                    }

                    switch (data.movimentation_type) {
                        case 'movimentation': {

                            await this.prismaService.volume.create({
                                data: {
                                    entry_id: current_volume.entry_id,
                                    product_id: current_volume.product_id,
                                    size: vol.size,
                                    type: vol.type,
                                    volume: volume,
                                    material_id: vol.material_id,
                                    location_id: vol.location_id,
                                    amount: 0,
                                    weight: vol.weight,
                                    transformed: true,
                                    exited: false,
                                    product_name: current_volume.product_name,
                                    exit_id: null
                                }
                            }).then(async () => {

                                const log = {
                                    entry_id: current_volume.entry_id,
                                    origin_history: `Novo volume: Alocado em [${new_location.name}] ${current_volume.product_name} • ${vol.type} ${vol.size} (⇧ ${vol.amount} ${vol.amount > 1 ? 'unidades' : 'unidade'})`,
                                    dropped_weight: data.drawn_weight,
                                    generated_history: '',
                                    user_id: user_id
                                }
                    
                                await this.log(log)
                            })

                            break;
                        }
                        case 'exit': {

                            const exit = await this.prismaService.exit.findUnique({
                                where: {
                                    id: vol.exit_id
                                }
                            })

                            await this.prismaService.volume.create({
                                data: {
                                    entry_id: current_volume.entry_id,
                                    product_id: current_volume.product_id,
                                    size: vol.size,
                                    type: vol.type,
                                    volume: volume,
                                    material_id: vol.material_id,
                                    location_id: null,
                                    amount: 0,
                                    weight: vol.weight,
                                    transformed: true,
                                    exited: true,
                                    product_name: current_volume.product_name,
                                    exit_id: vol.exit_id
                                }
                            }).then(async () => {

                                const log = {
                                    entry_id: current_volume.entry_id,
                                    origin_history: `Alocado para saída: [S${exit.id}] ${current_volume.product_name} • ${vol.type} ${vol.size} (⇧ ${vol.amount} ${vol.amount > 1 ? 'unidades' : 'unidade'})`,
                                    dropped_weight: data.drawn_weight,
                                    generated_history: '',
                                    user_id: user_id
                                }
                    
                                await this.log(log)
                            })

                            break;
                        }

                    }
                })

                await Promise.all(promises);
            }

            return {
                message: 'O volume foi movimentado com sucesso'
            }
        }
        catch (error) {
            throw new ConflictException(error)
        }
    }

    async log(data: { entry_id: number, origin_history: string, generated_history: string, dropped_weight: number, user_id: string }) {

        try {
            const log = await this.prismaService.volumeLog.create({
                data: {
                    entry_id: data.entry_id,
                    origin_history: data.origin_history,
                    generated_history: data.generated_history,
                    dropped_weight: data.dropped_weight,
                    user_id: data.user_id
                }
            })

            return true;
        }
        catch (error) {
            return false;
        }
    }

    async returnVolume(data: { volume_id: string, location_id: string }, user_id) {

        const volume = await this.prismaService.volume.findUnique({
            where: {
                id: data.volume_id
            },
            select: {
                entry_id: true,
                exit_id: true,
                product_name: true,
                type: true,
                size: true,
                amount: true,
                Material: true
            }
        })

        const location = await this.prismaService.location.findUnique({
            where: {
                id: data.location_id
            }
        })


        const update = await this.prismaService.volume.update({
            where: {
                id: data.volume_id
            },
            data: {
                location_id: data.location_id,
                exited: false,
                exit_id: null
            }
        })
        
        const log = {
            entry_id: volume.entry_id,
            origin_history: `Retirou um volume da saída S${volume.exit_id}`,
            dropped_weight: 0,
            generated_history: `[${location.name}] ${volume.product_name} • ${volume.type} ${volume.size} (⇧ ${volume.amount} ${volume.amount > 1 ? 'unidades' : 'unidade'} • ${volume.Material.volume}kg) • ${volume.Material.name}; `,
            user_id: user_id
        }

        await this.log(log)

        return {
            message: 'Volume retornado com sucesso'
        }
    }

    async delete(id: string) {

        try {
            const volume = await this.prismaService.volume.update({
                where: {
                    id: id
                },
                data: {
                    deleted_at: new Date()
                }
            });

            return {
                message: 'Volume excluído com sucesso'
            }
        }
        catch(error) {
            throw new ConflictException(error.message)
        }
    }
}
