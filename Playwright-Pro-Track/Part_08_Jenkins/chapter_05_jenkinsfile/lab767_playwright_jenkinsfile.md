# Lab 767: Playwright Jenkinsfile

## LEARNING CONCEPT

Creating Jenkinsfile for Playwright test automation.

## EXERCISE

1. Set up Playwright pipeline
2. Run tests in Docker
3. Generate reports

## SOLUTION

### Basic Playwright Pipeline

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
        }
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
```

### Playwright with All Browsers

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
            parallel {
                stage('Chromium') {
                    steps {
                        sh 'npx playwright test --project=chromium'
                    }
                }
                stage('Firefox') {
                    steps {
                        sh 'npx playwright test --project=firefox'
                    }
                }
                stage('WebKit') {
                    steps {
                        sh 'npx playwright test --project=webkit'
                    }
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

### Playwright with Sharding

```groovy
pipeline {
    agent none
    
    stages {
        stage('Install') {
            agent {
                docker { image 'mcr.microsoft.com/playwright:v1.40.0-jammy' }
            }
            steps {
                sh 'npm ci'
                stash includes: 'node_modules/**/*', name: 'node_modules'
            }
        }
        
        stage('Test') {
            parallel {
                stage('Shard 1/4') {
                    agent {
                        docker { image 'mcr.microsoft.com/playwright:v1.40.0-jammy' }
                    }
                    steps {
                        unstash 'node_modules'
                        sh 'npx playwright test --shard=1/4'
                    }
                    post {
                        always {
                            stash includes: 'test-results/**/*', name: 'results-1', allowEmpty: true
                        }
                    }
                }
                stage('Shard 2/4') {
                    agent {
                        docker { image 'mcr.microsoft.com/playwright:v1.40.0-jammy' }
                    }
                    steps {
                        unstash 'node_modules'
                        sh 'npx playwright test --shard=2/4'
                    }
                    post {
                        always {
                            stash includes: 'test-results/**/*', name: 'results-2', allowEmpty: true
                        }
                    }
                }
                stage('Shard 3/4') {
                    agent {
                        docker { image 'mcr.microsoft.com/playwright:v1.40.0-jammy' }
                    }
                    steps {
                        unstash 'node_modules'
                        sh 'npx playwright test --shard=3/4'
                    }
                    post {
                        always {
                            stash includes: 'test-results/**/*', name: 'results-3', allowEmpty: true
                        }
                    }
                }
                stage('Shard 4/4') {
                    agent {
                        docker { image 'mcr.microsoft.com/playwright:v1.40.0-jammy' }
                    }
                    steps {
                        unstash 'node_modules'
                        sh 'npx playwright test --shard=4/4'
                    }
                    post {
                        always {
                            stash includes: 'test-results/**/*', name: 'results-4', allowEmpty: true
                        }
                    }
                }
            }
        }
        
        stage('Merge Results') {
            agent any
            steps {
                unstash 'results-1'
                unstash 'results-2'
                unstash 'results-3'
                unstash 'results-4'
                sh 'npx playwright merge-reports ./test-results'
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

### Playwright with Parameters

```groovy
pipeline {
    agent {
        docker {
            image 'mcr.microsoft.com/playwright:v1.40.0-jammy'
        }
    }
    
    parameters {
        choice(name: 'BROWSER', choices: ['chromium', 'firefox', 'webkit', 'all'], description: 'Browser')
        string(name: 'BASE_URL', defaultValue: 'https://staging.example.com', description: 'Base URL')
        booleanParam(name: 'HEADED', defaultValue: false, description: 'Run headed')
    }
    
    environment {
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
                    def browserArg = params.BROWSER == 'all' ? '' : "--project=${params.BROWSER}"
                    def headedArg = params.HEADED ? '--headed' : ''
                    
                    sh "npx playwright test ${browserArg} ${headedArg}"
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
        }
    }
}
```

### Complete Playwright Pipeline

```groovy
pipeline {
    agent {
        docker {
            image 'mcr.microsoft.com/playwright:v1.40.0-jammy'
        }
    }
    
    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 60, unit: 'MINUTES')
        timestamps()
    }
    
    environment {
        CI = 'true'
        BASE_URL = 'https://staging.example.com'
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
                sh 'npx playwright test'
            }
        }
    }
    
    post {
        always {
            junit 'test-results/junit.xml'
            publishHTML([
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright Report'
            ])
            archiveArtifacts artifacts: 'test-results/**/*', allowEmptyArchive: true
        }
        failure {
            slackSend(color: 'danger', message: "Playwright tests failed: ${env.BUILD_URL}")
        }
    }
}
```

