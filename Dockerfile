# Dockerfile
FROM node:lts

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm build

EXPOSE 3000
CMD ["ORIGIN=http://0.0.0.0:3000", "node", "build"]