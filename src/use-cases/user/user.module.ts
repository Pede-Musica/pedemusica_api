import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from 'src/infra/database/prisma.service';
import { MailService } from 'src/external/mailer/mail.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, MailService]
})
export class UserModule {}
