FROM node:16.17.0-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY ./src ./src

COPY ./video ./video

CMD npm start