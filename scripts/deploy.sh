#!/bin/bash
set -euo pipefail

# og-image.org Deployment Script
# Usage: ./scripts/deploy.sh [environment]
# Environments: preview (default), production

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default environment
ENVIRONMENT="${1:-preview}"

log_info() {
  echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
  echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
  echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
  echo -e "${RED}[ERROR]${NC} $1"
}

# Check required tools
check_dependencies() {
  log_info "Checking dependencies..."

  local missing=()

  if ! command -v node &> /dev/null; then
    missing+=("node")
  fi

  if ! command -v npm &> /dev/null; then
    missing+=("npm")
  fi

  if ! command -v wrangler &> /dev/null; then
    log_warning "wrangler not found globally, will use npx"
  fi

  if [ ${#missing[@]} -ne 0 ]; then
    log_error "Missing required tools: ${missing[*]}"
    exit 1
  fi

  log_success "All dependencies available"
}

# Validate environment
validate_environment() {
  if [[ "$ENVIRONMENT" != "preview" && "$ENVIRONMENT" != "production" ]]; then
    log_error "Invalid environment: $ENVIRONMENT"
    log_info "Valid environments: preview, production"
    exit 1
  fi

  log_info "Deploying to: $ENVIRONMENT"
}

# Install dependencies
install_deps() {
  log_info "Installing dependencies..."
  cd "$PROJECT_ROOT"

  if [ -f "package-lock.json" ]; then
    npm ci --silent
  else
    npm install --silent
  fi

  log_success "Dependencies installed"
}

# Run linting
run_lint() {
  log_info "Running linter..."
  cd "$PROJECT_ROOT"

  if npm run lint --silent 2>/dev/null; then
    log_success "Linting passed"
  else
    log_warning "Linting had issues (continuing anyway)"
  fi
}

# Run tests
run_tests() {
  log_info "Running tests..."
  cd "$PROJECT_ROOT"

  if npm run test --silent 2>/dev/null; then
    log_success "All tests passed"
  else
    log_error "Tests failed"
    exit 1
  fi
}

# Build the project
build_project() {
  log_info "Building project..."
  cd "$PROJECT_ROOT"

  # Clean previous build
  rm -rf out .next

  # Run build
  npm run build

  if [ ! -d "out" ]; then
    log_error "Build failed - 'out' directory not created"
    exit 1
  fi

  log_success "Build completed"
}

# Verify build output
verify_build() {
  log_info "Verifying build output..."
  cd "$PROJECT_ROOT"

  local required_files=(
    "out/index.html"
    "out/resvg.wasm"
    "out/fonts/Inter-Bold.ttf"
    "out/_headers"
    "out/sitemap.xml"
    "out/robots.txt"
  )

  local missing=()

  for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
      missing+=("$file")
    fi
  done

  if [ ${#missing[@]} -ne 0 ]; then
    log_error "Missing required files in build output:"
    for file in "${missing[@]}"; do
      echo "  - $file"
    done
    exit 1
  fi

  # Check build size
  local build_size
  build_size=$(du -sh out | cut -f1)
  log_info "Build size: $build_size"

  log_success "Build verification passed"
}

# Deploy to Cloudflare Pages
deploy_cloudflare() {
  log_info "Deploying to Cloudflare Pages ($ENVIRONMENT)..."
  cd "$PROJECT_ROOT"

  local deploy_cmd="npx wrangler pages deploy out --project-name=og-image"

  if [ "$ENVIRONMENT" == "production" ]; then
    deploy_cmd="$deploy_cmd --branch=main"
  else
    deploy_cmd="$deploy_cmd --branch=preview"
  fi

  if $deploy_cmd; then
    log_success "Deployment completed"
  else
    log_error "Deployment failed"
    exit 1
  fi
}

# Post-deployment checks
post_deploy_checks() {
  log_info "Running post-deployment checks..."

  local base_url
  if [ "$ENVIRONMENT" == "production" ]; then
    base_url="https://og-image.org"
  else
    base_url="https://preview.og-image.org"
  fi

  # Check if site is accessible
  local http_code
  http_code=$(curl -s -o /dev/null -w "%{http_code}" "$base_url" || echo "000")

  if [ "$http_code" == "200" ]; then
    log_success "Site is accessible at $base_url"
  else
    log_warning "Site returned HTTP $http_code (may need time to propagate)"
  fi

  # Check WASM file
  http_code=$(curl -s -o /dev/null -w "%{http_code}" "$base_url/resvg.wasm" || echo "000")
  if [ "$http_code" == "200" ]; then
    log_success "WASM file is accessible"
  else
    log_warning "WASM file returned HTTP $http_code"
  fi
}

# Print summary
print_summary() {
  echo ""
  echo "=========================================="
  echo -e "${GREEN}Deployment Summary${NC}"
  echo "=========================================="
  echo "Environment: $ENVIRONMENT"
  echo "Project: og-image.org"

  if [ "$ENVIRONMENT" == "production" ]; then
    echo "URL: https://og-image.org"
  else
    echo "URL: https://preview.og-image.org"
  fi

  echo "=========================================="
}

# Main execution
main() {
  echo ""
  echo "=========================================="
  echo "  og-image.org Deployment"
  echo "=========================================="
  echo ""

  validate_environment
  check_dependencies
  install_deps
  run_lint
  run_tests
  build_project
  verify_build
  deploy_cloudflare
  post_deploy_checks
  print_summary

  log_success "Deployment complete!"
}

# Run main function
main
