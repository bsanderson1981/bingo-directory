
# M4 MacBook Setup Guide

Follow these steps to mirror your M1 setup to your M4.

## 1. Create Folder & Clone
Open your Terminal on the M4.

```bash
# Create a Development folder (if you haven't)
mkdir -p ~/Development/antigravity
cd ~/Development/antigravity

# Clone the repository
git clone https://github.com/bsanderson1981/senior-center-locator.git
```

## 2. Docker Setup (Local)
We use the existing `proddeploy.sh` script to run the app in Docker.

```bash
# Go to the frontend directory
cd senior-center-locator/frontend

# Make the script executable
chmod +x proddeploy.sh

# Run the app (Builds image + Starts container on Port 8080)
./proddeploy.sh
```

**Verify:** Open `http://localhost:8080` in your browser.

## 3. Sync "Antigravity Brain"
I have pushed your current task list to the repository.

1.  On M4, make sure you have pulled the latest code:
    ```bash
    git pull
    ```
2.  Tell the M4 Antigravity:
    *"I have a `docs/task.md` file. Please use that as my main task list."*

Now both laptops are in sync!
