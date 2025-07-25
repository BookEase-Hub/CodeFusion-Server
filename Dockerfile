# Build stage
FROM node:18 as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Runtime stage
FROM node:18-slim

WORKDIR /app
COPY --from=builder /app .

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000
CMD ["node", "server.js"]
