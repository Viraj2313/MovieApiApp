# Use Node.js as the base image for building the project
FROM node:18 AS builder

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the Vite project
RUN npm run build

# Use Nginx as the base image to serve the app
FROM nginx:alpine

# Set working directory inside the container
WORKDIR /usr/share/nginx/html

# Remove default Nginx static assets
RUN rm -rf ./*

# Copy build output from the previous stage
COPY --from=builder /app/build .

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/nginx.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
