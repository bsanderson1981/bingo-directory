#!/bin/bash

# sync_work.sh
# Usage: 
#   ./sync_work.sh start   (Run this when you sit down to work)
#   ./sync_work.sh end     (Run this when you are finished)

COMMAND=$1
COMMIT_MSG="$2"

# Ensure we are in the project root
cd "$(dirname "$0")"

if [ "$COMMAND" == "start" ]; then
    echo "🔄 [START] Pulling latest changes from GitHub..."
    git pull
    
    echo "---------------------------------------------------"
    echo "✅ Ready to work!"
    echo "   - If you need to run the app locally:"
    echo "     cd frontend && npm run dev"
    echo "   - If you need to rebuild the Docker container:"
    echo "     cd frontend && ./proddeploy.sh"
    echo "---------------------------------------------------"

elif [ "$COMMAND" == "end" ]; then
    echo "💾 [END] Saving work to GitHub..."
    
    # Check for uncommitted changes
    if [ -z "$(git status --porcelain)" ]; then 
        echo "✨ No changes to save."
    else
        # Default commit message if none provided
        if [ -z "$COMMIT_MSG" ]; then
            COMMIT_MSG="WIP: Routine work session sync"
        fi
        
        git add .
        git commit -m "$COMMIT_MSG"
        git push
        echo "✅ All changes pushed to GitHub."
    fi
    
    echo "---------------------------------------------------"
    echo "🔒 Safe to switch laptops."
    echo "---------------------------------------------------"

else
    echo "❌ Unknown command."
    echo "Usage:"
    echo "  ./sync_work.sh start       -> Pulls latest code"
    echo "  ./sync_work.sh end [msg]   -> Commits and pushes code"
fi
