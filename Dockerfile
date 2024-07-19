FROM node:lts-alpine3.19 as builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate
RUN npm run data-migration:seeder-index

RUN npm run build

FROM nginx:alpine
COPY --from=builder /usr/src/app/dist /usr/share/nginx/api
RUN ls -la /usr/share/nginx/api
COPY nginx.conf /etc/nginx/nginx.conf
COPY mime.types /etc/nginx/mime.types
RUN chmod -R 755 /usr/share/nginx/api
EXPOSE 3000

CMD [ "node", "dist/main.js" ]