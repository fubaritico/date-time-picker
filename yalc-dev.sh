#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

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

# Build and publish to yalc
publish_yalc() {
    log "Building package..." "$YELLOW"
    pnpm build
    check_status "Build"

    log "Publishing to yalc..." "$YELLOW"
    yalc publish
    check_status "Yalc publish"

    log "🎉 Package published to yalc successfully!" "$GREEN"
    log "To use in another project, run: yalc add $(node -p "require('./package.json').name")" "$YELLOW"
}

# Watch for changes and publish to yalc
watch_yalc() {
    log "Starting watch mode..." "$YELLOW"
    log "Will rebuild and publish to yalc when files change" "$YELLOW"

    # Use nodemon to watch for changes
    pnpm add -D nodemon

    # Start nodemon to watch your src directory
    nodemon --watch src \
            --ext ts,tsx,js,jsx,css,scss \
            --exec "pnpm build && yalc publish --push" \
            --ignore "dist/" \
            --ignore "node_modules/"
}

# Push updates to all linked projects
push_yalc() {
    log "Pushing updates to linked projects..." "$YELLOW"
    yalc push
    check_status "Yalc push"
}

# Remove package from yalc
remove_yalc() {
    log "Removing package from yalc..." "$YELLOW"
    yalc remove --all
    check_status "Yalc remove"
}

case "$1" in
    "publish")
        publish_yalc
        ;;
    "watch")
        watch_yalc
        ;;
    "push")
        push_yalc
        ;;
    "remove")
        remove_yalc
        ;;
    *)
        log "Usage: $0 {publish|watch|push|remove}" "$YELLOW"
        log "  publish - Build and publish package to yalc" "$YELLOW"
        log "  watch   - Watch for changes and auto-publish" "$YELLOW"
        log "  push    - Push updates to linked projects" "$YELLOW"
        log "  remove  - Remove package from yalc" "$YELLOW"
        exit 1
        ;;
esac
