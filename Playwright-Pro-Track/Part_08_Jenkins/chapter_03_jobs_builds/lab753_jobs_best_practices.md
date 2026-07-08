# Lab 753: Jobs Best Practices

## LEARNING CONCEPT

Best practices for creating and managing Jenkins jobs.

## EXERCISE

1. Review job organization
2. Implement naming conventions
3. Apply configuration standards

## SOLUTION

### Job Naming Conventions

```
Recommended patterns:
- project-name-job-type
- team-project-environment
- service-action-target

Examples:
- webapp-build-test
- api-deploy-staging
- mobile-release-ios
- infra-terraform-apply
```

### Folder Organization

```
Jenkins/
├── Frontend/
│   ├── webapp-build
│   ├── webapp-test
│   └── webapp-deploy
├── Backend/
│   ├── api-build
│   ├── api-test
│   └── api-deploy
├── Infrastructure/
│   ├── terraform-plan
│   └── terraform-apply
└── Shared/
    ├── security-scan
    └── dependency-check
```

### Standard Pipeline Template

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
            post {
                always {
                    junit 'test-results/*.xml'
                }
            }
        }
        
        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                sh './deploy.sh'
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
        failure {
            slackSend(color: 'danger', message: "Build failed: ${env.JOB_NAME}")
        }
    }
}
```

### Configuration Standards

```groovy
// Always include these options
options {
    // Limit build history
    buildDiscarder(logRotator(numToKeepStr: '10'))
    
    // Prevent hanging builds
    timeout(time: 30, unit: 'MINUTES')
    
    // Add timestamps to logs
    timestamps()
    
    // Prevent concurrent builds (if needed)
    disableConcurrentBuilds()
    
    // Skip default checkout (if using custom)
    skipDefaultCheckout()
}
```

### Error Handling

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
                        currentBuild.result = 'FAILURE'
                        throw e
                    }
                }
            }
        }
    }
    
    post {
        failure {
            // Notify on failure
            slackSend(message: "Build failed")
        }
        cleanup {
            // Always cleanup
            cleanWs()
        }
    }
}
```

### Reusable Functions

```groovy
// vars/buildApp.groovy (Shared Library)
def call(Map config) {
    pipeline {
        agent any
        
        stages {
            stage('Build') {
                steps {
                    sh "npm run build"
                }
            }
            
            stage('Test') {
                steps {
                    sh "npm test"
                }
            }
            
            stage('Deploy') {
                when {
                    expression { config.deploy == true }
                }
                steps {
                    sh "./deploy.sh ${config.environment}"
                }
            }
        }
    }
}

// Jenkinsfile
@Library('my-shared-library') _

buildApp(
    deploy: true,
    environment: 'staging'
)
```

### Security Best Practices

```groovy
pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
                // Use credentials binding
                withCredentials([
                    string(credentialsId: 'api-key', variable: 'API_KEY')
                ]) {
                    sh 'npm run build'
                }
            }
        }
    }
}

// Don't do this:
// sh "curl -H 'Authorization: ${API_KEY}' ..."  // Exposed in logs

// Do this:
// sh '''
//     set +x
//     curl -H "Authorization: $API_KEY" ...
// '''
```

### Documentation

```groovy
pipeline {
    agent any
    
    // Add job description
    // Configure in Jenkins UI or use description setter
    
    stages {
        stage('Build') {
            steps {
                // Document what this stage does
                echo 'Building application...'
                sh 'npm run build'
            }
        }
    }
}
```

### Checklist

```
Job Configuration:
□ Meaningful name
□ Clear description
□ Appropriate folder
□ Build retention configured
□ Timeout set
□ Notifications configured

Pipeline:
□ Use declarative syntax
□ Store in version control
□ Include error handling
□ Clean workspace
□ Archive artifacts
□ Publish test results

Security:
□ Use credentials plugin
□ Don't expose secrets
□ Limit permissions
□ Audit access
```

### Anti-Patterns to Avoid

```
❌ Hardcoded credentials
❌ No timeout configured
❌ No build retention
❌ Building on controller
❌ No error handling
❌ No notifications
❌ Unclear job names
❌ No documentation
```

