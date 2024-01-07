FROM node:18.19.0-alpine3.19

WORKDIR /usr/src/app

COPY package*.json ./

COPY . .

RUN npm install

RUN npm run build

RUN npm run test