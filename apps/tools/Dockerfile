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

RUN turbo run build --filter=tools

FROM node:20.11.1

WORKDIR /app

COPY --from=builder /app/apps/tools/dist /app
COPY --from=builder /app/node_modules /app/node_modules

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/apps/tools/package*.json ./apps/tools

EXPOSE 3000

WORKDIR /app/apps/tools/src

CMD ["node", "index.js"]