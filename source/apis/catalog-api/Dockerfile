FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY . .
USER node
EXPOSE 3001
CMD ["node", "server.js"]
