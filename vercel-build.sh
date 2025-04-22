#!/bin/bash
# Vercel build script with better error handling

echo "Starting build process..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Create .env file if needed
if [ ! -f .env ]; then
  echo "Creating .env file..."
  echo "VITE_APP_TITLE=Barefoot Reset" > .env
fi

# Build the application with detailed error logging
echo "Building application..."
npm run build || {
  echo "Build failed! Checking for common issues..."
  
  # Output Node.js and npm versions
  echo "Node version: $(node -v)"
  echo "NPM version: $(npm -v)"
  
  # Check for common error patterns in build logs
  if grep -q "undefined has no properties" npm-debug.log 2>/dev/null; then
    echo "⚠️ Found 'undefined has no properties' error in logs"
  fi
  
  echo "Build failed. See above logs for details."
  exit 1
}

echo "Build completed successfully!"
exit 0
