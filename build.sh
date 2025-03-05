#!/bin/bash

# Exit on error
set -e

echo "Starting build process..."
echo "Current directory: $(pwd)"
echo "Directory contents:"
ls -la

# Install root dependencies
echo "Installing root dependencies..."
npm install

# Build frontend
echo "Building frontend..."
cd frontend
echo "Frontend directory: $(pwd)"
echo "Frontend contents:"
ls -la
npm install
echo "Running frontend build..."
npm run build
echo "Frontend build completed"
echo "Frontend dist contents:"
ls -la dist || echo "dist directory not found"

# Create backend public directory and copy files
echo "Setting up backend..."
cd ../backend
echo "Backend directory: $(pwd)"
echo "Backend contents:"
ls -la
npm install

# Create public directory
echo "Creating public directory..."
rm -rf public
mkdir -p public

# Copy frontend build files
echo "Copying frontend build files..."
cp -r ../frontend/dist/* public/

# Verify the build
echo "Verifying build..."
echo "Public directory contents:"
ls -la public
echo "Checking for index.html..."
ls -la public/index.html || echo "index.html not found in public directory"

echo "Build completed successfully!" 