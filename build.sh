#!/bin/bash

echo "Starting build process..."
echo "Current directory: $(pwd)"
echo "Directory contents:"
ls -la

echo "Installing root dependencies..."
npm install

echo "Building frontend..."
cd frontend
echo "Frontend directory: $(pwd)"
echo "Frontend contents:"
ls -la
npm install
npm run build

echo "Installing backend dependencies..."
cd ../backend
echo "Backend directory: $(pwd)"
echo "Backend contents:"
ls -la
npm install

echo "Creating public directory..."
mkdir -p public

echo "Copying frontend build files..."
cp -r ../frontend/dist/* public/

echo "Build completed successfully"
echo "Public directory contents:"
ls -la public 