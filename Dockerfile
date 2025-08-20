FROM node:24.6.0-alpine3.21
WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY lib/ ./lib/
COPY bin/ ./bin
COPY migrations/ ./migrations/

RUN npm ci --only=production --ignore-scripts
RUN npm run build
RUN npm run migration:up

EXPOSE 3000
CMD ["npm", "run", "start"]
