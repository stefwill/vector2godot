#!/bin/bash

# Vector2Godot Migration Script
# This script helps migrate from the monolithic to modular architecture

echo "🚀 Vector2Godot Modular Migration Script"
echo "========================================"
echo

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: This script must be run from the Vector2Godot root directory"
    exit 1
fi

# Check if the new modular files exist
if [ ! -f "main-new.js" ] || [ ! -d "src" ]; then
    echo "❌ Error: Modular files not found. Please ensure all new files are present."
    exit 1
fi

echo "📋 Migration Steps:"
echo "1. Backup current main.js"
echo "2. Update index.html to use new entry point"
echo "3. Test the new modular version"
echo

# Ask for confirmation
read -p "🤔 Do you want to proceed with the migration? (y/N): " confirm

if [[ $confirm != [yY] && $confirm != [yY][eE][sS] ]]; then
    echo "❌ Migration cancelled."
    exit 0
fi

echo
echo "🔄 Starting migration..."

# Step 1: Backup main.js
echo "📦 Creating backup of main.js..."
cp main.js main-original.js
echo "✅ Backup created: main-original.js"

# Step 2: Update index.html
echo "🔧 Updating index.html..."
if [ -f "index.html" ]; then
    # Check if we need to update the script tag
    if grep -q 'src="/main.js"' index.html; then
        # Create backup of index.html
        cp index.html index-original.html
        
        # Replace the script tag
        sed -i 's|src="/main.js"|src="/main-new.js"|g' index.html
        echo "✅ Updated script tag in index.html"
        echo "📦 Backup created: index-original.html"
    else
        echo "⚠️  Warning: Could not find main.js reference in index.html"
        echo "   Please manually update the script tag to use '/main-new.js'"
    fi
else
    echo "⚠️  Warning: index.html not found"
fi

# Step 3: Update vite.config.js if it exists
if [ -f "vite.config.js" ]; then
    echo "🔧 Checking vite.config.js..."
    if grep -q "main.js" vite.config.js; then
        echo "⚠️  Warning: vite.config.js may need manual updates"
        echo "   Please check if any references to main.js need to be updated"
    fi
fi

echo
echo "✅ Migration completed successfully!"
echo
echo "📋 What was changed:"
echo "   • main.js → main-original.js (backup)"
echo "   • index.html updated to use main-new.js"
echo "   • index.html → index-original.html (backup)"
echo
echo "🧪 Testing the new version:"
echo "   Run: npm run dev"
echo "   The application should work exactly the same as before"
echo
echo "🔄 To rollback if needed:"
echo "   1. cp main-original.js main.js"
echo "   2. cp index-original.html index.html"
echo
echo "📚 For more information, see MODULAR_ARCHITECTURE.md"
echo
echo "🎉 Happy coding with the new modular Vector2Godot!"
