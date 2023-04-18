

FROM node:16.3.0-alpine3.13
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN apk add --no-cache make gcc g++ python3
RUN npm rebuild bcrypt --build-from-source
EXPOSE 8080
# VOLUME /app/images/plantes
CMD [ "node", "server.js" ]