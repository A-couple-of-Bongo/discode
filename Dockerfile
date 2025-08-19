FROM node:24.6.0-alpine3.21
WORKDIR /app
COPY . /app
RUN npm ci
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
