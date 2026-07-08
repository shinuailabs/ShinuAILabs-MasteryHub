# Lab 774: Docker Plugin

## LEARNING CONCEPT

Using Docker plugins for containerized builds.

## EXERCISE

1. Configure Docker plugin
2. Use Docker in pipelines
3. Build and push images

## SOLUTION

### Install Docker Plugins

```
Required plugins:
- docker-plugin (Docker)
- docker-workflow (Docker Pipeline)
- docker-commons (Docker Commons)
```

### Configure Docker Cloud

```
Manage Jenkins → Clouds → New cloud → Docker

Docker Cloud details:
  Name: docker
  Docker Host URI: unix:///var/run/docker.sock
  
  Or TCP:
  Docker Host URI: tcp://docker-host:2376
  Server credentials: docker-tls-certs
```

### Docker Agent Template

```
Docker Agent templates:
  Labels: docker-agent
  Docker Image: jenkins/inbound-agent
  Remote File System Root: /home/jenkins
  Connect method: Attach Docker container
```

### Docker in Pipeline

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

### Docker with Options

```groovy
pipeline {
    agent {
        docker {
            image 'node:18-alpine'
            args '-v /tmp:/tmp -u root --network host'
            label 'docker-capable'
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
                    def image = docker.build("${DOCKER_IMAGE}:${DOCKER_TAG}")
                }
            }
        }
    }
}
```

### Build with Dockerfile

```groovy
pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
                script {
                    // Default Dockerfile
                    docker.build('my-app:latest')
                    
                    // Custom Dockerfile
                    docker.build('my-app:latest', '-f Dockerfile.prod .')
                    
                    // With build args
                    docker.build('my-app:latest', '--build-arg VERSION=1.0.0 .')
                }
            }
        }
    }
}
```

### Push to Registry

```groovy
pipeline {
    agent any
    
    environment {
        REGISTRY = 'registry.example.com'
        IMAGE_NAME = 'my-app'
    }
    
    stages {
        stage('Build and Push') {
            steps {
                script {
                    docker.withRegistry("https://${REGISTRY}", 'docker-registry-creds') {
                        def image = docker.build("${REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}")
                        image.push()
                        image.push('latest')
                    }
                }
            }
        }
    }
}
```

### Run Container

```groovy
pipeline {
    agent any
    
    stages {
        stage('Test in Container') {
            steps {
                script {
                    docker.image('node:18').inside {
                        sh 'npm test'
                    }
                }
            }
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
        
        stage('Test') {
            steps {
                sh 'docker-compose exec -T app npm test'
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

### Multi-stage Build

```groovy
pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
                sh '''
                    docker build \
                        --target builder \
                        -t my-app:builder \
                        .
                    
                    docker build \
                        -t my-app:${BUILD_NUMBER} \
                        .
                '''
            }
        }
    }
}
```

### Docker Cleanup

```groovy
pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
                sh 'docker build -t my-app .'
            }
        }
    }
    
    post {
        always {
            sh '''
                docker rmi my-app || true
                docker system prune -f || true
            '''
        }
    }
}
```

### Best Practices

```
✅ Use specific image tags
✅ Clean up containers and images
✅ Use Docker layer caching
✅ Scan images for vulnerabilities
✅ Use multi-stage builds
✅ Mount volumes for caching
```

