import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { ProducerCreateDTO } from './dto/producer.dto';
import { ProducerPaginateDTO } from './dto/producer-paginate.dto';
import { Prisma } from '@prisma/client';
import { ProducerDetailDTO } from './dto/producer-detail.dto';
import { PersonCreateDTO } from '../person/dto/person-create.dto';

@Injectable()
export class ProducerService {

    constructor(
        public prismaService: PrismaService
    ) { }

    async create(data: ProducerCreateDTO, person_id: string) {

        const producer = await this.prismaService.producer.create({
            data: {
                person_id: person_id,
                cad_pro: data.cad_pro,
                ggn: data.ggn
            }
        })

        return producer;
    }

    async update(data: ProducerCreateDTO, person_id: string) {
        const currentProducer = await this.prismaService.producer.findUnique({
            where: {
                person_id: person_id,
            },
        });

        const producer = await this.prismaService.producer.update({
            where: {
                person_id: person_id
            },
            data: {
                cad_pro: data.cad_pro,
                ggn: data.ggn
            }
        });

        return producer;
    }
}
