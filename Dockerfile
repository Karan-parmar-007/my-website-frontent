# Stage 1: Build React app
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . .

ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build

# Stage 2: Minimal final image (optional, you can skip this and mount dist)
FROM alpine:3.18
WORKDIR /build
COPY --from=builder /app/dist .
