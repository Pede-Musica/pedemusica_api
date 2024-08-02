import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { BooleanHandlerService } from 'src/shared/handlers/boolean.handler';
import { EntryCreateDTO } from './dto/entry-create.dto';
import { RegisterType } from 'src/shared/constants/register.enum';

@Injectable()
export class RegisterService {

    constructor(
        public prismaService: PrismaService,
        public booleanHandlerService: BooleanHandlerService
    ) { }

    async createEntry(data: EntryCreateDTO, user_id: string) {

        try {

            const products = data.products;

            if(products.length === 0) {
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

            products.map( async(product: any) => {

                product?.volumes?.map( async (volume: any) => {

                    await this.prismaService.volume.create({
                        data: {
                            entry_id: newEntry.id,
                            product_id: product.id,
                            amount: volume.amount,
                            size: volume.size,
                            type: volume.type,
                            volume: volume.material.volume,
                            volume_type: volume.material.volume_type,
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
}
