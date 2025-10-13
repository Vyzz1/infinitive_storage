# ===============================
# 1️⃣ BUILD STAGE
# ===============================
FROM oven/bun:1-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN bun install

COPY . .

RUN bun run build



FROM oven/bun:1-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.env ./.env

COPY wait-for-it.sh ./wait-for-it.sh

RUN apk add --no-cache dos2unix bash \
    && dos2unix /app/wait-for-it.sh \
    && chmod +x /app/wait-for-it.sh \
    && apk del dos2unix



CMD ["bun", "run", "dist/worker.js"]
