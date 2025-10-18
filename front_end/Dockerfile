# Use Node 22 (Vite compatible)
FROM node:22-alpine

# Work directory
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies safely
# 1. Add Python and build tools to prevent esbuild errors
# 2. Run npm install with temporary directory workaround
RUN apk add --no-cache python3 make g++ \
  && npm install --no-fund --legacy-peer-deps || npm rebuild esbuild

# Copy source files after dependencies
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Default command
CMD ["npm", "run", "dev"]
