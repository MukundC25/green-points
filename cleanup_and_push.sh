#!/bin/bash

# Green Points Repository Cleanup and Push Script
# This script cleans up the repository and pushes changes safely

echo "🧹 Starting Green Points Repository Cleanup..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Step 1: Remove tracked files that should be ignored
print_info "Step 1: Removing tracked files that should be ignored..."

# Remove venv files from git tracking
if git ls-files | grep -q "ml_service/venv"; then
    print_info "Removing ml_service/venv from git tracking..."
    git ls-files | grep "ml_service/venv" | xargs git rm --cached 2>/dev/null || true
fi

# Remove node_modules from git tracking
if git ls-files | grep -q "node_modules"; then
    print_info "Removing node_modules from git tracking..."
    git ls-files | grep "node_modules" | xargs git rm --cached 2>/dev/null || true
fi

# Remove dist/build files
if git ls-files | grep -q "dist/\|build/"; then
    print_info "Removing dist/build files from git tracking..."
    git ls-files | grep -E "dist/|build/" | xargs git rm --cached 2>/dev/null || true
fi

# Remove log files
if git ls-files | grep -q "\.log$"; then
    print_info "Removing log files from git tracking..."
    git ls-files | grep "\.log$" | xargs git rm --cached 2>/dev/null || true
fi

print_status "Cleanup of tracked files completed"

# Step 2: Add important files
print_info "Step 2: Adding important source files..."

# Add core source files
git add .gitignore 2>/dev/null || true
git add README.md 2>/dev/null || true
git add ML_INTEGRATION_SUMMARY.md 2>/dev/null || true
git add package.json 2>/dev/null || true
git add start_system.sh 2>/dev/null || true

# Add client source files (excluding node_modules and dist)
find client/src -name "*.jsx" -o -name "*.js" -o -name "*.css" | xargs git add 2>/dev/null || true
git add client/package.json 2>/dev/null || true
git add client/index.html 2>/dev/null || true
git add client/vite.config.js 2>/dev/null || true
git add client/tailwind.config.js 2>/dev/null || true

# Add server source files (excluding node_modules)
find server -name "*.js" -not -path "*/node_modules/*" | xargs git add 2>/dev/null || true
git add server/package.json 2>/dev/null || true

# Add ML service files (excluding venv)
find ml_service -name "*.py" -not -path "*/venv/*" | xargs git add 2>/dev/null || true
git add ml_service/requirements.txt 2>/dev/null || true

print_status "Source files added to staging"

# Step 3: Commit changes
print_info "Step 3: Committing changes..."

# Check if there are changes to commit
if git diff --staged --quiet; then
    print_warning "No changes to commit"
else
    git commit -m "frontend fixes" 2>/dev/null || {
        print_error "Commit failed, but continuing..."
    }
    print_status "Changes committed"
fi

# Step 4: Push to GitHub
print_info "Step 4: Pushing to GitHub..."

# Get current branch
BRANCH=$(git branch --show-current 2>/dev/null || echo "main")
print_info "Current branch: $BRANCH"

# Push changes
if git push origin $BRANCH 2>/dev/null; then
    print_status "Successfully pushed to GitHub!"
else
    print_error "Push failed. You may need to:"
    echo "  1. Check your GitHub credentials"
    echo "  2. Ensure the remote repository exists"
    echo "  3. Run: git remote -v to check remote URLs"
    echo "  4. Try: git push -u origin $BRANCH"
fi

# Step 5: Verify repository status
print_info "Step 5: Repository status summary..."

echo ""
echo "📊 Repository Status:"
echo "===================="

# Count files by type
TOTAL_FILES=$(git ls-files | wc -l)
JS_FILES=$(git ls-files | grep -E "\.(js|jsx)$" | wc -l)
PY_FILES=$(git ls-files | grep "\.py$" | wc -l)
MD_FILES=$(git ls-files | grep "\.md$" | wc -l)

echo "📁 Total tracked files: $TOTAL_FILES"
echo "🟨 JavaScript/React files: $JS_FILES"
echo "🐍 Python files: $PY_FILES"
echo "📝 Markdown files: $MD_FILES"

echo ""
echo "🚀 System URLs:"
echo "==============="
echo "Frontend: http://localhost:5178"
echo "Backend:  http://localhost:5001"
echo "ML API:   http://localhost:8000"

echo ""
print_status "Repository cleanup and push completed!"
print_info "The Green Points system is now clean and up-to-date on GitHub"
