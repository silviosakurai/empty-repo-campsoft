FROM public.ecr.aws/docker/library/node:20.11.1-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY pnpm-lock.yaml* ./

COPY . .

ENV PNPM_HOME="/usr/local/share/pnpm"
ENV PATH="${PNPM_HOME}:${PATH}"

RUN npm install -g pnpm
RUN pnpm add -g turbo
RUN pnpm install

RUN turbo run build --filter=websocket

EXPOSE 3003

CMD node dist/index.js