FROM node:lts-alpine3.19 as builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generat
RUN npx prisma migrate deploy
RUN npm run seeder

RUN npm run build
EXPOSE 3000

CMD [ "node", "dist/main.js" ]