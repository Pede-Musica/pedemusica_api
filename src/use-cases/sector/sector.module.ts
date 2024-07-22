import { Module } from '@nestjs/common';
import { SectorController } from './sector.controller';
import { SectorService } from './sector.service';
import { PrismaService } from 'src/infra/database/prisma.service';
import { LogService } from '../log/log.service';

@Module({
  controllers: [SectorController],
  providers: [SectorService, PrismaService, LogService],
})
export class SectorModule {}
