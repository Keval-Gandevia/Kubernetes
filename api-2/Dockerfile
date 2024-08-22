FROM node:slim

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY server.js ./

ENV PORT=6001

EXPOSE 6001

CMD ["npm", "start"]

