FROM node:20-slim

WORKDIR /app

COPY backend/package.json backend/package-lock.json* ./

RUN npm install --production

COPY backend/src ./src

ENV PORT=5000

EXPOSE 5000

CMD ["node", "src/index.js"]
