import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './api/mailer/mail.service';
import { UserModule } from './modules/users/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { SessionModule } from './modules/sessions/session.module';
import { ClientModule } from './modules/clients/client.module';
import { ConfigModule } from '@nestjs/config';

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
    SessionModule,
    ClientModule
  ],
  controllers: [],
  providers: [MailService],
})
export class AppModule { }
