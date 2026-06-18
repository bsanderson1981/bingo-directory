#!/bin/bash

# Navigate to the directory where this script is located
cd "$(dirname "$0")" || exit

# Pull the latest changes from GitHub
echo "Pulling latest changes from git..."
git pull origin main

# Run the production deployment script
echo "Running production deployment..."
./proddeploy.sh
