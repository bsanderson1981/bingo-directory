# Stage 1: Build the application
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files first to leverage caching
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .
RUN npm run build

# Stage 2: Serve the application
FROM nginx:alpine

# Copy built assets from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
