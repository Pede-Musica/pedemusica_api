import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './api/mailer/mail.service';
import { UserModule } from './use-cases/user/user.module';
import { AuthModule } from './use-cases/user/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { UserController } from './use-cases/user/user.controller';
import { ProducerModule } from './use-cases/producer/producer.module';
import { CustomerModule } from './use-cases/customer/customer.module';
import { ProductModule } from './use-cases/product/product.module';
import { LocationModule } from './use-cases/location/location.module';
import { MaterialModule } from './use-cases/material/material.module';
import { LogModule } from './use-cases/log/log.module';
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
    ProducerModule,
    CustomerModule,
    ProductModule,
    LocationModule,
    MaterialModule,
    LogModule
  ],
  controllers: [],
  providers: [MailService],
})
export class AppModule { }
