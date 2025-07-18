#!/bin/bash

# Make the script executable in MacOS: chmod +x publish.sh

# You have to be logged in to npm before running this script.
# You have to create a scope in you npm account first.
# run:  pnpm login --scope=@your-scope-name

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Set default version type to patch if not provided
VERSION_TYPE="${1:-patch}"

# Validate version type argument
if [[ ! "$VERSION_TYPE" =~ ^(patch|minor|major)$ ]]; then
    echo -e "\033[0;31mError: Invalid version type. Must be one of: patch, minor, major\033[0m"
    exit 1
fi

# Function to log messages
log() {
    echo -e "${2:-$GREEN}$1${NC}"
}

# Function to check if command was successful
check_status() {
    if [ $? -eq 0 ]; then
        log "✓ $1 completed successfully"
    else
        log "✗ $1 failed" "$RED"
        exit 1
    fi
}

# Load environment variables from .env file
if [ -f .env ]; then
    log "Loading environment variables from .env file..." "$YELLOW"
    export $(cat .env | grep -v '^#' | xargs)
else
    log ".env file not found. Please create one from .env.example" "$RED"
    exit 1
fi

# Check for NPM_TOKEN
if [ -z "$NPM_TOKEN" ]; then
    log "NPM_TOKEN is not set in .env file" "$RED"
    log "Please add your NPM_TOKEN to the .env file" "$YELLOW"
    log "You can generate a token at https://www.npmjs.com/settings/tokens" "$YELLOW"
    exit 1
fi

# Check git tags configuration
log "Configuring git..." "$YELLOW"
git config --local version.commitTag true
git config --local tag.gpgSign false
git config --local version.tagName "v%s"
check_status "Git configuration"

# Create or update .npmrc file with the token
log "Configuring npm authentication..." "$YELLOW"
cat > .npmrc << EOL
//registry.npmjs.org/:_authToken=${NPM_TOKEN}
registry=https://registry.npmjs.org/
always-auth=true

# pnpm specific settings
strict-peer-dependencies=false
auto-install-peers=true
resolution-mode=highest
strict-peer-dependencies=false
public-hoist-pattern[]=@storybook/*
EOL
check_status "NPM authentication configuration"

# Build and publish
log "Building and publishing package..." "$YELLOW"
pnpm prerelease
check_status "Build"

log "Creating new version..." "$YELLOW"
pnpm version "$VERSION_TYPE"
check_status "Version bump"

# Generate changelog
log "Generating changelog..." "$YELLOW"
pnpm exec conventional-changelog -p angular -i CHANGELOG.md -s -r 0
check_status "Changelog generation"

# Add changelog to git
git add CHANGELOG.md
git commit -m "docs: update changelog for version bump" --no-verify
check_status "Changelog commit"

pnpm publish --no-git-checks
check_status "Publish"

CURRENT_VERSION=$(node -p "require('./package.json').version")
log "Ensuring tag v${CURRENT_VERSION} exists..." "$YELLOW"
git tag -a "v${CURRENT_VERSION}" -m "Version ${CURRENT_VERSION}" || true
check_status "Tag creation"

log "Pushing new version to repository..." "$YELLOW"
git push origin main --force && git push origin --tags --force
check_status "Git push"

# Clean up - remove .npmrc file and unset environment variables
log "Cleaning up..." "$YELLOW"
rm -f .npmrc
unset NPM_TOKEN
check_status "Cleanup"

log "🎉 Package published successfully!" "$GREEN"
