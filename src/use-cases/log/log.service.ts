import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';

interface props {
    user_id: string
    type: string
    action: string
    before: string
    after: string
}

@Injectable()
export class LogService {

    constructor(
        public prismaService: PrismaService
    ) {}

    async log(data: props) {

        await this.prismaService.logSystem.create({
            data: {
                user_id: data.user_id,
                type: data.type,
                action: data.action,
                before: data.before,
                after: data.after
            }   
        })
    }
}
