### STAGE 1: Build ###
FROM node:16 as builder
WORKDIR /app
COPY package*.json ./
RUN npm install 
COPY . .
CMD ["npm", "run", "start"]