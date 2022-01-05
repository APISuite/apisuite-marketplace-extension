FROM node:16-alpine AS build_phase
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:16-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=production && npm install ts-node
COPY --from=build_phase /usr/src/app/dist ./dist
COPY --from=build_phase /usr/src/app/migrations ./migrations

USER node

ENTRYPOINT ["npm", "run"]
