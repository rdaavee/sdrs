FROM node:24-alpine3.21

WORKDIR /app

COPY package*.json ./

RUN npm ci --prefer-offline --no-audit

COPY . .

EXPOSE 3000

ENV CHOKIDAR_USEPOLLING=true

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]