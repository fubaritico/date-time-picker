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

# Generate changelog
log "Generating changelog..." "$YELLOW"
pnpm exec conventional-changelog -p angular -i CHANGELOG.md -s
check_status "Changelog generation"

# Add changelog to git
git add CHANGELOG.md
git commit --amend -m "chore: update changelog" --no-verify
check_status "Changelog commit"
