FROM node:18-slim

WORKDIR /app

# Install build dependencies for native modules
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

# Clean install and rebuild all native modules
RUN rm -rf node_modules package-lock.json && \
    npm cache clean --force && \
    npm install --production && \
    npm rebuild

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
