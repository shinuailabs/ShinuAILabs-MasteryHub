# Part 03: Playwright with Jenkins

## 📚 Overview
Integrating Playwright tests with Jenkins enables automated browser testing in CI/CD pipelines.

---

## 🎯 Key Concepts

### 1. Basic Playwright Pipeline

```groovy
// Jenkinsfile
pipeline {
    agent any
    
    tools {
        nodejs 'Node18'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }
        
        stage('Install Browsers') {
            steps {
                sh 'npx playwright install --with-deps'
            }
        }
        
        stage('Run Tests') {
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

### 2. Docker-Based Pipeline

```groovy
pipeline {
    agent {
        docker {
            image 'mcr.microsoft.com/playwright:v1.40.0-jammy'
            args '-u root'
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
            archiveArtifacts artifacts: 'test-results/**', allowEmptyArchive: true
        }
    }
}
```

### 3. Multi-Browser Testing

```groovy
pipeline {
    agent any
    
    stages {
        stage('Test') {
            parallel {
                stage('Chromium') {
                    agent {
                        docker { image 'mcr.microsoft.com/playwright:v1.40.0-jammy' }
                    }
                    steps {
                        sh 'npm ci'
                        sh 'npx playwright test --project=chromium'
                    }
                }
                stage('Firefox') {
                    agent {
                        docker { image 'mcr.microsoft.com/playwright:v1.40.0-jammy' }
                    }
                    steps {
                        sh 'npm ci'
                        sh 'npx playwright test --project=firefox'
                    }
                }
                stage('WebKit') {
                    agent {
                        docker { image 'mcr.microsoft.com/playwright:v1.40.0-jammy' }
                    }
                    steps {
                        sh 'npm ci'
                        sh 'npx playwright test --project=webkit'
                    }
                }
            }
        }
    }
}
```

### 4. Sharded Testing

```groovy
pipeline {
    agent none
    
    stages {
        stage('Test') {
            matrix {
                axes {
                    axis {
                        name 'SHARD'
                        values '1', '2', '3', '4'
                    }
                }
                agent {
                    docker { image 'mcr.microsoft.com/playwright:v1.40.0-jammy' }
                }
                stages {
                    stage('Run Shard') {
                        steps {
                            sh 'npm ci'
                            sh "npx playwright test --shard=${SHARD}/4"
                        }
                    }
                }
            }
        }
    }
}
```

### 5. Environment Configuration

```groovy
pipeline {
    agent any
    
    environment {
        CI = 'true'
        BASE_URL = 'http://staging.example.com'
        PLAYWRIGHT_BROWSERS_PATH = '/ms-playwright'
    }
    
    stages {
        stage('Test') {
            environment {
                // Credentials from Jenkins
                TEST_USER = credentials('test-user')
                API_KEY = credentials('api-key')
            }
            steps {
                sh '''
                    export TEST_EMAIL=$TEST_USER_USR
                    export TEST_PASSWORD=$TEST_USER_PSW
                    npx playwright test
                '''
            }
        }
    }
}
```

### 6. Test Reports

```groovy
pipeline {
    agent any
    
    stages {
        stage('Test') {
            steps {
                sh 'npx playwright test --reporter=junit,html'
            }
        }
    }
    
    post {
        always {
            // JUnit results
            junit 'test-results/junit.xml'
            
            // HTML report
            publishHTML([
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright Report'
            ])
            
            // Archive artifacts
            archiveArtifacts artifacts: 'test-results/**', allowEmptyArchive: true
        }
    }
}
```

### 7. Retry on Failure

```groovy
pipeline {
    agent any
    
    stages {
        stage('Test') {
            steps {
                retry(2) {
                    sh 'npx playwright test'
                }
            }
        }
    }
}

// Or use Playwright's built-in retry
// playwright.config.ts: retries: 2
```

### 8. Scheduled Runs

```groovy
pipeline {
    agent any
    
    triggers {
        // Run nightly at 2 AM
        cron('0 2 * * *')
    }
    
    stages {
        stage('Full Regression') {
            steps {
                sh 'npx playwright test'
            }
        }
    }
}
```

---

## 💻 Practice Exercises

1. Create Playwright pipeline
2. Use Docker agent
3. Run parallel browsers
4. Configure sharding
5. Set up test reports

---

## ✅ Best Practices

- ✅ Use Docker for consistency
- ✅ Run browsers in parallel
- ✅ Archive test artifacts
- ✅ Publish HTML reports
- ❌ Don't skip browser install
- ❌ Avoid headed mode in CI

---

## 📝 Quick Reference

```groovy
// Docker agent
agent {
    docker { image 'mcr.microsoft.com/playwright:v1.40.0-jammy' }
}

// Run tests
sh 'npx playwright test'
sh 'npx playwright test --project=chromium'
sh 'npx playwright test --shard=1/4'

// Reports
junit 'test-results/junit.xml'
publishHTML([reportDir: 'playwright-report', ...])
```

