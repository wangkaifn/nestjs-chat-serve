FROM node:20-alpine AS base

WORKDIR /app

COPY package.json .

RUN npm config set registry https://registry.npmmirror.com/
RUN npm install

COPY . .

RUN npm run build

# production stage
FROM node:20-alpine as production-stage

COPY --from=build-stage /app/dist /app
COPY --from=build-stage /app/package.json /app/package.json

WORKDIR /app

RUN npm config set registry https://registry.npmmirror.com/

RUN npm install --production

EXPOSE 1125

CMD ["node", "/app/main.js"]
