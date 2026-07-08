# Lab 766: Docker in Jenkinsfile

## LEARNING CONCEPT

Using Docker containers in Jenkins pipelines.

## EXERCISE

1. Run pipeline in Docker
2. Build Docker images
3. Use Docker Compose

## SOLUTION

### Docker Agent

```groovy
pipeline {
    agent {
        docker {
            image 'node:18'
        }
    }
    
    stages {
        stage('Build') {
            steps {
                sh 'node --version'
                sh 'npm ci'
                sh 'npm run build'
            }
        }
    }
}
```

### Docker Agent with Options

```groovy
pipeline {
    agent {
        docker {
            image 'node:18-alpine'
            args '-v /tmp:/tmp -u root'
            label 'docker-agent'
            registryUrl 'https://registry.example.com'
            registryCredentialsId 'docker-registry-creds'
        }
    }
    
    stages {
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
    }
}
```

### Dockerfile Agent

```groovy
pipeline {
    agent {
        dockerfile {
            filename 'Dockerfile.ci'
            dir 'docker'
            args '-v /tmp:/tmp'
            additionalBuildArgs '--build-arg VERSION=1.0.0'
        }
    }
    
    stages {
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
    }
}
```

### Docker per Stage

```groovy
pipeline {
    agent none
    
    stages {
        stage('Build') {
            agent {
                docker { image 'node:18' }
            }
            steps {
                sh 'npm ci'
                sh 'npm run build'
                stash includes: 'dist/**/*', name: 'build'
            }
        }
        
        stage('Test') {
            agent {
                docker { image 'mcr.microsoft.com/playwright:v1.40.0' }
            }
            steps {
                unstash 'build'
                sh 'npx playwright test'
            }
        }
        
        stage('Deploy') {
            agent {
                docker { image 'amazon/aws-cli' }
            }
            steps {
                unstash 'build'
                sh 'aws s3 sync dist/ s3://my-bucket/'
            }
        }
    }
}
```

### Build Docker Image

```groovy
pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = 'my-app'
        DOCKER_TAG = "${env.BUILD_NUMBER}"
    }
    
    stages {
        stage('Build Image') {
            steps {
                script {
                    docker.build("${DOCKER_IMAGE}:${DOCKER_TAG}")
                }
            }
        }
        
        stage('Test Image') {
            steps {
                script {
                    docker.image("${DOCKER_IMAGE}:${DOCKER_TAG}").inside {
                        sh 'npm test'
                    }
                }
            }
        }
        
        stage('Push Image') {
            steps {
                script {
                    docker.withRegistry('https://registry.example.com', 'docker-creds') {
                        docker.image("${DOCKER_IMAGE}:${DOCKER_TAG}").push()
                        docker.image("${DOCKER_IMAGE}:${DOCKER_TAG}").push('latest')
                    }
                }
            }
        }
    }
}
```

### Docker Build with Shell

```groovy
pipeline {
    agent any
    
    environment {
        REGISTRY = 'registry.example.com'
        IMAGE_NAME = 'my-app'
        IMAGE_TAG = "${env.BUILD_NUMBER}"
    }
    
    stages {
        stage('Build') {
            steps {
                sh """
                    docker build -t ${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG} .
                    docker tag ${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG} ${REGISTRY}/${IMAGE_NAME}:latest
                """
            }
        }
        
        stage('Push') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'docker-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh """
                        echo \$DOCKER_PASS | docker login ${REGISTRY} -u \$DOCKER_USER --password-stdin
                        docker push ${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}
                        docker push ${REGISTRY}/${IMAGE_NAME}:latest
                    """
                }
            }
        }
    }
    
    post {
        always {
            sh 'docker logout ${REGISTRY} || true'
        }
    }
}
```

### Docker Compose

```groovy
pipeline {
    agent any
    
    stages {
        stage('Start Services') {
            steps {
                sh 'docker-compose up -d'
            }
        }
        
        stage('Run Tests') {
            steps {
                sh 'docker-compose exec -T app npm test'
            }
        }
        
        stage('Integration Tests') {
            steps {
                sh 'docker-compose exec -T app npm run test:integration'
            }
        }
    }
    
    post {
        always {
            sh 'docker-compose down -v'
            sh 'docker-compose rm -f'
        }
    }
}
```

### Sidecar Containers

```groovy
pipeline {
    agent {
        docker {
            image 'node:18'
            args '--network host'
        }
    }
    
    stages {
        stage('Start Database') {
            steps {
                sh 'docker run -d --name test-db -p 5432:5432 postgres:15'
                sh 'sleep 10'  // Wait for DB to start
            }
        }
        
        stage('Test') {
            steps {
                sh 'npm run test:integration'
            }
        }
    }
    
    post {
        always {
            sh 'docker stop test-db || true'
            sh 'docker rm test-db || true'
        }
    }
}
```

### Multi-stage Build

```dockerfile
# Dockerfile
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
```

```groovy
pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
                sh 'docker build -t my-app:${BUILD_NUMBER} .'
            }
        }
    }
}
```

### Best Practices

```
✅ Use specific image tags
✅ Clean up containers after use
✅ Use Docker layer caching
✅ Mount volumes for caching
✅ Use multi-stage builds
✅ Scan images for vulnerabilities
```

