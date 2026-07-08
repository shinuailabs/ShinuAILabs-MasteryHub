# Lab 762: Pipeline Best Practices

## LEARNING CONCEPT

Best practices for writing maintainable Jenkins pipelines.

## EXERCISE

1. Review pipeline patterns
2. Implement best practices
3. Avoid common pitfalls

## SOLUTION

### Use Declarative Syntax

```groovy
// ✅ Preferred: Declarative
pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
    }
}

// ❌ Avoid: Scripted (unless necessary)
node {
    stage('Build') {
        sh 'npm run build'
    }
}
```

### Keep Pipelines in Version Control

```groovy
// Jenkinsfile in repository root
pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
    }
}
```

### Use Shared Libraries

```groovy
// ✅ Reusable code in shared library
@Library('my-shared-library') _

buildAndDeploy(
    appName: 'my-app',
    environment: 'staging'
)

// ❌ Avoid: Duplicating code across pipelines
```

### Configure Timeouts

```groovy
pipeline {
    agent any
    
    options {
        timeout(time: 30, unit: 'MINUTES')
    }
    
    stages {
        stage('Build') {
            options {
                timeout(time: 10, unit: 'MINUTES')
            }
            steps {
                sh 'npm run build'
            }
        }
    }
}
```

### Clean Workspace

```groovy
pipeline {
    agent any
    
    options {
        skipDefaultCheckout()
    }
    
    stages {
        stage('Checkout') {
            steps {
                cleanWs()
                checkout scm
            }
        }
    }
    
    post {
        cleanup {
            cleanWs()
        }
    }
}
```

### Use Credentials Properly

```groovy
// ✅ Use credentials binding
pipeline {
    agent any
    
    stages {
        stage('Deploy') {
            steps {
                withCredentials([
                    string(credentialsId: 'api-token', variable: 'TOKEN')
                ]) {
                    sh '''
                        set +x
                        curl -H "Authorization: $TOKEN" https://api.example.com
                    '''
                }
            }
        }
    }
}

// ❌ Never hardcode credentials
// sh 'curl -H "Authorization: secret123" ...'
```

### Handle Errors Gracefully

```groovy
pipeline {
    agent any
    
    stages {
        stage('Test') {
            steps {
                catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                    sh 'npm test'
                }
            }
        }
    }
    
    post {
        failure {
            slackSend(color: 'danger', message: 'Build failed')
        }
    }
}
```

### Use Meaningful Stage Names

```groovy
// ✅ Clear, descriptive names
pipeline {
    agent any
    stages {
        stage('Install Dependencies') { ... }
        stage('Run Unit Tests') { ... }
        stage('Build Docker Image') { ... }
        stage('Deploy to Staging') { ... }
    }
}

// ❌ Avoid vague names
// stage('Step 1') { ... }
// stage('Do stuff') { ... }
```

### Parallelize When Possible

```groovy
pipeline {
    agent any
    
    stages {
        stage('Test') {
            parallel {
                stage('Unit Tests') {
                    steps { sh 'npm run test:unit' }
                }
                stage('Integration Tests') {
                    steps { sh 'npm run test:integration' }
                }
                stage('Lint') {
                    steps { sh 'npm run lint' }
                }
            }
        }
    }
}
```

### Archive Artifacts and Test Results

```groovy
pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
        
        stage('Test') {
            steps {
                sh 'npm test'
            }
        }
    }
    
    post {
        always {
            junit 'test-results/*.xml'
            archiveArtifacts artifacts: 'dist/**/*', fingerprint: true
        }
    }
}
```

### Use Build Retention

```groovy
pipeline {
    agent any
    
    options {
        buildDiscarder(logRotator(
            numToKeepStr: '10',
            artifactNumToKeepStr: '5'
        ))
    }
    
    stages { ... }
}
```

### Don't Build on Controller

```groovy
// ✅ Use agents
pipeline {
    agent { label 'build-agent' }
    stages { ... }
}

// Or Docker
pipeline {
    agent {
        docker { image 'node:18' }
    }
    stages { ... }
}
```

### Checklist

```
Pipeline Structure:
□ Use declarative syntax
□ Store in version control
□ Use shared libraries
□ Meaningful stage names

Configuration:
□ Set timeouts
□ Configure build retention
□ Use credentials binding
□ Clean workspace

Best Practices:
□ Parallelize tests
□ Archive artifacts
□ Publish test results
□ Handle errors gracefully
□ Notify on failures

Avoid:
□ Hardcoded credentials
□ Building on controller
□ Infinite loops
□ Large artifacts in workspace
□ Duplicate code
```

### Anti-Patterns

```groovy
// ❌ Don't use sleep for waiting
sleep 60

// ✅ Use waitUntil or proper triggers
waitUntil {
    def status = sh(script: 'curl -s http://app/health', returnStatus: true)
    return status == 0
}

// ❌ Don't ignore errors silently
sh 'npm test || true'

// ✅ Handle errors properly
catchError(buildResult: 'UNSTABLE') {
    sh 'npm test'
}
```

