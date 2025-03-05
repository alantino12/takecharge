#!/bin/bash

echo "Starting build process..."

# Install frontend dependencies and build
echo "Building frontend..."
cd frontend
npm install
npm run build

# Install backend dependencies
echo "Building backend..."
cd ../backend
npm install

# Create public directory and copy frontend build
echo "Copying frontend build..."
mkdir -p public
cp -r ../frontend/dist/* public/

# List contents to verify
echo "Verifying build..."
ls -la public/

echo "Build complete!" 