#!/bin/bash
# Docker Build & Push Script for Amplify CISO Frontend

set -e

echo "🚀 Building Amplify Federal UI Docker Image..."

# --- 1. CONFIGURATION ---
PLATFORM="linux/amd64"
TAG="agentic-frontend-dev"
REGISTRY_HOST="us-central1-docker.pkg.dev" # Updated to match standard GCP region
PROJECT_ID="agentic-ai-amplify-federal"
REPO_NAME="poc-docker-repo"
IMAGE_NAME="agentic-frontend"
FULL_IMAGE_TAG="$REGISTRY_HOST/$PROJECT_ID/$REPO_NAME/$IMAGE_NAME:latest"
DOCKERFILE="Dockerfile"

# --- 2. AUTOMATED BUILD ARGS FROM .env ---
# This reads your local .env and converts it to --build-arg VITE_KEY=VAL
BUILD_ARGS=""
if [ -f .env ]; then
    echo "📄 Found .env file, loading build arguments..."
    # Filter for VITE_ variables specifically
    while IFS= read -r line || [ -n "$line" ]; do
        if [[ $line =~ ^VITE_ ]]; then
            BUILD_ARGS="$BUILD_ARGS --build-arg $line"
        fi
    done < .env
fi

# Parse manual command line overrides
while [[ $# -gt 0 ]]; do
    case $1 in
        --tag) TAG="$2"; shift 2 ;;
        --no-cache) NO_CACHE="--no-cache"; shift ;;
        *) echo "Unknown option: $1"; exit 1 ;;
    esac
done

# --- 3. DOCKER BUILD ---
echo "🛠️  Building image: $TAG"
docker build \
    --platform="$PLATFORM" \
    --tag="$TAG" \
    --file="$DOCKERFILE" \
    $NO_CACHE \
    $BUILD_ARGS \
    .

# --- 4. TAG & PUSH ---
echo "🏷️  Tagging for Registry..."
docker tag "$TAG" "$FULL_IMAGE_TAG"

echo "☁️  Pushing to Google Artifact Registry..."
docker push "$FULL_IMAGE_TAG"

# --- 5. LOCAL SMOKE TEST ---
echo "🔍 Running quick smoke test locally..."
# Note: Mapping 8080 to 8080 because of our new Nginx config
docker run --rm -d --name test-container -p 8080:8080 "$TAG" > /dev/null 2>&1

sleep 3 # Wait for Nginx

if curl -s -f http://localhost:8080/ > /dev/null; then
    echo "✅ Application is responding at http://localhost:8080"
else
    echo "⚠️  Application failed smoke test. Check 'docker logs test-container'"
fi

docker stop test-container > /dev/null 2>&1

echo "🏁 Deployment process complete!"
echo "📍 Registry: $FULL_IMAGE_TAG"