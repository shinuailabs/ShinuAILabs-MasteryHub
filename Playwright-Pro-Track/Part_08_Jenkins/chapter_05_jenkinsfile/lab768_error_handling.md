# Lab 768: Error Handling

## LEARNING CONCEPT

Handling errors and failures in Jenkinsfile.

## EXERCISE

1. Implement try-catch
2. Use catchError
3. Handle stage failures

## SOLUTION

### Try-Catch in Script

```groovy
pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
                script {
                    try {
                        sh 'npm run build'
                    } catch (Exception e) {
                        echo "Build failed: ${e.message}"
                        currentBuild.result = 'FAILURE'
                        throw e
                    }
                }
            }
        }
    }
}
```

### Try-Catch-Finally

```groovy
pipeline {
    agent any
    
    stages {
        stage('Test') {
            steps {
                script {
                    try {
                        sh 'npm test'
                    } catch (Exception e) {
                        echo "Tests failed: ${e.message}"
                        currentBuild.result = 'UNSTABLE'
                    } finally {
                        // Always runs
                        junit 'test-results/*.xml'
                    }
                }
            }
        }
    }
}
```

### catchError Step

```groovy
pipeline {
    agent any
    
    stages {
        stage('Test') {
            steps {
                // Continue pipeline even if tests fail
                catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                    sh 'npm test'
                }
            }
        }
        
        stage('Deploy') {
            // This stage runs even if Test failed
            steps {
                echo 'Deploying...'
            }
        }
    }
}
```

### catchError Options

```groovy
pipeline {
    agent any
    
    stages {
        stage('Lint') {
            steps {
                // Mark build unstable but continue
                catchError(buildResult: 'UNSTABLE', stageResult: 'UNSTABLE') {
                    sh 'npm run lint'
                }
            }
        }
        
        stage('Test') {
            steps {
                // Mark build failed but continue
                catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
                    sh 'npm test'
                }
            }
        }
        
        stage('Report') {
            steps {
                // Always generate report
                echo 'Generating report...'
            }
        }
    }
}
```

### warnError Step

```groovy
pipeline {
    agent any
    
    stages {
        stage('Optional Check') {
            steps {
                // Warn but don't fail
                warnError('Security scan had issues') {
                    sh 'npm audit'
                }
            }
        }
    }
}
```

### Retry Step

```groovy
pipeline {
    agent any
    
    stages {
        stage('Deploy') {
            steps {
                retry(3) {
                    sh './deploy.sh'
                }
            }
        }
        
        stage('Health Check') {
            steps {
                retry(count: 5, conditions: [kubernetesAgent()]) {
                    sh 'curl -f http://app.example.com/health'
                }
            }
        }
    }
}
```

### Timeout with Retry

```groovy
pipeline {
    agent any
    
    stages {
        stage('Deploy') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    retry(3) {
                        sh './deploy.sh'
                    }
                }
            }
        }
    }
}
```

### waitUntil Step

```groovy
pipeline {
    agent any
    
    stages {
        stage('Wait for Service') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitUntil {
                        script {
                            def status = sh(
                                script: 'curl -s -o /dev/null -w "%{http_code}" http://app/health',
                                returnStdout: true
                            ).trim()
                            return status == '200'
                        }
                    }
                }
            }
        }
    }
}
```

### Error Step

```groovy
pipeline {
    agent any
    
    stages {
        stage('Validate') {
            steps {
                script {
                    def version = readFile('VERSION').trim()
                    
                    if (!version.matches(/^\d+\.\d+\.\d+$/)) {
                        error "Invalid version format: ${version}"
                    }
                    
                    if (!fileExists('package.json')) {
                        error 'package.json not found!'
                    }
                }
            }
        }
    }
}
```

### Unstable Step

```groovy
pipeline {
    agent any
    
    stages {
        stage('Test') {
            steps {
                script {
                    def result = sh(script: 'npm test', returnStatus: true)
                    
                    if (result != 0) {
                        unstable 'Some tests failed'
                    }
                }
            }
        }
    }
}
```

### Handle Specific Errors

```groovy
pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
                script {
                    try {
                        sh 'npm run build'
                    } catch (hudson.AbortException e) {
                        echo 'Build was aborted'
                        throw e
                    } catch (Exception e) {
                        echo "Build error: ${e.class.name}"
                        throw e
                    }
                }
            }
        }
    }
}
```

### Post Conditions for Errors

```groovy
pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
    }
    
    post {
        success {
            echo 'Build succeeded'
        }
        failure {
            echo 'Build failed'
            slackSend(color: 'danger', message: 'Build failed!')
        }
        unstable {
            echo 'Build is unstable'
            slackSend(color: 'warning', message: 'Build unstable')
        }
        aborted {
            echo 'Build was aborted'
        }
        always {
            cleanWs()
        }
    }
}
```

### Best Practices

```
✅ Use catchError for non-critical steps
✅ Set appropriate build/stage results
✅ Use retry for flaky operations
✅ Set timeouts to prevent hanging
✅ Log error details
✅ Notify on failures
```

