FROM node:14

WORKDIR /app
COPY package.json ./package.json
COPY package-lock.json ./package-lock.json

COPY . ./

RUN npm install
