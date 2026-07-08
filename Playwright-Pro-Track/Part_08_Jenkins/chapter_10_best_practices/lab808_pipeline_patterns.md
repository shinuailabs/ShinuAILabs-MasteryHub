# Lab 808: Pipeline Patterns

## LEARNING CONCEPT

Common Jenkins pipeline patterns and anti-patterns.

## EXERCISE

1. Learn pipeline patterns
2. Avoid anti-patterns
3. Implement best practices

## SOLUTION

### Standard Pipeline Structure

```groovy
pipeline {
    agent any
    
    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
        timestamps()
        disableConcurrentBuilds()
    }
    
    environment {
        APP_NAME = 'my-app'
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
        success {
            echo 'Build succeeded!'
        }
        failure {
            echo 'Build failed!'
        }
    }
}
```

### Shared Library Pattern

```groovy
// vars/standardPipeline.groovy
def call(Map config) {
    pipeline {
        agent any
        
        stages {
            stage('Build') {
                steps {
                    sh config.buildCommand ?: 'npm run build'
                }
            }
            
            stage('Test') {
                steps {
                    sh config.testCommand ?: 'npm test'
                }
            }
            
            stage('Deploy') {
                when { branch 'main' }
                steps {
                    sh config.deployCommand ?: './deploy.sh'
                }
            }
        }
    }
}

// Jenkinsfile
@Library('my-shared-library') _

standardPipeline(
    buildCommand: 'npm run build',
    testCommand: 'npm test',
    deployCommand: './deploy.sh'
)
```

### Stage Reuse Pattern

```groovy
def buildStage(String environment) {
    return {
        stage("Build ${environment}") {
            steps {
                sh "npm run build:${environment}"
            }
        }
    }
}

pipeline {
    agent any
    
    stages {
        stage('Build All') {
            parallel {
                stage('Dev') { steps { buildStage('dev') } }
                stage('Staging') { steps { buildStage('staging') } }
                stage('Prod') { steps { buildStage('prod') } }
            }
        }
    }
}
```

### Approval Gate Pattern

```groovy
stage('Deploy to Production') {
    when { branch 'main' }
    steps {
        input(
            message: 'Deploy to production?',
            ok: 'Deploy',
            submitter: 'admin,deployers'
        )
        sh './deploy-prod.sh'
    }
}
```

### Feature Flag Pattern

```groovy
pipeline {
    agent any
    
    parameters {
        booleanParam(name: 'RUN_INTEGRATION_TESTS', defaultValue: true)
        booleanParam(name: 'DEPLOY_TO_STAGING', defaultValue: true)
    }
    
    stages {
        stage('Integration Tests') {
            when {
                expression { params.RUN_INTEGRATION_TESTS }
            }
            steps {
                sh 'npm run test:integration'
            }
        }
        
        stage('Deploy Staging') {
            when {
                expression { params.DEPLOY_TO_STAGING }
            }
            steps {
                sh './deploy-staging.sh'
            }
        }
    }
}
```

### Anti-Pattern: Long Pipelines

```groovy
// ❌ Bad: Everything in one pipeline
pipeline {
    stages {
        stage('Build') { /* 50 lines */ }
        stage('Test') { /* 100 lines */ }
        stage('Deploy') { /* 75 lines */ }
        // ... 500+ lines total
    }
}

// ✅ Good: Use shared libraries
@Library('my-library') _

pipeline {
    stages {
        stage('Build') { steps { buildApp() } }
        stage('Test') { steps { testApp() } }
        stage('Deploy') { steps { deployApp() } }
    }
}
```

### Anti-Pattern: Hardcoded Values

```groovy
// ❌ Bad: Hardcoded values
sh 'docker push myregistry.com/myapp:1.0.0'

// ✅ Good: Use environment variables
environment {
    REGISTRY = 'myregistry.com'
    IMAGE_TAG = "${env.BUILD_NUMBER}"
}
stages {
    stage('Push') {
        steps {
            sh "docker push ${REGISTRY}/myapp:${IMAGE_TAG}"
        }
    }
}
```

### Anti-Pattern: No Error Handling

```groovy
// ❌ Bad: No error handling
sh 'npm test'

// ✅ Good: Proper error handling
script {
    try {
        sh 'npm test'
    } catch (Exception e) {
        currentBuild.result = 'UNSTABLE'
        echo "Tests failed: ${e.message}"
    }
}
```

### Anti-Pattern: No Cleanup

```groovy
// ❌ Bad: No cleanup
pipeline {
    stages {
        stage('Build') { steps { sh 'npm run build' } }
    }
}

// ✅ Good: Always cleanup
pipeline {
    stages {
        stage('Build') { steps { sh 'npm run build' } }
    }
    post {
        always {
            cleanWs()
            sh 'docker system prune -f'
        }
    }
}
```

### Conditional Execution Pattern

```groovy
stage('Deploy') {
    when {
        allOf {
            branch 'main'
            not { changeRequest() }
            expression { currentBuild.result == null || currentBuild.result == 'SUCCESS' }
        }
    }
    steps {
        sh './deploy.sh'
    }
}
```

### Best Practices Summary

```
✅ Use declarative pipelines
✅ Use shared libraries
✅ Parameterize pipelines
✅ Implement proper error handling
✅ Always clean up
✅ Use environment variables
✅ Keep pipelines short
✅ Document complex logic
```

