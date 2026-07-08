# Lab 702: Playwright CI with Docker

## LEARNING CONCEPT

Running Playwright tests in CI/CD with Docker.

## EXERCISE

1. Configure for GitHub Actions
2. Set up GitLab CI
3. Implement Jenkins pipeline

## SOLUTION

### GitHub Actions

```yaml
# .github/workflows/playwright.yml
name: Playwright Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    container:
      image: mcr.microsoft.com/playwright:v1.40.0-jammy

    steps:
      - uses: actions/checkout@v4

      - name: Install dependencies
        run: npm ci

      - name: Run Playwright tests
        run: npx playwright test

      - name: Upload report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

### GitHub Actions with Services

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    container:
      image: mcr.microsoft.com/playwright:v1.40.0-jammy

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: password
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npx playwright test
        env:
          DATABASE_URL: postgres://postgres:password@postgres:5432/postgres
```

### GitLab CI

```yaml
# .gitlab-ci.yml
stages:
  - test

playwright:
  stage: test
  image: mcr.microsoft.com/playwright:v1.40.0-jammy
  script:
    - npm ci
    - npx playwright test
  artifacts:
    when: always
    paths:
      - playwright-report/
      - test-results/
    expire_in: 1 week
```

### GitLab CI with Services

```yaml
playwright:
  stage: test
  image: mcr.microsoft.com/playwright:v1.40.0-jammy
  services:
    - name: postgres:15
      alias: db
  variables:
    POSTGRES_PASSWORD: password
    DATABASE_URL: postgres://postgres:password@db:5432/postgres
  script:
    - npm ci
    - npx playwright test
  artifacts:
    when: always
    paths:
      - playwright-report/
```

### Jenkins Pipeline

```groovy
// Jenkinsfile
pipeline {
    agent {
        docker {
            image 'mcr.microsoft.com/playwright:v1.40.0-jammy'
        }
    }

    stages {
        stage('Install') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Test') {
            steps {
                sh 'npx playwright test'
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
            publishHTML([
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright Report'
            ])
        }
    }
}
```

### CircleCI

```yaml
# .circleci/config.yml
version: 2.1

jobs:
  test:
    docker:
      - image: mcr.microsoft.com/playwright:v1.40.0-jammy
    steps:
      - checkout
      - run: npm ci
      - run: npx playwright test
      - store_artifacts:
          path: playwright-report

workflows:
  test:
    jobs:
      - test
```

### Azure DevOps

```yaml
# azure-pipelines.yml
trigger:
  - main

pool:
  vmImage: ubuntu-latest

container: mcr.microsoft.com/playwright:v1.40.0-jammy

steps:
  - script: npm ci
    displayName: Install dependencies

  - script: npx playwright test
    displayName: Run Playwright tests

  - task: PublishPipelineArtifact@1
    condition: always()
    inputs:
      targetPath: playwright-report
      artifactName: playwright-report
```

### Docker Compose in CI

```yaml
# GitHub Actions with Docker Compose
name: E2E Tests

on: [push]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Start services
        run: docker compose up -d app db

      - name: Wait for services
        run: docker compose exec -T app curl --retry 10 --retry-delay 5 http://localhost:3000

      - name: Run tests
        run: docker compose run playwright

      - name: Upload report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/

      - name: Cleanup
        if: always()
        run: docker compose down -v
```

