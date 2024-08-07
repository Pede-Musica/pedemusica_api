import { Controller } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';

@Controller('system')
export class SystemController {

    constructor(
        private readonly prismaService: PrismaService
    ) {}

}
