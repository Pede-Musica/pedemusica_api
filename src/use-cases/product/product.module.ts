import { PrismaService } from 'src/infra/database/prisma.service';
import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { LogService } from '../log/log.service';

@Module({
  controllers: [ProductController],
  providers: [ProductService, PrismaService, LogService]
})
export class ProductModule {}
