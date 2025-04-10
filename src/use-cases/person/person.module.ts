import { Module } from '@nestjs/common';
import { PersonController } from './person.controller';
import { PersonService } from './person.service';
import { PrismaService } from 'src/infra/database/prisma.service';
import { LogService } from '../log/log.service';
import { MailService } from 'src/external/mailer/mail.service';
import { UserService } from '../user/user.service';
import { BooleanHandlerService } from 'src/shared/handlers/boolean.handler';

@Module({
  controllers: [PersonController],
  providers: [
    PersonService, 
    PrismaService, 
    LogService, 
    MailService, 
    UserService,
    BooleanHandlerService
  ]
})
export class PersonModule {}
