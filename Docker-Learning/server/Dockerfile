# Use Node.js LTS version
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Create db directory if it doesn't exist
RUN mkdir -p db

# Expose port
EXPOSE 5000

# Start the application
CMD ["npm", "start"]