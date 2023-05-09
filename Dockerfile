FROM node:18
EXPOSE 3000:8080
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD [ "npm", "run", "dev" ]
