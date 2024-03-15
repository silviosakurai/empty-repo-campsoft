FROM node:20.11.1 as builder

WORKDIR /app

COPY package*.json ./
COPY pnpm-lock.yaml* ./

COPY . .

ENV PNPM_HOME="/usr/local/share/pnpm"
ENV PATH="${PNPM_HOME}:${PATH}"

RUN npm install -g pnpm
RUN pnpm add -g turbo
RUN pnpm install

RUN turbo run build --filter=public

FROM node:20.11.1

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/pnpm-lock.yaml* ./

COPY --from=builder /app/apps/public_api/dist /app

RUN npm install -g pnpm
RUN pnpm install --prod

CMD ["node", "/app/apps/public_api/src/index.js"]