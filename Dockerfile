FROM node:14.18.1

WORKDIR /app/nodejs

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

COPY . .
EXPOSE 5000

RUN npm install -g nodemon
CMD [ "npm", "run", "server" ]