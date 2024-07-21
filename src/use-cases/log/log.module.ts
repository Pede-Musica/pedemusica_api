import { Module } from '@nestjs/common';
import { LogService } from './log.service';
import { PrismaService } from 'src/infra/database/prisma.service';

@Module({
  providers: [LogService, PrismaService]
})
export class LogModule {}
