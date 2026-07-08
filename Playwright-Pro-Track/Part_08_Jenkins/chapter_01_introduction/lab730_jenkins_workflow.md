# Lab 730: Jenkins Workflow

## LEARNING CONCEPT

Understanding typical Jenkins CI/CD workflows.

## EXERCISE

1. Learn CI workflow
2. Understand CD workflow
3. Implement complete pipeline

## SOLUTION

### Basic CI Workflow

```
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│  Code   │───▶│  Build  │───▶│  Test   │───▶│ Report  │
│  Push   │    │         │    │         │    │         │
└─────────┘    └─────────┘    └─────────┘    └─────────┘
```

### CI Pipeline Example

```groovy
pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
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
        
        stage('Report') {
            steps {
                junit 'test-results/*.xml'
            }
        }
    }
}
```

### CD Workflow

```
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│   CI    │───▶│ Staging │───▶│   QA    │───▶│  Prod   │
│ Build   │    │ Deploy  │    │ Tests   │    │ Deploy  │
└─────────┘    └─────────┘    └─────────┘    └─────────┘
```

### CD Pipeline Example

```groovy
pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
                sh 'npm ci && npm run build'
            }
        }
        
        stage('Test') {
            steps {
                sh 'npm test'
            }
        }
        
        stage('Deploy Staging') {
            steps {
                sh './deploy.sh staging'
            }
        }
        
        stage('Integration Tests') {
            steps {
                sh 'npm run test:e2e'
            }
        }
        
        stage('Deploy Production') {
            when {
                branch 'main'
            }
            steps {
                input message: 'Deploy to production?'
                sh './deploy.sh production'
            }
        }
    }
}
```

### Parallel Workflow

```groovy
pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
                sh 'npm ci && npm run build'
            }
        }
        
        stage('Test') {
            parallel {
                stage('Unit Tests') {
                    steps {
                        sh 'npm run test:unit'
                    }
                }
                stage('Integration Tests') {
                    steps {
                        sh 'npm run test:integration'
                    }
                }
                stage('E2E Tests') {
                    steps {
                        sh 'npm run test:e2e'
                    }
                }
            }
        }
    }
}
```

### Multi-Branch Workflow

```groovy
pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
                sh 'npm ci && npm run build'
            }
        }
        
        stage('Deploy') {
            when {
                anyOf {
                    branch 'main'
                    branch 'develop'
                }
            }
            steps {
                script {
                    def env = (BRANCH_NAME == 'main') ? 'prod' : 'staging'
                    sh "./deploy.sh ${env}"
                }
            }
        }
    }
}
```

### Workflow Best Practices

```
✅ Fail fast - run quick tests first
✅ Parallelize where possible
✅ Use stages for visibility
✅ Implement proper error handling
✅ Add manual approval for production
✅ Archive artifacts
✅ Clean up resources
```

