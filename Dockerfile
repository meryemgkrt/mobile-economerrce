# Multi-stage build for mobile e-commerce application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY admin/package*.json ./admin/

# Install dependencies
RUN npm ci
RUN cd backend && npm ci
RUN cd admin && npm ci

# Copy source code
COPY backend ./backend
COPY admin ./admin

# Build admin panel
RUN cd admin && npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy backend package files and install production dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm ci --only=production

# Copy backend source and built admin panel
COPY backend ./backend
COPY --from=builder /app/admin/dist ./admin/dist

# Set working directory to backend
WORKDIR /app/backend

# Expose port
EXPOSE 10000

# Start the server
CMD ["node", "src/server.js"]
