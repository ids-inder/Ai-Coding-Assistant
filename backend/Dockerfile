FROM node:18-slim

WORKDIR /app

# Install build dependencies for native modules
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

# Install dependencies and rebuild native modules from source
RUN npm install --production --build-from-source

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
