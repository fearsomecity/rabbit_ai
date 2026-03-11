FROM node:20-slim

WORKDIR /app

COPY package.json package-lock.json* ./ 

RUN npm install --production

COPY src ./src

ENV PORT=5000

EXPOSE 5000

CMD ["npm", "start"]

