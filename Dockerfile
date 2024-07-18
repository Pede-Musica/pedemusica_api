FROM node:lts-alpine3.19 as builder

WORKDIR /

COPY package*.json ./
COPY prisma ./prisma/

RUN apk add --no-cache tzdata
RUN npm install
RUN npm install dotenv-cli

COPY . .

RUN npm run build

COPY .docker/node/entrypoint.sh ./

EXPOSE 3000
CMD [ "./entrypoint.sh" ]
