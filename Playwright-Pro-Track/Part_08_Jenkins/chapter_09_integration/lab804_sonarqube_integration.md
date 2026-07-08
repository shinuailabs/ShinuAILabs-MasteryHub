# Lab 804: SonarQube Integration

## LEARNING CONCEPT

Integrating Jenkins with SonarQube for code quality.

## EXERCISE

1. Configure SonarQube
2. Run analysis
3. Implement quality gates

## SOLUTION

### Install SonarQube Plugin

```
Manage Jenkins → Plugins → Available
Install: SonarQube Scanner Plugin
```

### Configure SonarQube Server

```
Manage Jenkins → System → SonarQube servers

SonarQube installations → Add:
  Name: SonarQube
  Server URL: https://sonar.example.com
  Server authentication token: sonar-token
```

### Configure SonarQube Scanner

```
Manage Jenkins → Tools → SonarQube Scanner

SonarQube Scanner installations → Add:
  Name: SonarScanner
  Install automatically: ✓
  Version: 5.0.1
```

### Basic Analysis

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
        
        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh '''
                        sonar-scanner \
                            -Dsonar.projectKey=my-project \
                            -Dsonar.sources=src \
                            -Dsonar.tests=tests
                    '''
                }
            }
        }
    }
}
```

### Quality Gate

```groovy
pipeline {
    agent any
    
    stages {
        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh 'npm run sonar'
                }
            }
        }
        
        stage('Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }
    }
}
```

### sonar-project.properties

```properties
# sonar-project.properties
sonar.projectKey=my-project
sonar.projectName=My Project
sonar.projectVersion=1.0

sonar.sources=src
sonar.tests=tests
sonar.exclusions=**/node_modules/**,**/dist/**

sonar.javascript.lcov.reportPaths=coverage/lcov.info
sonar.testExecutionReportPaths=test-results/sonar-report.xml

sonar.sourceEncoding=UTF-8
```

### Analysis with Coverage

```groovy
pipeline {
    agent any
    
    stages {
        stage('Test') {
            steps {
                sh 'npm ci'
                sh 'npm run test:coverage'
            }
        }
        
        stage('SonarQube') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh '''
                        sonar-scanner \
                            -Dsonar.projectKey=my-project \
                            -Dsonar.sources=src \
                            -Dsonar.tests=tests \
                            -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info
                    '''
                }
            }
        }
        
        stage('Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }
    }
}
```

### PR Analysis

```groovy
pipeline {
    agent any
    
    stages {
        stage('SonarQube PR Analysis') {
            when {
                changeRequest()
            }
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh '''
                        sonar-scanner \
                            -Dsonar.projectKey=my-project \
                            -Dsonar.pullrequest.key=${CHANGE_ID} \
                            -Dsonar.pullrequest.branch=${CHANGE_BRANCH} \
                            -Dsonar.pullrequest.base=${CHANGE_TARGET}
                    '''
                }
            }
        }
        
        stage('SonarQube Branch Analysis') {
            when {
                not { changeRequest() }
            }
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh '''
                        sonar-scanner \
                            -Dsonar.projectKey=my-project \
                            -Dsonar.branch.name=${BRANCH_NAME}
                    '''
                }
            }
        }
    }
}
```

### TypeScript/JavaScript Analysis

```groovy
stage('SonarQube') {
    steps {
        withSonarQubeEnv('SonarQube') {
            sh '''
                sonar-scanner \
                    -Dsonar.projectKey=my-ts-project \
                    -Dsonar.sources=src \
                    -Dsonar.tests=tests \
                    -Dsonar.typescript.tsconfigPath=tsconfig.json \
                    -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info \
                    -Dsonar.testExecutionReportPaths=test-results/sonar.xml
                    -Dsonar.eslint.reportPaths=eslint-report.json
            '''
        }
    }
}
```

### Custom Quality Gate

```
SonarQube → Quality Gates → Create

Conditions:
- Coverage < 80% → Fail
- Duplicated Lines > 3% → Fail
- Maintainability Rating worse than A → Fail
- Reliability Rating worse than A → Fail
- Security Rating worse than A → Fail
```

### Webhook Configuration

```
SonarQube → Administration → Webhooks

Create webhook:
  Name: Jenkins
  URL: https://jenkins.example.com/sonarqube-webhook/
  Secret: (optional)
```

### Best Practices

```
✅ Use quality gates
✅ Include test coverage
✅ Analyze PRs separately
✅ Configure webhooks
✅ Set appropriate thresholds
✅ Review results regularly
```

