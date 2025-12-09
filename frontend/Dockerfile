# Stage 1: build React app
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files dan install dependencies
COPY package*.json ./
RUN npm ci

# Copy seluruh source code
COPY . .

# Build React app (akan pakai .env.production saat NODE_ENV=production)
ENV NODE_ENV=production
RUN npm run build

# Stage 2: serve dengan Nginx
FROM nginx:alpine

# Hapus default config nginx dan bisa custom kalau mau
# COPY nginx.conf /etc/nginx/conf.d/default.conf  (optional, kalau perlu custom)

# Copy hasil build React ke html root
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
