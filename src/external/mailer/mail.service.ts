import { Injectable } from '@nestjs/common';
import { mail } from '../../configs/env';
import { MailerService } from '@nestjs-modules/mailer';
import { env } from 'process';


interface mailerProps {
  to: string
  subject: string
  text: string,
  name: string,
  token: string
}

@Injectable()
export class MailService {

  constructor(
    private readonly mailerService: MailerService
  ) { }

  async createAccount(data: mailerProps) {

    const link = `${env.LINK_CREATE_ACCOUNT}${data.token}`

    const _html = `
    <div>
      <div style="text-align:center; padding: 20px; border-radius: 10px; margin-bottom: 20px">
        <p style="font-weight: bold; font-size: 20px">Bem vindo ao <strong>CooperFlow</strong></p>
        <span>Clique no link abaixo para efetuar o primeiro acesso.</span>
      </div>
      <div style="padding: 20px; text-align:">
        <div>
          <span>Nome: ${data.name}</span>
        </div>
        <div style="margin-bottom: 20px;">
          <span>Usuário: ${data.to}</span>
        </div>
        <div style="margin-bottom: 20px; text-align: center">
          <a href="${link}">Primeiro acesso</a>
        </div>
      </div>
    </div>
    `

    try {
      const response = this.mailerService.sendMail({
        to: data.to,
        from: 'noreplycooperflow@gmail.com',
        subject: data.subject,
        text: data.text,
        html: _html
      })
        .then(() => {
          return response
        })
        .catch(() => {
          return response
        });
    } catch (error) {

    }

  }

}
