# Use the official lightweight Node.js 18 image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Expose the API port
EXPOSE 3000

# Start the application using the start script
CMD ["npm", "start"]
