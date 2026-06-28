# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_HOTEL_API=/hotel-api
ARG VITE_BOOKING_API=/booking-api
ARG VITE_NOTIFICATION_API=/notification-api

ENV VITE_HOTEL_API=$VITE_HOTEL_API
ENV VITE_BOOKING_API=$VITE_BOOKING_API
ENV VITE_NOTIFICATION_API=$VITE_NOTIFICATION_API

RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
