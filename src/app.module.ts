import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './api/mailer/mail.service';
import { UserModule } from './use-cases/user/user.module';
import { AuthModule } from './use-cases/user/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { LogModule } from './use-cases/log/log.module';

@Module({
  imports: [
    AuthModule,
    JwtModule.register({
      global: true,
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.hostinger.com',
        port: 465,
        secure: true,
        auth: {
          user: 'no-reply@hangodash.com.br',
          pass: '>7V>ogYnq&3l'
        }
      }
    }),
    UserModule,
  ],
  controllers: [],
  providers: [MailService],
})
export class AppModule { }
