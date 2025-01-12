FROM node:23-alpine AS builder

WORKDIR /app

COPY package*.json .
COPY client/package*.json client/
COPY server/package*.json server/
RUN npm ci

COPY . .

WORKDIR /app/client
RUN npm run build

EXPOSE 80

CMD ["npm", "run", "preview:prod"]