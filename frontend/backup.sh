#!/bin/bash

# Configuration
BACKUP_DIR="./backupzip"
PROJECT_NAME="senior-center-locator"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
VERSION=$(grep '"version":' package.json | cut -d '"' -f 4)
FILENAME="${PROJECT_NAME}_v${VERSION}_${TIMESTAMP}.zip"

# Ensure backup directory exists
mkdir -p $BACKUP_DIR

# Create backup
echo "📦 Creating backup: $FILENAME"
echo "📂 Destination: $BACKUP_DIR"

zip -r "$BACKUP_DIR/$FILENAME" . \
    -x "node_modules/*" \
    -x ".git/*" \
    -x "dist/*" \
    -x "backupzip/*" \
    -x "*.zip"

if [ $? -eq 0 ]; then
    echo "✅ Backup created successfully!"
    echo "📍 Location: $(pwd)/$BACKUP_DIR/$FILENAME"
else
    echo "❌ Backup failed."
    exit 1
fi
