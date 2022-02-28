FROM node:17-alpine3.14

COPY . /app

WORKDIR /app

RUN npm i