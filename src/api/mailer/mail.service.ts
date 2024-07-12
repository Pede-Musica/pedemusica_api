import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {

    constructor(
        private readonly mailerService: MailerService
    ) {}
    
    sendMail(): any {

        const mail_body = ``;
        const request = this.mailerService.sendMail({
            to: 'yuiti_fys@hotmail.com',
            from: 'noreplycooperflow@gmail.com',
            subject: 'Testing Nest Mailer',
            text: 'Wolcome test',
            html: mail_body
        })

        return request
    }
}
