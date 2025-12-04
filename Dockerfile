# Stage 1: Build the NestJS app
FROM node:20-alpine AS builder

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the source code
COPY . .

# Build the NestJS project
RUN npm run build

# Stage 2: Run the app
FROM node:20-alpine

WORKDIR /app

# Copy built app from builder
COPY --from=builder /app/dist ./dist
COPY package*.json ./

# Only install production dependencies
RUN npm install --only=production --legacy-peer-deps

# Expose port
EXPOSE 3004

# Run NestJS
CMD ["node", "dist/main.js"]

#docker network create \
#  --driver bridge \
#  --subnet 172.19.0.0/16 \
#  nginx_nginx_report_custom_net

#RUN docker build -t authentication-api:latest .
