import { PrismaService } from 'src/infra/database/prisma.service';
import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProducerController } from '../producer/producer.controller';
import { ProductController } from './product.controller';

@Module({
  controllers: [ProductController],
  providers: [ProductService, PrismaService]
})
export class ProductModule {}
