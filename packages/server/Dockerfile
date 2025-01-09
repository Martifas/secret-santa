FROM node:23-alpine AS builder
WORKDIR /app/packages/server
COPY packages/server/package*.json ./package-lock.json ./
RUN npm ci
COPY packages/server/ ./
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "prod"]