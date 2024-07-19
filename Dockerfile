FROM node:lts-alpine3.19 as builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate
RUN npm run data-migration:seeder-index

RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist/cooper_flow_web/browser /usr/share/nginx/html
RUN ls -la /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
COPY mime.types /etc/nginx/mime.types
RUN chmod -R 755 /usr/share/nginx/html
EXPOSE 3000

CMD [ "node", "dist/main.js" ]