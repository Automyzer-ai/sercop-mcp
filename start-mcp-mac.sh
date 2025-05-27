#!/bin/bash
# Bash script to build and start the MCP server on Mac

echo "Starting MCP Server Setup..."

# Step 0: Check for Node.js
if ! command -v node &> /dev/null
then
    echo "Node.js is not installed."
    echo "You can install it with Homebrew (recommended):"
    echo "    brew install node"
    echo "Or download from: https://nodejs.org/en/download/"
    exit 1
fi

# Step 1: Install dependencies
echo "Installing dependencies (this may take a while)..."
npm install
if [ $? -ne 0 ]; then
    echo "Dependency installation failed. Please check for errors above."
    exit 1
fi

# Step 2: Build the project
echo "Building the MCP server..."
npm run build
if [ $? -ne 0 ]; then
    echo "Build failed. Please check for errors above."
    exit 1
fi

# Step 3: Start the server
echo "Starting the MCP server..."
npm start
if [ $? -ne 0 ]; then
    echo "Failed to start the MCP server. Please check for errors above."
    exit 1
fi
