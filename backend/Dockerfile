# Stage 1: base image
FROM node:20-alpine

# Set working directory dalam container
WORKDIR /usr/src/app

# Copy package file dulu (supaya cache build lebih efektif)
COPY package*.json ./

# Install dependencies production
RUN npm ci --omit=dev

# Copy seluruh source code
COPY . .

# Set NODE_ENV
ENV NODE_ENV=production

# Port yang akan didengarkan server.js
ENV PORT=8080
EXPOSE 8080

# Jalankan server
CMD ["npm", "start"]
