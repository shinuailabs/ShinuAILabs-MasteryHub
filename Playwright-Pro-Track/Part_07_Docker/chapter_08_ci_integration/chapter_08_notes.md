# Part 08: CI Integration

## 📚 Overview
Integrating Docker with CI/CD pipelines ensures consistent test execution across environments.

---

## 🎯 Key Concepts

### 1. GitHub Actions with Docker

```yaml
# .github/workflows/test.yml
name: Playwright Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Build and run tests
        run: |
          docker-compose -f docker-compose.test.yml up \
            --build \
            --abort-on-container-exit \
            --exit-code-from tests
      
      - name: Upload reports
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

### 2. Docker Compose for CI

```yaml
# docker-compose.test.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 5s
      timeout: 3s
      retries: 10

  tests:
    build:
      context: .
      dockerfile: Dockerfile.test
    depends_on:
      app:
        condition: service_healthy
    environment:
      - BASE_URL=http://app:3000
      - CI=true
    volumes:
      - ./test-results:/app/test-results
      - ./playwright-report:/app/playwright-report
```

### 3. Caching in CI

```yaml
# .github/workflows/test.yml
jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
      
      - name: Cache Docker layers
        uses: actions/cache@v3
        with:
          path: /tmp/.buildx-cache
          key: ${{ runner.os }}-buildx-${{ hashFiles('**/Dockerfile') }}
          restore-keys: |
            ${{ runner.os }}-buildx-
      
      - name: Build with cache
        uses: docker/build-push-action@v5
        with:
          context: .
          push: false
          load: true
          tags: playwright-tests:latest
          cache-from: type=local,src=/tmp/.buildx-cache
          cache-to: type=local,dest=/tmp/.buildx-cache-new,mode=max
      
      - name: Run tests
        run: docker run playwright-tests:latest
```

### 4. Parallel Test Execution

```yaml
# .github/workflows/test.yml
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        shard: [1, 2, 3, 4]
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Run tests (shard ${{ matrix.shard }}/4)
        run: |
          docker run --rm \
            -v $(pwd)/test-results:/app/test-results \
            playwright-tests \
            npx playwright test --shard=${{ matrix.shard }}/4
      
      - name: Upload results
        uses: actions/upload-artifact@v3
        with:
          name: test-results-${{ matrix.shard }}
          path: test-results/
```

### 5. Multi-Browser Testing

```yaml
# .github/workflows/test.yml
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        browser: [chromium, firefox, webkit]
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Run ${{ matrix.browser }} tests
        run: |
          docker run --rm \
            -e BROWSER=${{ matrix.browser }} \
            playwright-tests \
            npx playwright test --project=${{ matrix.browser }}
```

### 6. Jenkins Pipeline

```groovy
// Jenkinsfile
pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
                sh 'docker-compose build'
            }
        }
        
        stage('Test') {
            steps {
                sh '''
                    docker-compose -f docker-compose.test.yml up \
                        --abort-on-container-exit \
                        --exit-code-from tests
                '''
            }
            post {
                always {
                    archiveArtifacts artifacts: 'playwright-report/**'
                    publishHTML([
                        reportDir: 'playwright-report',
                        reportFiles: 'index.html',
                        reportName: 'Playwright Report'
                    ])
                }
            }
        }
    }
    
    post {
        always {
            sh 'docker-compose down -v'
        }
    }
}
```

### 7. GitLab CI

```yaml
# .gitlab-ci.yml
stages:
  - test

playwright-tests:
  stage: test
  image: docker:24
  services:
    - docker:24-dind
  
  variables:
    DOCKER_TLS_CERTDIR: "/certs"
  
  before_script:
    - docker-compose --version
  
  script:
    - docker-compose -f docker-compose.test.yml up --build --abort-on-container-exit
  
  artifacts:
    when: always
    paths:
      - playwright-report/
      - test-results/
    reports:
      junit: test-results/junit.xml
```

### 8. Azure DevOps

```yaml
# azure-pipelines.yml
trigger:
  - main

pool:
  vmImage: 'ubuntu-latest'

steps:
  - task: DockerCompose@0
    inputs:
      containerregistrytype: 'Container Registry'
      dockerComposeFile: 'docker-compose.test.yml'
      action: 'Run services'
      buildImages: true

  - task: PublishTestResults@2
    inputs:
      testResultsFormat: 'JUnit'
      testResultsFiles: '**/junit.xml'
    condition: always()

  - task: PublishPipelineArtifact@1
    inputs:
      targetPath: 'playwright-report'
      artifact: 'playwright-report'
    condition: always()
```

---

## 💻 Practice Exercises

1. Set up GitHub Actions workflow
2. Configure Docker caching
3. Implement parallel testing
4. Create Jenkins pipeline
5. Set up GitLab CI

---

## ✅ Best Practices

- ✅ Use Docker layer caching
- ✅ Run tests in parallel
- ✅ Upload artifacts on failure
- ✅ Use health checks
- ❌ Don't skip cleanup
- ❌ Avoid long-running containers

---

## 📝 Quick Reference

```yaml
# GitHub Actions
- run: docker-compose up --abort-on-container-exit

# Caching
uses: actions/cache@v3
with:
  path: /tmp/.buildx-cache

# Parallel
strategy:
  matrix:
    shard: [1, 2, 3, 4]

# Artifacts
uses: actions/upload-artifact@v3
with:
  path: playwright-report/
```

