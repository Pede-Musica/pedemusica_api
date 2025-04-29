import { Injectable } from '@nestjs/common';
import { mail } from '../../configs/env';
import { MailerService } from '@nestjs-modules/mailer';
import { env } from 'process';
import { LogService } from 'src/use-cases/log/log.service';


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
    private readonly mailerService: MailerService,
    private _logService: LogService
  ) { }

  async createAccount(data: mailerProps) {

    const link = `${env.LINK_CREATE_ACCOUNT}${data.token}`

    const _html = `
    <div style="max-width: 600px; margin: 0 auto; background-color: #f9fafb; font-family: Arial, sans-serif; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
      <div style="background-color: #ff3131; padding: 30px 20px; text-align: center; color: #ffffff;">
        <h1 style="margin: 0; font-size: 32px; font-weight: bold; color: #ffffff">Hangodash</h1>
        <p style="margin-top: 10px; font-size: 16px; color: #ffffff">Clique no botão abaixo para efetuar o primeiro acesso</p>
      </div>
      <div style="padding: 30px 20px; color: #374151;">
        <p style="margin: 0 0 10px 0; font-size: 16px;"><strong>Nome:</strong> ${data.name}</p>
        <p style="margin: 0 0 30px 0; font-size: 16px;"><strong>Usuário:</strong> ${data.to}</p>

        <div style="text-align: center;">
            <a href="${link}"
              target="_blank"
              style="
                background-color: #3b82f6;
                color: #ffffff;
                padding: 14px 28px;
                text-decoration: none;
                border-radius: 8px;
                font-size: 16px;
                font-weight: bold;
                display: inline-block;
              ">
              Primeiro Acesso
            </a>
          </div>
        </div>
        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af;">
          © 2025 Hangodash. Todos os direitos reservados.
        </div>
      </div>
    `

    try {
      const response = await this.mailerService.sendMail({
        to: data.to,
        from: 'no-reply@hangodash.com.br',
        subject: data.subject,
        text: data.text,
        html: _html,
      })
        .then(async () => {
          const log = {
            service: 'email',
            class: 'MailService',
            success: true,
            log: `E-mail de criação de acesso enviado com sucesso. Remetente: ${data.to}.`
          }
          await this._logService.createLogService(log)
        })
        .catch(async (error) => {
          const log = {
            service: 'email',
            class: 'MailService',
            success: false,
            log: error
          }
          await this._logService.createLogService(log)
        });
    } catch (error) {
      return console.log(error)
    }

  }

}
