# Dockerfile
FROM node:lts

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

EXPOSE 3000
CMD ORIGIN=http://0.0.0.0:3000 node build