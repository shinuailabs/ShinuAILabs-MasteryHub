# Lab 770: Jenkinsfile Templates

## LEARNING CONCEPT

Creating reusable Jenkinsfile templates.

## EXERCISE

1. Create standard templates
2. Use templates for different projects
3. Customize templates

## SOLUTION

### Node.js Application Template

```groovy
// Jenkinsfile.nodejs
pipeline {
    agent {
        docker { image 'node:18' }
    }
    
    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
        timestamps()
    }
    
    environment {
        CI = 'true'
        NPM_CONFIG_CACHE = "${WORKSPACE}/.npm"
    }
    
    stages {
        stage('Install') {
            steps {
                sh 'npm ci'
            }
        }
        
        stage('Lint') {
            steps {
                sh 'npm run lint'
            }
        }
        
        stage('Test') {
            steps {
                sh 'npm test'
            }
            post {
                always {
                    junit 'test-results/*.xml'
                }
            }
        }
        
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
        
        stage('Deploy') {
            when { branch 'main' }
            steps {
                sh './deploy.sh'
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
    }
}
```

### Python Application Template

```groovy
// Jenkinsfile.python
pipeline {
    agent {
        docker { image 'python:3.11' }
    }
    
    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
    }
    
    stages {
        stage('Setup') {
            steps {
                sh '''
                    python -m venv venv
                    . venv/bin/activate
                    pip install -r requirements.txt
                '''
            }
        }
        
        stage('Lint') {
            steps {
                sh '''
                    . venv/bin/activate
                    flake8 src/
                    black --check src/
                '''
            }
        }
        
        stage('Test') {
            steps {
                sh '''
                    . venv/bin/activate
                    pytest --junitxml=test-results/results.xml
                '''
            }
            post {
                always {
                    junit 'test-results/*.xml'
                }
            }
        }
        
        stage('Build') {
            steps {
                sh '''
                    . venv/bin/activate
                    python setup.py sdist bdist_wheel
                '''
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
    }
}
```

### Playwright Test Template

```groovy
// Jenkinsfile.playwright
pipeline {
    agent {
        docker {
            image 'mcr.microsoft.com/playwright:v1.40.0-jammy'
        }
    }
    
    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 60, unit: 'MINUTES')
    }
    
    parameters {
        choice(name: 'BROWSER', choices: ['chromium', 'firefox', 'webkit', 'all'])
        string(name: 'BASE_URL', defaultValue: 'https://staging.example.com')
    }
    
    environment {
        CI = 'true'
        BASE_URL = "${params.BASE_URL}"
    }
    
    stages {
        stage('Install') {
            steps {
                sh 'npm ci'
            }
        }
        
        stage('Test') {
            steps {
                script {
                    def project = params.BROWSER == 'all' ? '' : "--project=${params.BROWSER}"
                    sh "npx playwright test ${project}"
                }
            }
        }
    }
    
    post {
        always {
            publishHTML([
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright Report'
            ])
            archiveArtifacts artifacts: 'test-results/**/*', allowEmptyArchive: true
        }
    }
}
```

### Docker Build Template

```groovy
// Jenkinsfile.docker
pipeline {
    agent any
    
    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
    }
    
    environment {
        REGISTRY = 'registry.example.com'
        IMAGE_NAME = 'my-app'
        IMAGE_TAG = "${env.BUILD_NUMBER}"
    }
    
    stages {
        stage('Build') {
            steps {
                sh "docker build -t ${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG} ."
            }
        }
        
        stage('Test') {
            steps {
                sh "docker run --rm ${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG} npm test"
            }
        }
        
        stage('Push') {
            when { branch 'main' }
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'docker-registry',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                        echo $DOCKER_PASS | docker login $REGISTRY -u $DOCKER_USER --password-stdin
                        docker push ${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}
                        docker tag ${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG} ${REGISTRY}/${IMAGE_NAME}:latest
                        docker push ${REGISTRY}/${IMAGE_NAME}:latest
                    '''
                }
            }
        }
    }
    
    post {
        always {
            sh 'docker logout $REGISTRY || true'
        }
    }
}
```

### Microservice Template

```groovy
// Jenkinsfile.microservice
pipeline {
    agent any
    
    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 45, unit: 'MINUTES')
    }
    
    stages {
        stage('Build') {
            agent { docker { image 'node:18' } }
            steps {
                sh 'npm ci'
                sh 'npm run build'
                stash includes: 'dist/**/*', name: 'build'
            }
        }
        
        stage('Test') {
            parallel {
                stage('Unit') {
                    agent { docker { image 'node:18' } }
                    steps {
                        sh 'npm ci'
                        sh 'npm run test:unit'
                    }
                }
                stage('Integration') {
                    agent { docker { image 'node:18' } }
                    steps {
                        sh 'npm ci'
                        sh 'npm run test:integration'
                    }
                }
            }
        }
        
        stage('Docker') {
            steps {
                unstash 'build'
                sh 'docker build -t my-service:${BUILD_NUMBER} .'
            }
        }
        
        stage('Deploy') {
            when { branch 'main' }
            steps {
                sh './deploy.sh'
            }
        }
    }
}
```

### Template Usage

```groovy
// Jenkinsfile - using shared library template
@Library('pipeline-templates') _

nodejsPipeline(
    nodeVersion: '18',
    deployEnvironment: 'staging'
)
```

### Best Practices

```
✅ Create templates for common patterns
✅ Use shared libraries for templates
✅ Document template parameters
✅ Keep templates simple
✅ Allow customization
✅ Version control templates
```

