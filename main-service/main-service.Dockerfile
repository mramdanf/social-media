FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

## Add the wait script to the image
COPY --from=ghcr.io/ufoscout/docker-compose-wait:latest /wait /wait

RUN npm install

COPY . .

ARG MONGO_DB_NAME
ARG MONGO_DB_ROOT_USERNAME
ARG MONGO_DB_ROOT_PASSWORD
ARG MONGO_DB_PORT
ARG MONGO_DB_HOST
ARG MAIN_SERVICE_PORT
ARG MAIN_SERVICE_JWT_PRIVATE_KEY

ENV MONGO_DB_NAME=${MONGO_DB_NAME}
ENV MONGO_DB_ROOT_USERNAME=${MONGO_DB_ROOT_USERNAME}
ENV MONGO_DB_ROOT_PASSWORD=${MONGO_DB_ROOT_PASSWORD}
ENV MONGO_DB_PORT=${MONGO_DB_PORT}
ENV MONGO_DB_HOST=${MONGO_DB_HOST}
ENV MAIN_SERVICE_PORT=${MAIN_SERVICE_PORT}
ENV MAIN_SERVICE_JWT_PRIVATE_KEY=${MAIN_SERVICE_JWT_PRIVATE_KEY}