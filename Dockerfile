# Build stage
FROM node:18 as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Runtime stage
FROM node:18-slim

WORKDIR /app
COPY --from=builder /app .

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000
CMD ["npm", "start"]
