FROM node:20.11.1-alpine3.19 as common-build

RUN npm install -g pnpm

WORKDIR /usr/src/app

COPY package*.json ./
COPY . .

RUN pnpm install

RUN pnpm run build

EXPOSE 3001

CMD node dist/index.js