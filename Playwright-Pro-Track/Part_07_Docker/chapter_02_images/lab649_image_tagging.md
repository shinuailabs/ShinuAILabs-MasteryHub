# Lab 649: Image Tagging Strategies

## LEARNING CONCEPT

Effective image tagging for version management.

### Tagging Strategies:
- Semantic versioning
- Git commit hash
- Build number
- Environment tags

## EXERCISE

1. Implement tagging strategy
2. Manage multiple tags
3. Automate tagging

## SOLUTION

### Basic Tagging

```bash
# Tag during build
docker build -t my-app:v1.0.0 .

# Tag existing image
docker tag my-app:latest my-app:v1.0.0

# Multiple tags
docker tag my-app:latest my-app:v1.0.0
docker tag my-app:latest my-app:v1.0
docker tag my-app:latest my-app:v1
```

### Semantic Versioning

```bash
# Major.Minor.Patch
docker build -t my-app:1.2.3 .

# Also tag with less specific versions
docker tag my-app:1.2.3 my-app:1.2
docker tag my-app:1.2.3 my-app:1
docker tag my-app:1.2.3 my-app:latest

# Users can choose specificity:
# my-app:1.2.3  - Exact version
# my-app:1.2    - Latest patch of 1.2
# my-app:1      - Latest minor of 1.x
# my-app:latest - Latest version
```

### Git-Based Tagging

```bash
# Tag with git commit hash
GIT_HASH=$(git rev-parse --short HEAD)
docker build -t my-app:$GIT_HASH .

# Tag with git tag
GIT_TAG=$(git describe --tags --always)
docker build -t my-app:$GIT_TAG .

# Tag with branch name
BRANCH=$(git rev-parse --abbrev-ref HEAD)
docker build -t my-app:$BRANCH .
```

### CI/CD Tagging

```bash
# Build number
docker build -t my-app:build-${BUILD_NUMBER} .

# Timestamp
TIMESTAMP=$(date +%Y%m%d%H%M%S)
docker build -t my-app:$TIMESTAMP .

# Combined
docker build -t my-app:${VERSION}-${BUILD_NUMBER}-${GIT_HASH} .
```

### Environment Tags

```bash
# Environment-specific tags
docker tag my-app:v1.0.0 my-app:dev
docker tag my-app:v1.0.0 my-app:staging
docker tag my-app:v1.0.0 my-app:production

# Promote through environments
docker tag my-app:staging my-app:production
```

### Automated Tagging Script

```bash
#!/bin/bash
# build-and-tag.sh

IMAGE_NAME="my-app"
VERSION=${1:-"latest"}
GIT_HASH=$(git rev-parse --short HEAD)
TIMESTAMP=$(date +%Y%m%d)

# Build image
docker build -t $IMAGE_NAME:$VERSION .

# Apply additional tags
docker tag $IMAGE_NAME:$VERSION $IMAGE_NAME:$GIT_HASH
docker tag $IMAGE_NAME:$VERSION $IMAGE_NAME:$TIMESTAMP

# If version is semver, add partial tags
if [[ $VERSION =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    MAJOR=$(echo $VERSION | cut -d. -f1)
    MINOR=$(echo $VERSION | cut -d. -f1-2)
    
    docker tag $IMAGE_NAME:$VERSION $IMAGE_NAME:$MAJOR
    docker tag $IMAGE_NAME:$VERSION $IMAGE_NAME:$MINOR
    docker tag $IMAGE_NAME:$VERSION $IMAGE_NAME:latest
fi

echo "Tagged images:"
docker images $IMAGE_NAME
```

### Tag Best Practices

```
✅ Use specific versions in production
✅ Avoid 'latest' in production deployments
✅ Include git hash for traceability
✅ Use immutable tags (digest) for critical deployments
✅ Document tagging strategy
✅ Automate tagging in CI/CD
✅ Clean up old tags regularly
```

### Immutable Tags (Digests)

```bash
# Get image digest
docker inspect --format='{{.RepoDigests}}' my-app:v1.0.0

# Pull by digest (immutable)
docker pull my-app@sha256:abc123...

# Use in Dockerfile
FROM my-app@sha256:abc123...
```

