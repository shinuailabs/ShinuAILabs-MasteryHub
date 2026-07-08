# Lab 711: Docker with Jenkins

## LEARNING CONCEPT

Using Docker in Jenkins pipelines.

## EXERCISE

1. Configure Docker in Jenkins
2. Build and push images
3. Run tests in containers

## SOLUTION

### Basic Jenkinsfile

```groovy
pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "myapp"
        DOCKER_TAG = "${BUILD_NUMBER}"
    }

    stages {
        stage('Build') {
            steps {
                sh 'docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} .'
            }
        }

        stage('Test') {
            steps {
                sh 'docker run --rm ${DOCKER_IMAGE}:${DOCKER_TAG} npm test'
            }
        }

        stage('Push') {
            when {
                branch 'main'
            }
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'docker-hub',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                        echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                        docker push ${DOCKER_IMAGE}:${DOCKER_TAG}
                    '''
                }
            }
        }
    }

    post {
        always {
            sh 'docker rmi ${DOCKER_IMAGE}:${DOCKER_TAG} || true'
        }
    }
}
```

### Docker Agent

```groovy
pipeline {
    agent {
        docker {
            image 'node:18'
            args '-v /var/run/docker.sock:/var/run/docker.sock'
        }
    }

    stages {
        stage('Build') {
            steps {
                sh 'npm ci'
                sh 'npm run build'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test'
            }
        }
    }
}
```

### Docker Compose in Jenkins

```groovy
pipeline {
    agent any

    stages {
        stage('Start Services') {
            steps {
                sh 'docker-compose up -d'
            }
        }

        stage('Wait for Services') {
            steps {
                sh '''
                    until curl -s http://localhost:3000/health; do
                        sleep 5
                    done
                '''
            }
        }

        stage('Run Tests') {
            steps {
                sh 'docker-compose run --rm test'
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

### Multi-Stage Pipeline

```groovy
pipeline {
    agent any

    environment {
        REGISTRY = 'myregistry.com'
        IMAGE_NAME = 'myapp'
        IMAGE_TAG = "${GIT_COMMIT[0..7]}"
    }

    stages {
        stage('Build') {
            steps {
                script {
                    docker.build("${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}")
                }
            }
        }

        stage('Test') {
            parallel {
                stage('Unit Tests') {
                    steps {
                        sh "docker run --rm ${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG} npm test"
                    }
                }
                stage('Integration Tests') {
                    steps {
                        sh "docker run --rm ${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG} npm run test:integration"
                    }
                }
            }
        }

        stage('Security Scan') {
            steps {
                sh "trivy image ${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}"
            }
        }

        stage('Push') {
            when {
                branch 'main'
            }
            steps {
                script {
                    docker.withRegistry("https://${REGISTRY}", 'registry-credentials') {
                        docker.image("${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}").push()
                        docker.image("${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}").push('latest')
                    }
                }
            }
        }

        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                sh "./deploy.sh ${IMAGE_TAG}"
            }
        }
    }
}
```

### Docker Pipeline Plugin

```groovy
pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                script {
                    def app = docker.build("myapp:${BUILD_NUMBER}")
                    
                    app.inside {
                        sh 'npm test'
                    }
                    
                    docker.withRegistry('https://registry.example.com', 'credentials-id') {
                        app.push()
                        app.push('latest')
                    }
                }
            }
        }
    }
}
```

### Cleanup

```groovy
post {
    always {
        sh '''
            docker rmi ${IMAGE_NAME}:${IMAGE_TAG} || true
            docker system prune -f
        '''
        cleanWs()
    }
}
```

### Best Practices

```
✅ Use Docker Pipeline plugin
✅ Clean up images after builds
✅ Use credentials binding
✅ Tag with build number/commit
✅ Use parallel stages
✅ Implement proper error handling
```

