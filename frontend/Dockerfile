# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all other files
COPY . .

# Expose Vite's default port
EXPOSE 5176

# Start the dev server
CMD ["npm", "run", "dev"]