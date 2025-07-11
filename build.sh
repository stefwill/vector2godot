#!/bin/bash

echo "Building Vector Drawing App for Linux..."

# Archive previous builds
echo "Archiving previous builds..."
npm run archive

# Build the web app
echo "Building web application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "Web build successful!"
    
    # Build the Electron app
    echo "Building Electron application..."
    npm run electron-build
    
    if [ $? -eq 0 ]; then
        echo "Build complete! Check the 'release' folder for your app."
        echo ""
        echo "Available files:"
        ls -la release/
        echo ""
        echo "Previous builds archived in 'archive/' folder"
    else
        echo "Electron build failed!"
        exit 1
    fi
else
    echo "Web build failed!"
    exit 1
fi
