# Step 1: Build React App
FROM node:20 AS build
WORKDIR /app
COPY . . 
RUN npm install && npm run build

# Step 2: Serve with Nginx
FROM nginx:latest
COPY nginx.config /etc/nginx/conf.d/default.conf  
# Correct path
COPY --from=build /app/build /usr/share/nginx/html  
# React build output

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
