# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build TypeScript (if needed)
RUN npx tsc

# Expose API port
EXPOSE 3001

# Start the API
CMD ["npm", "run", "start"]
