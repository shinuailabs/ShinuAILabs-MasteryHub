# Lab 760: Post Actions

## LEARNING CONCEPT

Using post actions for cleanup and notifications.

## EXERCISE

1. Configure post conditions
2. Implement cleanup
3. Set up notifications

## SOLUTION

### Post Conditions

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
        always {
            echo 'This always runs'
        }
        success {
            echo 'Build succeeded'
        }
        failure {
            echo 'Build failed'
        }
        unstable {
            echo 'Build is unstable'
        }
        aborted {
            echo 'Build was aborted'
        }
        changed {
            echo 'Build status changed from previous'
        }
        fixed {
            echo 'Build was fixed (previous was failure)'
        }
        regression {
            echo 'Build regressed (previous was success)'
        }
        cleanup {
            echo 'Cleanup runs after all other post conditions'
        }
    }
}
```

### Cleanup Pattern

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
            steps {
                sh 'npm test'
            }
        }
    }
    
    post {
        always {
            // Archive test results
            junit 'test-results/*.xml'
            
            // Archive artifacts
            archiveArtifacts artifacts: 'dist/**/*', allowEmptyArchive: true
            
            // Publish HTML report
            publishHTML([
                reportDir: 'coverage',
                reportFiles: 'index.html',
                reportName: 'Coverage Report'
            ])
        }
        
        cleanup {
            // Clean workspace
            cleanWs()
        }
    }
}
```

### Notification Pattern

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
            slackSend(
                channel: '#builds',
                color: 'good',
                message: "✅ Build Succeeded: ${env.JOB_NAME} #${env.BUILD_NUMBER}"
            )
        }
        
        failure {
            slackSend(
                channel: '#builds',
                color: 'danger',
                message: "❌ Build Failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}"
            )
            
            emailext(
                subject: "Build Failed: ${env.JOB_NAME}",
                body: "Check console output: ${env.BUILD_URL}",
                to: 'team@example.com'
            )
        }
        
        fixed {
            slackSend(
                channel: '#builds',
                color: 'good',
                message: "🔧 Build Fixed: ${env.JOB_NAME} #${env.BUILD_NUMBER}"
            )
        }
    }
}
```

### Stage-Level Post

```groovy
pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
                sh 'npm run build'
            }
            post {
                success {
                    echo 'Build stage succeeded'
                    archiveArtifacts artifacts: 'dist/**/*'
                }
                failure {
                    echo 'Build stage failed'
                }
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
    }
}
```

### Conditional Post Actions

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
        always {
            script {
                if (env.BRANCH_NAME == 'main') {
                    // Only notify for main branch
                    slackSend(message: "Main branch build: ${currentBuild.result}")
                }
            }
        }
        
        failure {
            script {
                // Get committer email
                def committer = sh(
                    script: 'git log -1 --format="%ae"',
                    returnStdout: true
                ).trim()
                
                mail(
                    to: committer,
                    subject: "Your commit broke the build",
                    body: "Check: ${env.BUILD_URL}"
                )
            }
        }
    }
}
```

### Docker Cleanup

```groovy
pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
                sh 'docker build -t my-app .'
            }
        }
        
        stage('Test') {
            steps {
                sh 'docker run my-app npm test'
            }
        }
    }
    
    post {
        always {
            sh 'docker rmi my-app || true'
            sh 'docker system prune -f || true'
        }
        
        cleanup {
            cleanWs()
        }
    }
}
```

### Comprehensive Example

```groovy
pipeline {
    agent any
    
    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
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
            junit allowEmptyResults: true, testResults: 'test-results/*.xml'
            archiveArtifacts artifacts: 'dist/**/*', allowEmptyArchive: true
        }
        
        success {
            script {
                if (env.BRANCH_NAME == 'main') {
                    slackSend(color: 'good', message: "Deployed: ${env.BUILD_URL}")
                }
            }
        }
        
        failure {
            slackSend(color: 'danger', message: "Failed: ${env.BUILD_URL}")
            emailext(
                subject: "Build Failed: ${env.JOB_NAME}",
                body: '${BUILD_LOG, maxLines=50}',
                to: 'team@example.com'
            )
        }
        
        cleanup {
            cleanWs()
        }
    }
}
```

### Best Practices

```
✅ Always clean workspace
✅ Archive artifacts in 'always'
✅ Notify on failure
✅ Use 'cleanup' for final cleanup
✅ Handle errors gracefully
✅ Keep post actions fast
```

