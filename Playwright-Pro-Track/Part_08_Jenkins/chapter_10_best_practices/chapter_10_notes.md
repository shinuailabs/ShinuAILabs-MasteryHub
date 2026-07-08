# Part 10: Jenkins Best Practices

## 📚 Overview
Following Jenkins best practices ensures reliable, maintainable, and secure CI/CD pipelines.

---

## 🎯 Key Concepts

### 1. Pipeline Organization

```groovy
// ✅ Good: Declarative with clear stages
pipeline {
    agent any

    options {
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10'))
        disableConcurrentBuilds()
    }

    stages {
        stage('Checkout') { steps { checkout scm } }
        stage('Install') { steps { sh 'npm ci' } }
        stage('Lint') { steps { sh 'npm run lint' } }
        stage('Test') { steps { sh 'npm test' } }
        stage('Build') { steps { sh 'npm run build' } }
    }
}

// ❌ Bad: Monolithic stage
pipeline {
    agent any
    stages {
        stage('Everything') {
            steps {
                sh 'npm ci && npm run lint && npm test && npm run build'
            }
        }
    }
}
```

### 2. Security Best Practices

```groovy
pipeline {
    agent any

    environment {
        // ✅ Use credentials binding
        API_KEY = credentials('api-key-id')
    }

    stages {
        stage('Deploy') {
            steps {
                // ✅ Use withCredentials for sensitive operations
                withCredentials([string(credentialsId: 'secret', variable: 'SECRET')]) {
                    sh 'deploy.sh'
                }

                // ❌ Never echo credentials
                // sh "echo $API_KEY"

                // ❌ Never hardcode secrets
                // sh 'curl -H "Authorization: Bearer abc123"'
            }
        }
    }
}
```

### 3. Error Handling

```groovy
pipeline {
    agent any

    stages {
        stage('Test') {
            steps {
                script {
                    try {
                        sh 'npx playwright test'
                    } catch (Exception e) {
                        currentBuild.result = 'UNSTABLE'
                        echo "Tests failed: ${e.message}"
                    }
                }
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'test-results/**', allowEmptyArchive: true
        }
        failure {
            notifyTeam('Build failed')
        }
        cleanup {
            cleanWs()
        }
    }
}
```

### 4. Performance Optimization

```groovy
pipeline {
    agent any

    options {
        // Skip default checkout for custom handling
        skipDefaultCheckout()
    }

    stages {
        stage('Checkout') {
            steps {
                // Shallow clone for faster checkout
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/main']],
                    extensions: [[$class: 'CloneOption', depth: 1, shallow: true]],
                    userRemoteConfigs: [[url: 'https://github.com/repo.git']]
                ])
            }
        }

        stage('Install') {
            steps {
                // Use npm ci for faster, reproducible installs
                sh 'npm ci --prefer-offline'
            }
        }

        stage('Test') {
            steps {
                // Run tests in parallel
                sh 'npx playwright test --workers=4'
            }
        }
    }
}
```

### 5. Maintainability

```groovy
// ✅ Use shared libraries for reusable code
@Library('my-shared-library') _

// ✅ Use parameters for flexibility
pipeline {
    agent any

    parameters {
        choice(name: 'ENV', choices: ['dev', 'staging', 'prod'])
        booleanParam(name: 'RUN_E2E', defaultValue: true)
    }

    stages {
        stage('Test') {
            when { expression { params.RUN_E2E } }
            steps {
                sh "BASE_URL=${getUrl(params.ENV)} npx playwright test"
            }
        }
    }
}

// ✅ Extract complex logic to functions
def getUrl(env) {
    def urls = [
        dev: 'https://dev.example.com',
        staging: 'https://staging.example.com',
        prod: 'https://example.com'
    ]
    return urls[env]
}
```

### 6. Resource Management

```groovy
pipeline {
    agent any

    options {
        // Prevent concurrent builds
        disableConcurrentBuilds()

        // Set timeout
        timeout(time: 1, unit: 'HOURS')

        // Limit build history
        buildDiscarder(logRotator(
            numToKeepStr: '10',
            artifactNumToKeepStr: '5',
            daysToKeepStr: '30'
        ))
    }

    stages {
        stage('Test') {
            options {
                // Stage-level timeout
                timeout(time: 30, unit: 'MINUTES')
            }
            steps {
                sh 'npx playwright test'
            }
        }
    }
}
```

### 7. Documentation

```groovy
/**
 * Main CI/CD Pipeline for Project X
 *
 * Stages:
 * 1. Checkout - Clone repository
 * 2. Install - Install dependencies
 * 3. Test - Run Playwright tests
 * 4. Build - Build application
 * 5. Deploy - Deploy to environment
 *
 * Parameters:
 * - ENV: Target environment (dev/staging/prod)
 * - RUN_E2E: Whether to run E2E tests
 *
 * Required Credentials:
 * - deploy-credentials: Deployment credentials
 * - slack-webhook: Slack notification webhook
 */
pipeline {
    agent any
    // ... pipeline definition
}
```

### 8. Monitoring and Alerts

```groovy
pipeline {
    agent any

    stages {
        stage('Test') {
            steps {
                sh 'npx playwright test'
            }
        }
    }

    post {
        always {
            // Publish metrics
            script {
                def duration = currentBuild.duration / 1000
                echo "Build duration: ${duration}s"
            }
        }

        failure {
            // Alert on failure
            slackSend(
                channel: '#alerts',
                color: 'danger',
                message: "🚨 Build Failed: ${env.JOB_NAME}"
            )
        }

        fixed {
            // Notify when fixed
            slackSend(
                channel: '#builds',
                color: 'good',
                message: "✅ Build Fixed: ${env.JOB_NAME}"
            )
        }
    }
}
```

---

## 💻 Practice Exercises

1. Organize pipeline stages
2. Implement security practices
3. Add error handling
4. Optimize performance
5. Set up monitoring

---

## ✅ Best Practices Summary

- ✅ Use declarative pipelines
- ✅ Store Jenkinsfile in repo
- ✅ Use credentials binding
- ✅ Set timeouts and limits
- ✅ Use shared libraries
- ✅ Document pipelines
- ❌ Don't hardcode secrets
- ❌ Avoid monolithic stages
- ❌ Don't skip error handling
- ❌ Avoid unlimited retention

---

## 📝 Quick Reference

```groovy
// Essential options
options {
    timeout(time: 30, unit: 'MINUTES')
    buildDiscarder(logRotator(numToKeepStr: '10'))
    disableConcurrentBuilds()
}

// Post actions
post {
    always { archiveArtifacts }
    success { notify }
    failure { alert }
    cleanup { cleanWs() }
}

// Credentials
environment { CRED = credentials('id') }
withCredentials([...]) { }
```