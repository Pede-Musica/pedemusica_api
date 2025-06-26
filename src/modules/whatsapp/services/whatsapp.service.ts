import { Injectable } from '@nestjs/common';
import { Twilio } from 'twilio';
import { SendMessageDto } from '../dtos/send-message.dto';
import { twilio } from 'src/common/configs/env';

@Injectable()
export class WhatsAppService {
    private client: Twilio;

    constructor() {
        this.client = new Twilio(
            twilio.auth.accountSid,
            twilio.auth.authToken
        );
    }

    async sendMessage({ to, message }: SendMessageDto) {
        try {
            const response = await this.client.messages.create({
                from: `whatsapp:${twilio.auth.whatsappNumber}`,
                to,
                body: message,
            });

            return {
                sid: response.sid,
                status: response.status,
            };
        } catch (error) {
            console.error('Erro ao enviar mensagem via Twilio:', error.message);
            throw new Error('Falha ao enviar mensagem via WhatsApp');
        }
    }
}
