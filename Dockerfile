# Dockerfile
FROM node:lts AS build

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM node:lts AS deploy

WORKDIR /app
RUN rm -rf ./*
COPY --from=build /app/package.json .
COPY --from=build /app/build .

EXPOSE 3000
CMD ORIGIN=http://0.0.0.0:3000 node build