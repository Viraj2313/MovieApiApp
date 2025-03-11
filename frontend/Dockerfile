# Stage 1: Build the React app with Node.js
FROM node:18 AS builder

WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

RUN npm install

# Copy the rest of the application files
COPY . .

# Build the React app
RUN npm run build

# Stage 2: Serve the app using Caddy
FROM caddy:2

# Set the working directory for Caddy
WORKDIR /usr/share/caddy

# Copy the built React app from the previous stage
COPY --from=builder /app/build /usr/share/caddy

# Copy the Caddyfile into the container
COPY Caddyfile /etc/caddy/Caddyfile

# Expose HTTP and HTTPS ports
EXPOSE 80 443

# Start Caddy
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile"]
