# Lab 716: Docker CI Best Practices

## LEARNING CONCEPT

Comprehensive best practices for Docker in CI/CD.

## EXERCISE

1. Review best practices
2. Apply to pipelines
3. Optimize workflows

## SOLUTION

### Pipeline Structure

```yaml
name: Complete CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: hadolint/hadolint-action@v3.1.0

  build:
    needs: lint
    runs-on: ubuntu-latest
    outputs:
      image: ${{ steps.build.outputs.image }}
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-buildx-action@v3
      - id: build
        uses: docker/build-push-action@v5
        with:
          push: false
          load: true
          tags: myapp:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  test:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - run: docker run --rm myapp:${{ github.sha }} npm test

  security:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: aquasecurity/trivy-action@master
        with:
          image-ref: myapp:${{ github.sha }}
          exit-code: '1'
          severity: 'CRITICAL'

  push:
    needs: [test, security]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
      - uses: docker/build-push-action@v5
        with:
          push: true
          tags: myuser/myapp:latest

  deploy:
    needs: push
    runs-on: ubuntu-latest
    steps:
      - run: ./deploy.sh
```

### Image Tagging Strategy

```yaml
- name: Docker meta
  id: meta
  uses: docker/metadata-action@v5
  with:
    images: myuser/myapp
    tags: |
      type=ref,event=branch
      type=ref,event=pr
      type=semver,pattern={{version}}
      type=sha,prefix=
```

### Caching Strategy

```yaml
# Use GitHub Actions cache
- uses: docker/build-push-action@v5
  with:
    cache-from: type=gha
    cache-to: type=gha,mode=max

# Or registry cache
- uses: docker/build-push-action@v5
  with:
    cache-from: type=registry,ref=myuser/myapp:cache
    cache-to: type=registry,ref=myuser/myapp:cache,mode=max
```

### Security Checklist

```yaml
# 1. Lint Dockerfile
- uses: hadolint/hadolint-action@v3.1.0

# 2. Scan for secrets
- uses: trufflesecurity/trufflehog@main

# 3. Vulnerability scan
- uses: aquasecurity/trivy-action@master

# 4. SBOM generation
- uses: anchore/sbom-action@v0
```

### Environment Management

```yaml
jobs:
  deploy-staging:
    if: github.ref == 'refs/heads/develop'
    environment: staging
    steps:
      - run: ./deploy.sh staging

  deploy-production:
    if: github.ref == 'refs/heads/main'
    environment: production
    needs: deploy-staging
    steps:
      - run: ./deploy.sh production
```

### Artifact Management

```yaml
- name: Upload test results
  uses: actions/upload-artifact@v4
  if: always()
  with:
    name: test-results
    path: test-results/
    retention-days: 30
```

### Notifications

```yaml
- name: Notify on failure
  if: failure()
  uses: slackapi/slack-github-action@v1
  with:
    payload: |
      {
        "text": "Build failed: ${{ github.repository }}"
      }
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

### Cleanup

```yaml
post:
  always:
    - name: Cleanup
      run: |
        docker system prune -f
        docker image prune -f
```

### Checklist

```
Pipeline Structure:
□ Lint before build
□ Test before push
□ Security scan before deploy
□ Use caching
□ Tag images properly

Security:
□ Scan for vulnerabilities
□ Lint Dockerfiles
□ Check for secrets
□ Use minimal base images
□ Run as non-root

Performance:
□ Use BuildKit
□ Cache layers
□ Parallelize jobs
□ Use matrix builds

Operations:
□ Upload artifacts
□ Set up notifications
□ Clean up resources
□ Document pipelines
```

### Common Mistakes

```
❌ Using :latest in production
❌ Not caching builds
❌ Skipping security scans
❌ Hardcoding credentials
❌ Not cleaning up
❌ Missing health checks
❌ No artifact retention policy
```

### Best Practices Summary

```
✅ Use specific image versions
✅ Implement multi-stage builds
✅ Cache aggressively
✅ Scan for vulnerabilities
✅ Use secrets management
✅ Tag with commit SHA
✅ Clean up after builds
✅ Document everything
```

