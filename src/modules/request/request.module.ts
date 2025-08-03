import { Module } from '@nestjs/common';
import { RequestController } from './request.controller';
import { RequestService } from './request.service';
import { PrismaService } from 'src/common/infra/database/prisma.service';

@Module({
  controllers: [RequestController],
  providers: [RequestService, PrismaService]
})

export class RequestModule { }
