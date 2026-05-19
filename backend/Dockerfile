FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
COPY tsconfig.json ./
COPY src ./src/

RUN npm ci --include=dev && \
    npx prisma generate && \
    npm run build && \
    npm prune --omit=dev

EXPOSE 8080

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
