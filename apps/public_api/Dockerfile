FROM public.ecr.aws/docker/library/node:lts-alpine3.19 as builder

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

FROM public.ecr.aws/docker/library/node:lts-alpine3.19

WORKDIR /app

COPY --from=builder /app/apps/public_api/dist /app
COPY --from=builder /app/node_modules /app/node_modules

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/apps/public_api/package*.json ./apps/public_api

EXPOSE 3001:3001

CMD ["node", "/app/apps/public_api/src/index.js"]