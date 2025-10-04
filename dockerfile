FROM node:22-alpine

WORKDIR /usr/src/app

#Habilitar pnpm con core pack
RUN corepack enable

COPY package.json pnpm-lock.yaml ./

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

COPY . .

EXPOSE 3000
