import { Module } from '@nestjs/common';
import { MaterialService } from './material.service';
import { MaterialController } from './material.controller';
import { PrismaService } from 'src/infra/database/prisma.service';
import { BooleanHandlerService } from 'src/shared/handlers/boolean.handler';

@Module({
  controllers: [MaterialController],
  providers: [MaterialService, PrismaService, BooleanHandlerService],
})
export class MaterialModule {}
