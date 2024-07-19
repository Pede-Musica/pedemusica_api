FROM node:lts-alpine3.19 as builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate
RUN npm run data-migration:seeder-index

RUN npm run build
EXPOSE 3000

CMD [ "node", "dist/main.js" ]