import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './api/mailer/mail.service';
import { UserModule } from './use-cases/user/user.module';
import { AuthModule } from './use-cases/user/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { UserController } from './use-cases/user/user.controller';
// import { ProducerModule } from './use-cases/producer/producer.module';
// import { CustomerModule } from './use-cases/customer/customer.module';
import { ProductModule } from './use-cases/product/product.module';
import { LocationModule } from './use-cases/location/location.module';
import { MaterialModule } from './use-cases/material/material.module';
import { LogModule } from './use-cases/log/log.module';
import { SectorModule } from './use-cases/sector/sector.module';
import { PersonModule } from './use-cases/person/person.module';
import { RegisterModule } from './use-cases/register/register.module';
import { SystemModule } from './use-cases/system/system.module';
import { VolumeModule } from './use-cases/volume/volume.module';
@Module({
  imports: [
    AuthModule,
    JwtModule.register({
      global: true,
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: 'noreplycooperflow@gmail.com',
          pass: 'aeduzxgkjhlunmne'
        }
      }
    }),
    UserModule,
    // ProducerModule,
    // CustomerModule,
    ProductModule,
    LocationModule,
    MaterialModule,
    LogModule,
    SectorModule,
    PersonModule,
    RegisterModule,
    SystemModule,
    VolumeModule
  ],
  controllers: [],
  providers: [MailService],
})
export class AppModule { }
