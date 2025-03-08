# Build stage
FROM node:23-alpine AS builder

ARG VITE_AUTH0_DOMAIN
ARG VITE_AUTH0_CLIENT_ID
ARG VITE_AUTH0_AUDIENCE
ARG VITE_API_ORIGIN
ARG VITE_API_PATH

ENV VITE_AUTH0_DOMAIN=$VITE_AUTH0_DOMAIN
ENV VITE_AUTH0_CLIENT_ID=$VITE_AUTH0_CLIENT_ID
ENV VITE_AUTH0_AUDIENCE=$VITE_AUTH0_AUDIENCE
ENV VITE_API_ORIGIN=$VITE_API_ORIGIN
ENV VITE_API_PATH=$VITE_API_PATH

WORKDIR /app
COPY package*.json .
COPY client/package*.json client/
COPY server/package*.json server/
RUN npm ci
COPY . .
WORKDIR /app/client
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/client/dist /usr/share/nginx/html

COPY client/nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]