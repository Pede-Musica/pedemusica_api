import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { VolumeDetailDTO } from './dto/volume-detail.dto';

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
                            select:{
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
}
