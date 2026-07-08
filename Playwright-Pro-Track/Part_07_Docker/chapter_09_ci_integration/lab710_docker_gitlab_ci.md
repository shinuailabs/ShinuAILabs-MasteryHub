# Lab 710: Docker with GitLab CI

## LEARNING CONCEPT

Using Docker in GitLab CI/CD pipelines.

## EXERCISE

1. Build and push images
2. Run tests in containers
3. Deploy with Docker

## SOLUTION

### Basic GitLab CI

```yaml
# .gitlab-ci.yml
stages:
  - build
  - test
  - push
  - deploy

variables:
  IMAGE_TAG: $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
  LATEST_TAG: $CI_REGISTRY_IMAGE:latest

build:
  stage: build
  image: docker:24
  services:
    - docker:24-dind
  script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
    - docker build -t $IMAGE_TAG .
    - docker push $IMAGE_TAG
```

### Docker-in-Docker

```yaml
build:
  stage: build
  image: docker:24
  services:
    - docker:24-dind
  variables:
    DOCKER_TLS_CERTDIR: "/certs"
  before_script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
  script:
    - docker build -t $IMAGE_TAG .
    - docker push $IMAGE_TAG
```

### Kaniko Build (No Docker-in-Docker)

```yaml
build:
  stage: build
  image:
    name: gcr.io/kaniko-project/executor:v1.9.0-debug
    entrypoint: [""]
  script:
    - /kaniko/executor
      --context "${CI_PROJECT_DIR}"
      --dockerfile "${CI_PROJECT_DIR}/Dockerfile"
      --destination "${CI_REGISTRY_IMAGE}:${CI_COMMIT_SHA}"
```

### Run Tests in Container

```yaml
test:
  stage: test
  image: $IMAGE_TAG
  script:
    - npm test
  dependencies:
    - build
```

### Docker Compose in GitLab

```yaml
test:
  stage: test
  image: docker:24
  services:
    - docker:24-dind
  before_script:
    - apk add --no-cache docker-compose
  script:
    - docker-compose up -d
    - docker-compose run --rm test
    - docker-compose down -v
```

### Service Containers

```yaml
test:
  stage: test
  image: node:18
  services:
    - name: postgres:15
      alias: db
    - name: redis:7
      alias: cache
  variables:
    POSTGRES_PASSWORD: password
    DATABASE_URL: postgres://postgres:password@db:5432/postgres
    REDIS_URL: redis://cache:6379
  script:
    - npm ci
    - npm test
```

### Multi-Stage Pipeline

```yaml
stages:
  - build
  - test
  - security
  - push
  - deploy

build:
  stage: build
  script:
    - docker build -t $IMAGE_TAG .
    - docker push $IMAGE_TAG

unit-test:
  stage: test
  image: $IMAGE_TAG
  script:
    - npm test

integration-test:
  stage: test
  services:
    - postgres:15
  script:
    - npm run test:integration

security-scan:
  stage: security
  image: aquasec/trivy
  script:
    - trivy image $IMAGE_TAG

push-latest:
  stage: push
  only:
    - main
  script:
    - docker tag $IMAGE_TAG $LATEST_TAG
    - docker push $LATEST_TAG

deploy:
  stage: deploy
  only:
    - main
  script:
    - ./deploy.sh $IMAGE_TAG
```

### Caching

```yaml
build:
  stage: build
  image: docker:24
  services:
    - docker:24-dind
  variables:
    DOCKER_BUILDKIT: 1
  script:
    - docker pull $LATEST_TAG || true
    - docker build --cache-from $LATEST_TAG -t $IMAGE_TAG .
    - docker push $IMAGE_TAG
```

### Environment-Specific Builds

```yaml
.build-template: &build-template
  stage: build
  image: docker:24
  services:
    - docker:24-dind
  script:
    - docker build --build-arg ENV=$ENV -t $IMAGE_TAG .
    - docker push $IMAGE_TAG

build-staging:
  <<: *build-template
  variables:
    ENV: staging
    IMAGE_TAG: $CI_REGISTRY_IMAGE:staging
  only:
    - develop

build-production:
  <<: *build-template
  variables:
    ENV: production
    IMAGE_TAG: $CI_REGISTRY_IMAGE:production
  only:
    - main
```

### Artifacts

```yaml
test:
  stage: test
  image: $IMAGE_TAG
  script:
    - npm test
  artifacts:
    when: always
    paths:
      - coverage/
      - test-results/
    reports:
      junit: test-results/junit.xml
    expire_in: 1 week
```

