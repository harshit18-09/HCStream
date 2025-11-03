FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

ARG CORS_ORIGIN
ENV CORS_ORIGIN=$CORS_ORIGIN

EXPOSE 8000

# Start the server
CMD ["npm", "start"]
