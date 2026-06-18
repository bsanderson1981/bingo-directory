#!/bin/bash

# Define variables
CONTAINER_NAME="bingodirectoryapp"
IMAGE_NAME="bingo-frontend-app"
PORT="8080:80"

echo "🔄 [PRODUCTION] Redeploying $CONTAINER_NAME on port 80..."

# 1. Stop the container if it's running
if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
    echo "🛑 Stopping running container..."
    docker stop $CONTAINER_NAME
fi

# 2. Remove the container (stopped or running)
if [ "$(docker ps -aq -f name=$CONTAINER_NAME)" ]; then
    echo "🗑️  Removing old container..."
    docker rm $CONTAINER_NAME
fi

# 3. Rebuild the image
echo "🔨 Building Docker image..."
docker build --no-cache --progress=plain -t $IMAGE_NAME .

# Check if build succeeded
if [ $? -eq 0 ]; then
    # 4. Run the new container
    echo "🚀 Starting new container..."
    docker run -d --name $CONTAINER_NAME --restart unless-stopped -p $PORT $IMAGE_NAME
    
    if [ $? -eq 0 ]; then
        echo "✅ Success! App is running at http://localhost:8080 (Port 8080)"
    else
        echo "❌ Failed to start container. Port 80 might be in use."
    fi
else
    echo "❌ Build failed. Please check the errors above."
fi
