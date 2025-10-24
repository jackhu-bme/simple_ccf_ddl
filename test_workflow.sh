#!/bin/bash
# Test script to simulate GitHub Actions workflow
# This simulates the workflow steps without actually pushing to GitHub

set -e  # Exit on error

echo "========================================="
echo "Testing Workflow Steps Locally"
echo "========================================="
echo ""

# Store current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "📍 Current branch: $CURRENT_BRANCH"
echo ""

# Step 1: Clone source repository
echo "📥 Step 1: Cloning source repository..."
if [ -d "temp_source" ]; then
    rm -rf temp_source
fi
git clone --depth 1 https://github.com/ccfddl/ccf-deadlines.git temp_source
echo "✅ Source repository cloned"
echo ""

# Step 2: Update conference files
echo "📝 Step 2: Updating conference files..."
cp temp_source/conference/AI/cvpr.yml conference/
cp temp_source/conference/AI/iccv.yml conference/
cp temp_source/conference/AI/eccv.yml conference/
cp temp_source/conference/AI/nips.yml conference/
cp temp_source/conference/AI/icml.yml conference/
cp temp_source/conference/AI/iclr.yml conference/
cp temp_source/conference/AI/aaai.yml conference/
cp temp_source/conference/AI/ijcai.yml conference/
cp temp_source/conference/MX/miccai.yml conference/
echo "✅ Conference files updated"
echo ""

# Clean up
rm -rf temp_source
echo "🧹 Cleaned up temporary files"
echo ""

# Step 3: Check for changes
echo "🔍 Step 3: Checking for changes..."
git add conference/
if git diff --staged --quiet; then
    echo "ℹ️  No changes detected - workflow would exit here"
    echo "✅ Test completed successfully (no changes to commit)"
    git reset HEAD conference/
    exit 0
else
    echo "✅ Changes detected!"
    echo ""
    echo "📊 Changed files:"
    git diff --staged --name-only
    echo ""
    echo "📝 Changes summary:"
    git diff --staged --stat
    echo ""

    # Show what would be committed (but don't actually commit)
    echo "========================================="
    echo "⚠️  DRY RUN - Not actually committing"
    echo "========================================="
    echo ""
    echo "If this were the real workflow, it would:"
    echo "1. Commit with message: 'chore: update conference deadlines [automated]'"
    echo "2. Push to GitHub"
    echo ""

    # Reset the staged changes
    git reset HEAD conference/
    echo "✅ Test completed successfully (changes detected but not committed)"
    echo ""
    echo "To actually commit these changes, run:"
    echo "  git add conference/"
    echo "  git commit -m 'chore: update conference deadlines [manual test]'"
    echo "  git push"
fi
