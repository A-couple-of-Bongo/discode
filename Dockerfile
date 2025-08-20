FROM node:24.6.0-alpine3.21
WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY lib/ ./lib/
COPY bin/ ./bin
COPY migrations/ ./migrations/

VOLUME [ "/app/data" ]
RUN mkdir /app/data

ENV DATABASE_FILEPATH=/app/data/sqlite.db
ENV DATABASE_URL=sqlite3://app/data/sqlite.db

RUN npm ci
RUN npm run build
RUN npm run migration:up

EXPOSE 3000
CMD ["npm", "run", "start"]
