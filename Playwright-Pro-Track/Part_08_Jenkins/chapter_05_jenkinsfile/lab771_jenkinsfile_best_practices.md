# Lab 771: Jenkinsfile Best Practices

## LEARNING CONCEPT

Best practices for writing maintainable Jenkinsfiles.

## EXERCISE

1. Review coding standards
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

### Keep Jenkinsfile in Repository

```
✅ Store Jenkinsfile in repository root
✅ Version control all changes
✅ Review changes in PRs
✅ Use consistent naming
```

### Use Meaningful Names

```groovy
// ✅ Good stage names
stages {
    stage('Install Dependencies') { ... }
    stage('Run Unit Tests') { ... }
    stage('Build Docker Image') { ... }
    stage('Deploy to Staging') { ... }
}

// ❌ Bad stage names
stages {
    stage('Step 1') { ... }
    stage('Do stuff') { ... }
}
```

### Configure Timeouts

```groovy
pipeline {
    agent any

    options {
        timeout(time: 30, unit: 'MINUTES')
    }

    stages {
        stage('Long Running Task') {
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

### Use Credentials Properly

```groovy
// ✅ Use credentials binding
withCredentials([string(credentialsId: 'api-token', variable: 'TOKEN')]) {
    sh '''
        set +x
        curl -H "Authorization: $TOKEN" https://api.example.com
    '''
}

// ❌ Never hardcode secrets
// sh 'curl -H "Authorization: secret123" ...'
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

### Use Shared Libraries

```groovy
// ✅ Reusable code
@Library('my-shared-library') _

buildAndDeploy(appName: 'my-app')

// ❌ Duplicating code across Jenkinsfiles
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

### Archive Artifacts and Results

```groovy
post {
    always {
        junit 'test-results/*.xml'
        archiveArtifacts artifacts: 'dist/**/*', fingerprint: true
        publishHTML([
            reportDir: 'coverage',
            reportFiles: 'index.html',
            reportName: 'Coverage'
        ])
    }
}
```

### Use Build Retention

```groovy
options {
    buildDiscarder(logRotator(
        numToKeepStr: '10',
        artifactNumToKeepStr: '5'
    ))
}
```

### Parallelize When Possible

```groovy
stage('Test') {
    parallel {
        stage('Unit') { steps { sh 'npm run test:unit' } }
        stage('Integration') { steps { sh 'npm run test:integration' } }
        stage('E2E') { steps { sh 'npm run test:e2e' } }
    }
}
```

### Checklist

```
Structure:
□ Use declarative syntax
□ Store in version control
□ Meaningful stage names
□ Use shared libraries

Configuration:
□ Set timeouts
□ Configure build retention
□ Use credentials binding
□ Clean workspace

Quality:
□ Validate before commit
□ Handle errors gracefully
□ Archive artifacts
□ Publish test results
□ Notify on failures

Avoid:
□ Hardcoded credentials
□ Building on controller
□ Infinite loops
□ Large artifacts
□ Duplicate code
```

### Anti-Patterns

```groovy
// ❌ Don't use sleep for waiting
sleep 60

// ✅ Use waitUntil
waitUntil {
    def status = sh(script: 'curl -s http://app/health', returnStatus: true)
    return status == 0
}

// ❌ Don't ignore errors
sh 'npm test || true'

// ✅ Handle properly
catchError(buildResult: 'UNSTABLE') {
    sh 'npm test'
}

// ❌ Don't run on controller
agent any  // May run on controller

// ✅ Use specific agents
agent { label 'build-agent' }
```