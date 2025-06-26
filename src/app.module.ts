import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { UserModule } from './modules/users/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { SessionModule } from './modules/sessions/session.module';
import { ClientModule } from './modules/clients/client.module';
import { ConfigModule } from '@nestjs/config';
import { WhatsAppModule } from './modules/whatsapp/whatsapp.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './modules/auth/guards/auth.guard';

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
    ClientModule,
    WhatsAppModule,
  ],
  controllers: [],
  providers: [
    JwtService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule { }
