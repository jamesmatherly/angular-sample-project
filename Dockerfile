### STAGE 1: Build ###
FROM node:lts-alpine AS build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build
### STAGE 2: Run ###
FROM nginx:alpine
VOLUME /etc/letsencrypt/live/jameslearnscloud.com
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 4200
COPY --from=build /usr/src/app/dist/angular-sample-project /usr/share/nginx/html
