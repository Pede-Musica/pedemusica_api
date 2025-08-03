import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { PrismaService } from 'src/common/infra/database/prisma.service';
import { MailService } from '../mailer/services/mail.service';
import { UserRepository } from './repositories/user.repository';
import { ClientService } from '../clients/services/client.service';
import { ClientRepository } from '../clients/repositories/client.repository';
import { PersonService } from '../persons/services/person.service';
import { PersonRepository } from '../persons/repositories/person.repository';
import { NewUserService } from '../new-users/services/new-user.service';
import { NewUserRepository } from '../new-users/repositories/new-user.repository';
import { WhatsAppService } from '../whatsapp/services/whatsapp.service';

@Module({
  controllers: [UserController],
  providers: [NewUserRepository, WhatsAppService, PersonRepository, ClientRepository, UserService, PrismaService, MailService, UserRepository, ClientService, PersonService, NewUserService]

})
export class UserModule { }
