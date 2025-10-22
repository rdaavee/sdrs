FROM node:24-alpine3.21 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --prefer-offline --no-audit

COPY . .
RUN npm run build

FROM node:24-alpine3.21

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/package*.json ./
RUN npm ci --only=production --prefer-offline --no-audit

COPY --from=builder /app/dist ./dist

COPY --from=builder /app/public ./public

RUN addgroup -S app && adduser -S app -G app
USER app

EXPOSE 3000

CMD ["npm", "run", "preview"]
