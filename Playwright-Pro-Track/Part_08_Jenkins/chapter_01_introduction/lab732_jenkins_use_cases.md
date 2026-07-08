# Lab 732: Jenkins Use Cases

## LEARNING CONCEPT

Real-world Jenkins use cases and implementations.

## EXERCISE

1. Explore CI use cases
2. Learn CD use cases
3. Understand automation scenarios

## SOLUTION

### Use Case 1: Web Application CI/CD

```groovy
pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
                sh 'npm ci'
                sh 'npm run build'
            }
        }
        
        stage('Test') {
            parallel {
                stage('Unit') {
                    steps { sh 'npm run test:unit' }
                }
                stage('E2E') {
                    steps { sh 'npm run test:e2e' }
                }
            }
        }
        
        stage('Deploy') {
            when { branch 'main' }
            steps {
                sh 'npm run deploy'
            }
        }
    }
}
```

### Use Case 2: Microservices Deployment

```groovy
pipeline {
    agent any
    
    stages {
        stage('Build Images') {
            parallel {
                stage('API') {
                    steps {
                        dir('api') {
                            sh 'docker build -t api:${BUILD_NUMBER} .'
                        }
                    }
                }
                stage('Web') {
                    steps {
                        dir('web') {
                            sh 'docker build -t web:${BUILD_NUMBER} .'
                        }
                    }
                }
            }
        }
        
        stage('Deploy') {
            steps {
                sh 'kubectl apply -f k8s/'
            }
        }
    }
}
```

### Use Case 3: Mobile App Build

```groovy
pipeline {
    agent { label 'macos' }
    
    stages {
        stage('iOS Build') {
            steps {
                sh 'xcodebuild -workspace App.xcworkspace -scheme App'
            }
        }
        
        stage('Android Build') {
            agent { label 'linux' }
            steps {
                sh './gradlew assembleRelease'
            }
        }
        
        stage('Distribute') {
            steps {
                sh 'fastlane distribute'
            }
        }
    }
}
```

### Use Case 4: Playwright Test Automation

```groovy
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
            post {
                always {
                    publishHTML([
                        reportDir: 'playwright-report',
                        reportFiles: 'index.html',
                        reportName: 'Playwright Report'
                    ])
                }
            }
        }
    }
}
```

### Use Case 5: Infrastructure as Code

```groovy
pipeline {
    agent any
    
    stages {
        stage('Validate') {
            steps {
                sh 'terraform validate'
                sh 'terraform plan -out=tfplan'
            }
        }
        
        stage('Apply') {
            when { branch 'main' }
            steps {
                input 'Apply infrastructure changes?'
                sh 'terraform apply tfplan'
            }
        }
    }
}
```

### Use Case 6: Scheduled Jobs

```groovy
pipeline {
    agent any
    
    triggers {
        cron('0 2 * * *')  // Daily at 2 AM
    }
    
    stages {
        stage('Backup') {
            steps {
                sh './backup-database.sh'
            }
        }
        
        stage('Cleanup') {
            steps {
                sh './cleanup-old-files.sh'
            }
        }
        
        stage('Report') {
            steps {
                emailext subject: 'Daily Backup Complete',
                    body: 'Backup completed successfully',
                    to: 'team@example.com'
            }
        }
    }
}
```

### Common Patterns

```
✅ Build → Test → Deploy
✅ Parallel testing
✅ Multi-environment deployment
✅ Scheduled automation
✅ Infrastructure provisioning
✅ Release management
```

