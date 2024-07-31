import { PrismaService } from 'src/infra/database/prisma.service';
import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { LogService } from '../log/log.service';
import { BooleanHandlerService } from 'src/shared/handlers/boolean.handler';

@Module({
  controllers: [ProductController],
  providers: [ProductService, PrismaService, LogService, BooleanHandlerService]
})
export class ProductModule {}
