# Lab 712: Docker Registry Integration

## LEARNING CONCEPT

Working with Docker registries in CI/CD.

## EXERCISE

1. Push to different registries
2. Manage image tags
3. Implement security scanning

## SOLUTION

### Docker Hub

```yaml
# GitHub Actions
- name: Login to Docker Hub
  uses: docker/login-action@v3
  with:
    username: ${{ secrets.DOCKER_USERNAME }}
    password: ${{ secrets.DOCKER_PASSWORD }}

- name: Push to Docker Hub
  uses: docker/build-push-action@v5
  with:
    push: true
    tags: myuser/myapp:latest
```

### GitHub Container Registry

```yaml
- name: Login to GHCR
  uses: docker/login-action@v3
  with:
    registry: ghcr.io
    username: ${{ github.actor }}
    password: ${{ secrets.GITHUB_TOKEN }}

- name: Push to GHCR
  uses: docker/build-push-action@v5
  with:
    push: true
    tags: ghcr.io/${{ github.repository }}:latest
```

### AWS ECR

```yaml
- name: Configure AWS credentials
  uses: aws-actions/configure-aws-credentials@v4
  with:
    aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    aws-region: us-east-1

- name: Login to Amazon ECR
  id: login-ecr
  uses: aws-actions/amazon-ecr-login@v2

- name: Push to ECR
  uses: docker/build-push-action@v5
  with:
    push: true
    tags: ${{ steps.login-ecr.outputs.registry }}/myapp:latest
```

### Google Container Registry

```yaml
- name: Login to GCR
  uses: docker/login-action@v3
  with:
    registry: gcr.io
    username: _json_key
    password: ${{ secrets.GCP_SA_KEY }}

- name: Push to GCR
  uses: docker/build-push-action@v5
  with:
    push: true
    tags: gcr.io/${{ secrets.GCP_PROJECT_ID }}/myapp:latest
```

### Azure Container Registry

```yaml
- name: Login to ACR
  uses: docker/login-action@v3
  with:
    registry: myregistry.azurecr.io
    username: ${{ secrets.ACR_USERNAME }}
    password: ${{ secrets.ACR_PASSWORD }}

- name: Push to ACR
  uses: docker/build-push-action@v5
  with:
    push: true
    tags: myregistry.azurecr.io/myapp:latest
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
      type=semver,pattern={{major}}.{{minor}}
      type=sha

- name: Build and push
  uses: docker/build-push-action@v5
  with:
    push: true
    tags: ${{ steps.meta.outputs.tags }}
    labels: ${{ steps.meta.outputs.labels }}
```

### Security Scanning

```yaml
- name: Build image
  uses: docker/build-push-action@v5
  with:
    push: false
    load: true
    tags: myapp:scan

- name: Scan with Trivy
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: myapp:scan
    format: 'table'
    exit-code: '1'
    severity: 'CRITICAL,HIGH'

- name: Push if scan passes
  uses: docker/build-push-action@v5
  with:
    push: true
    tags: myuser/myapp:latest
```

### Private Registry

```yaml
# Self-hosted registry
- name: Login to private registry
  uses: docker/login-action@v3
  with:
    registry: registry.example.com
    username: ${{ secrets.REGISTRY_USERNAME }}
    password: ${{ secrets.REGISTRY_PASSWORD }}

- name: Push to private registry
  uses: docker/build-push-action@v5
  with:
    push: true
    tags: registry.example.com/myapp:latest
```

### Multi-Registry Push

```yaml
- name: Login to registries
  run: |
    echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
    echo ${{ secrets.GITHUB_TOKEN }} | docker login ghcr.io -u ${{ github.actor }} --password-stdin

- name: Build and push to multiple registries
  uses: docker/build-push-action@v5
  with:
    push: true
    tags: |
      myuser/myapp:latest
      ghcr.io/${{ github.repository }}:latest
```

### Best Practices

```
✅ Use semantic versioning
✅ Tag with commit SHA
✅ Scan before pushing
✅ Use immutable tags
✅ Clean up old images
✅ Use registry credentials securely
```

