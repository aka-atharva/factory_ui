#!/bin/bash

# Build the Next.js app
echo "Building Next.js app..."
npm run build

# Create static directory if it doesn't exist
mkdir -p api/static

# Copy the built files to the static directory
echo "Copying built files to api/static..."
xcopy /E /I out\* api\static\

echo "Deployment preparation complete!"
echo "Run 'cd api && python main.py' to start the server."

