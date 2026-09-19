# Backend Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
COPY . .
RUN npm install --production
EXPOSE 5000
CMD ["node", "src/index.js"]
