import { Module } from '@nestjs/common';
import { VolumeService } from './volume.service';
import { VolumeController } from './volume.controller';
import { PrismaService } from 'src/infra/database/prisma.service';

@Module({
  providers: [VolumeService, PrismaService],
  controllers: [VolumeController]
})
export class VolumeModule {}
