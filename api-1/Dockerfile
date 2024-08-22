FROM node:slim

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY server.js ./

ENV PORT=6000

EXPOSE 6000

CMD ["npm", "start"]

