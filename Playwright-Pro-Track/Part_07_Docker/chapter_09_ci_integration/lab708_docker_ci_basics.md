# Lab 708: Docker CI Basics

## LEARNING CONCEPT

Integrating Docker with CI/CD pipelines.

### Benefits:
- Consistent build environment
- Reproducible builds
- Isolated testing
- Easy deployment

## EXERCISE

1. Understand CI/CD with Docker
2. Configure basic pipeline
3. Build and test with Docker

## SOLUTION

### CI/CD Pipeline Stages

```
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│  Build  │ -> │  Test   │ -> │  Push   │ -> │ Deploy  │
└─────────┘    └─────────┘    └─────────┘    └─────────┘
```

### Basic GitHub Actions

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Build Docker image
        run: docker build -t myapp:${{ github.sha }} .

      - name: Run tests
        run: docker run --rm myapp:${{ github.sha }} npm test

      - name: Push to registry
        if: github.ref == 'refs/heads/main'
        run: |
          echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
          docker tag myapp:${{ github.sha }} myregistry/myapp:latest
          docker push myregistry/myapp:latest
```

### GitLab CI Basic

```yaml
stages:
  - build
  - test
  - push
  - deploy

variables:
  IMAGE_TAG: $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA

build:
  stage: build
  script:
    - docker build -t $IMAGE_TAG .
    - docker push $IMAGE_TAG

test:
  stage: test
  script:
    - docker run --rm $IMAGE_TAG npm test

push:
  stage: push
  only:
    - main
  script:
    - docker tag $IMAGE_TAG $CI_REGISTRY_IMAGE:latest
    - docker push $CI_REGISTRY_IMAGE:latest
```

### Jenkins Pipeline Basic

```groovy
pipeline {
    agent any

    environment {
        IMAGE_TAG = "myapp:${BUILD_NUMBER}"
    }

    stages {
        stage('Build') {
            steps {
                sh 'docker build -t ${IMAGE_TAG} .'
            }
        }

        stage('Test') {
            steps {
                sh 'docker run --rm ${IMAGE_TAG} npm test'
            }
        }

        stage('Push') {
            when {
                branch 'main'
            }
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-hub', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    sh 'echo $PASS | docker login -u $USER --password-stdin'
                    sh 'docker push ${IMAGE_TAG}'
                }
            }
        }
    }
}
```

### Docker Build Caching

```yaml
# GitHub Actions with caching
- name: Set up Docker Buildx
  uses: docker/setup-buildx-action@v3

- name: Build with cache
  uses: docker/build-push-action@v5
  with:
    context: .
    push: false
    tags: myapp:${{ github.sha }}
    cache-from: type=gha
    cache-to: type=gha,mode=max
```

### Multi-Stage CI

```yaml
name: Multi-Stage CI

jobs:
  build:
    runs-on: ubuntu-latest
    outputs:
      image: ${{ steps.build.outputs.image }}
    steps:
      - uses: actions/checkout@v4
      - id: build
        run: |
          docker build -t myapp:${{ github.sha }} .
          echo "image=myapp:${{ github.sha }}" >> $GITHUB_OUTPUT

  test:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - run: docker run --rm ${{ needs.build.outputs.image }} npm test

  deploy:
    needs: [build, test]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploying ${{ needs.build.outputs.image }}"
```

### Environment Variables

```yaml
# Secure handling
- name: Build with secrets
  run: |
    docker build \
      --build-arg API_KEY=${{ secrets.API_KEY }} \
      -t myapp .
```

### Best Practices

```
✅ Use specific image tags
✅ Cache Docker layers
✅ Run tests in containers
✅ Use multi-stage builds
✅ Secure credentials
✅ Tag with commit SHA
```

