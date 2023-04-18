FROM node:18.12.1-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN apk add --no-cache make gcc g++ python3
RUN npm rebuild bcrypt --build-from-source
EXPOSE 8080
VOLUME /app/images/plantes
CMD [ "node", "server.js" ]
