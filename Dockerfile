# Dockerfile
FROM node:lts

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000
CMD ORIGIN=http://0.0.0.0:3000 node build