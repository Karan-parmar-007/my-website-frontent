# -------------------------------
# Stage 1: Build frontend (GitHub Actions)
# -------------------------------
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# -------------------------------
# Stage 2: Serve static files with Nginx + dynamic env
# -------------------------------
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy base nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 👇 Add entrypoint script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80
ENTRYPOINT ["/docker-entrypoint.sh"]
