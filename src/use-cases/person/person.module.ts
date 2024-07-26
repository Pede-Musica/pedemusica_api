import { Module } from '@nestjs/common';
import { PersonController } from './person.controller';
import { PersonService } from './person.service';
import { PrismaService } from 'src/infra/database/prisma.service';
import { LogService } from '../log/log.service';

@Module({
  controllers: [PersonController],
  providers: [PersonService, PrismaService, LogService]
})
export class PersonModule {}
