FROM node:24-alpine AS builder


WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build && ls -R dist



FROM node:24-alpine AS runner


WORKDIR /app


COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

COPY wait-for-it.sh ./wait-for-it.sh
COPY start.sh ./start.sh
COPY drizzle.config.ts ./drizzle.config.ts

COPY src/db/schema.ts ./src/db/schema.ts


RUN apk add --no-cache dos2unix bash \
    && dos2unix /app/wait-for-it.sh \
    && chmod +x /app/wait-for-it.sh \
    && apk del dos2unix

RUN apk add --no-cache dos2unix bash \
    && dos2unix /app/start.sh \
    && chmod +x /app/start.sh \
    && apk del dos2unix
COPY .env .env

CMD [ "./start.sh" ]


