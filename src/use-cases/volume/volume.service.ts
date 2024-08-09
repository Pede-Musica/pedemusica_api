import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { VolumeDetailDTO } from './dto/volume-detail.dto';
import { VolumeTransformDTO } from './dto/volume-transform.dto';

@Injectable()
export class VolumeService {

    constructor(
        public prismaService: PrismaService
    ) { }

    async detail(data: VolumeDetailDTO): Promise<any> {
        const volume = await this.prismaService.volume.findUnique({
            where: {
                id: data.id,
            },
            select: {
                id: true,
                Entry: {
                    select: {
                        created_at: true,
                        entry_at: true,
                        field: true,
                        id: true,
                        observation: true,
                        Producer: true,
                        Register: true,
                        User: {
                            select: {
                                Person: true
                            }
                        }
                    }
                },
                Product: true,
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
            const current_volume = await this.prismaService.volume.findUnique({
                where: {
                    id: data.current_volume.id
                },
            })

            const volumes = data.new_volumes;
            const remaining = (current_volume.amount * current_volume.volume) - (data.drawn);
            const amount = current_volume.amount - data.drawn_amount;
            const date = current_volume.updated_at.toISOString();
            const material = await this.prismaService.material.findUnique({ where: { id: current_volume.material_id } });
            let remove: string | null = '';

            if (date !== String(data.updated_at)) {
                throw new NotFoundException('Os dados deste volumes estão desatualizados')
            }

            if (remaining !== data.remaining) {
                throw new NotFoundException('Volume restante inválido')
            }

            if (data.remaining < 0) {
                throw new ConflictException('O volume restante não pode ser negativo')
            }

            if (data.drawn_amount < 0) {
                throw new ConflictException('O volume a ser retirado não pode ser negativo')
            }

            if (remaining === 0) {
                remove = null
            } else {
                remove = current_volume.location_id
            }

            const update = await this.prismaService.volume.update({
                where: {
                    id: data.current_volume.id
                },
                data: {
                    amount: amount,
                    location_id: remove
                }
            })

            const log_1 = {
                entry_id: current_volume.entry_id,
                history: `Retirado ${data.drawn_amount} ${data.drawn_amount > 1 ? 'unidades' : 'unidade'} de ${data.current_volume.Location.name}.`
            }

            await this.log(log_1)

            if (update) {
                volumes.map(async (vol) => {

                    const new_material = await this.prismaService.material.findUnique({ where: { id: vol.material_id } });
                    const new_location = await this.prismaService.location.findUnique({ where: { id: vol.location_id } });

                    await this.prismaService.volume.create({
                        data: {
                            entry_id: current_volume.entry_id,
                            product_id: current_volume.product_id,
                            size: current_volume.size,
                            type: current_volume.type,
                            volume: new_material.volume,
                            material_id: vol.material_id,
                            location_id: vol.location_id,
                            amount: vol.amount,
                            transformed: true,
                            exited: false,
                            product_name: current_volume.product_name
                        }
                    })

                    const log = {
                        entry_id: current_volume.entry_id,
                        history: `Retirado de ${data.current_volume.Location.name}, criado novo volume de ${vol.amount} ${vol.amount > 1 ? 'unidades' : 'unidade'} com material ${new_material.name} para ${new_location.name}.`
                    }

                    await this.log(log)
                })
            }


            return {
                message: 'O volume foi movimentado com sucesso'
            }
        }
        catch (error) {
            throw new ConflictException(error)
        }
    }

    async log(data: { entry_id: number, history: string }) {

        try {
            const log = await this.prismaService.volumeLog.create({
                data: {
                    entry_id: data.entry_id,
                    history: data.history
                }
            })

            return true;
        }
        catch (error) {
            return false;
        }
    }
}
