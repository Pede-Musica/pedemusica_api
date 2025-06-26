import { config } from 'dotenv';

config({ path: process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env' });

export const twilio = {
    auth: {
        accountSid: process.env.TWILIO_ACCOUNT_SID,
        authToken: process.env.TWILIO_AUTH_TOKEN,
        whatsappNumber: process.env.TWILIO_WHATSAPP_NUMBER,
    }
}

export const jwt = {
    auth: {
        secret: process.env.SECRET_AUTH,
        expiresIn: process.env.EXPIRES_IN_AUTH,
    },
    create_account: {
        secret: process.env.SECRET_CREATE_ACCOUNT,
        expiresIn: process.env.EXPIRES_CREATE_ACCOUNT,
    },
    reset_password: {
        secret: process.env.SECRET_RESET_PASSWORD,
        expiresIn: process.env.EXPIRES_RESET_PASSWORD,
    },
};

export const mail = {
    url: process.env.MAIL_URL,
    auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASS,
        sender: process.env.MAIL_SENDER,
        name: process.env.MAIL_NAME,
        key: process.env.MAIL_KEY,
        type: process.env.MAIL_TYPE,
    },
    template: {
        create_account: {
            link: process.env.LINK_CREATE_ACCOUNT,
            id: +process.env.MAIL_TEMPLATE_CREATE_ACCOUNT,
        },
        reset_password: {
            link: process.env.LINK_RESET_PASSWORD,
            id: +process.env.MAIL_TEMPLATE_CREATE_RESET_PASSWORD,
        },
    },
};

export const server = {
    port: +process.env.PORT,
};

export const middleware = {
    baseUrl: process.env.MIDDLEWARE_URL,
    auth: {
        secret: process.env.MIDDLEWARE_TOKEN,
    },
};
