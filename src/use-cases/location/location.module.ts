import { PrismaService } from 'src/infra/database/prisma.service';
import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';

@Module({
  providers: [LocationService, PrismaService],
  controllers: [LocationController]
})
export class LocationModule {}
