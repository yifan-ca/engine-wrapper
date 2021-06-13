FROM node:14-alpine

WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY package*.json ./

RUN yarn --frozen-lockfile

COPY . .

RUN yarn build

ENV ENGINE_PATH /usr/bin/engine

EXPOSE 3000

CMD ["node", "dist/main"]
