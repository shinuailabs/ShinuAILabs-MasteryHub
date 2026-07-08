# Lab 715: Docker Security in CI

## LEARNING CONCEPT

Implementing security scanning and best practices in CI/CD.

## EXERCISE

1. Scan images for vulnerabilities
2. Implement security checks
3. Enforce security policies

## SOLUTION

### Trivy Scanning

```yaml
# GitHub Actions
name: Security Scan

on: [push, pull_request]

jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Build image
        run: docker build -t myapp:scan .

      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: myapp:scan
          format: 'sarif'
          output: 'trivy-results.sarif'
          severity: 'CRITICAL,HIGH'

      - name: Upload Trivy scan results
        uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: 'trivy-results.sarif'
```

### Snyk Scanning

```yaml
- name: Run Snyk to check for vulnerabilities
  uses: snyk/actions/docker@master
  env:
    SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
  with:
    image: myapp:scan
    args: --severity-threshold=high
```

### Dockerfile Linting

```yaml
- name: Lint Dockerfile
  uses: hadolint/hadolint-action@v3.1.0
  with:
    dockerfile: Dockerfile
    failure-threshold: warning
```

### Secret Scanning

```yaml
- name: Scan for secrets
  uses: trufflesecurity/trufflehog@main
  with:
    path: ./
    base: ${{ github.event.repository.default_branch }}
    head: HEAD
```

### Complete Security Pipeline

```yaml
name: Security Pipeline

on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: hadolint/hadolint-action@v3.1.0
        with:
          dockerfile: Dockerfile

  secrets:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: trufflesecurity/trufflehog@main

  build-scan:
    runs-on: ubuntu-latest
    needs: [lint, secrets]
    steps:
      - uses: actions/checkout@v4

      - name: Build image
        run: docker build -t myapp:scan .

      - name: Trivy scan
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: myapp:scan
          exit-code: '1'
          severity: 'CRITICAL'

      - name: Snyk scan
        uses: snyk/actions/docker@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          image: myapp:scan

  push:
    runs-on: ubuntu-latest
    needs: build-scan
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Push verified image
        run: docker push myapp:latest
```

### GitLab Security Scanning

```yaml
include:
  - template: Security/Container-Scanning.gitlab-ci.yml
  - template: Security/SAST.gitlab-ci.yml

container_scanning:
  stage: security
  variables:
    CS_IMAGE: $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
```

### Secure Dockerfile

```dockerfile
# Use specific version
FROM node:18.19.0-alpine3.19

# Create non-root user
RUN addgroup -g 1001 appgroup && \
    adduser -u 1001 -G appgroup -D appuser

WORKDIR /app

# Copy with specific ownership
COPY --chown=appuser:appgroup package*.json ./
RUN npm ci --only=production

COPY --chown=appuser:appgroup . .

# Switch to non-root user
USER appuser

# Read-only filesystem
# Use tmpfs for writable directories

EXPOSE 3000

CMD ["node", "index.js"]
```

### Security Policies

```yaml
# Block deployment if critical vulnerabilities
- name: Check scan results
  run: |
    CRITICAL=$(cat trivy-results.json | jq '.Results[].Vulnerabilities | select(. != null) | .[] | select(.Severity == "CRITICAL")' | wc -l)
    if [ "$CRITICAL" -gt 0 ]; then
      echo "Critical vulnerabilities found!"
      exit 1
    fi
```

### SBOM Generation

```yaml
- name: Generate SBOM
  uses: anchore/sbom-action@v0
  with:
    image: myapp:scan
    format: spdx-json
    output-file: sbom.spdx.json

- name: Upload SBOM
  uses: actions/upload-artifact@v4
  with:
    name: sbom
    path: sbom.spdx.json
```

### Best Practices

```
✅ Scan on every build
✅ Block on critical vulnerabilities
✅ Use minimal base images
✅ Run as non-root
✅ Keep images updated
✅ Generate SBOMs
✅ Lint Dockerfiles
✅ Scan for secrets
```

