# Part 07: Notifications

## 📚 Overview
Jenkins notifications keep teams informed about build status through various channels.

---

## 🎯 Key Concepts

### 1. Email Notifications

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
        failure {
            mail(
                to: 'team@example.com',
                subject: "FAILED: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: """
                    Build failed!
                    
                    Job: ${env.JOB_NAME}
                    Build: ${env.BUILD_NUMBER}
                    URL: ${env.BUILD_URL}
                    
                    Check console output for details.
                """
            )
        }
        success {
            mail(
                to: 'team@example.com',
                subject: "SUCCESS: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: "Build succeeded! ${env.BUILD_URL}"
            )
        }
    }
}
```

### 2. Extended Email

```groovy
post {
    always {
        emailext(
            subject: "${currentBuild.result}: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
            body: '''${SCRIPT, template="groovy-html.template"}''',
            to: 'team@example.com',
            attachLog: true,
            attachmentsPattern: 'test-results/**/*.png',
            mimeType: 'text/html'
        )
    }
}
```

### 3. Slack Notifications

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
        success {
            slackSend(
                channel: '#builds',
                color: 'good',
                message: "✅ Build Succeeded: ${env.JOB_NAME} #${env.BUILD_NUMBER}\n${env.BUILD_URL}"
            )
        }
        failure {
            slackSend(
                channel: '#builds',
                color: 'danger',
                message: "❌ Build Failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}\n${env.BUILD_URL}"
            )
        }
        unstable {
            slackSend(
                channel: '#builds',
                color: 'warning',
                message: "⚠️ Build Unstable: ${env.JOB_NAME} #${env.BUILD_NUMBER}\n${env.BUILD_URL}"
            )
        }
    }
}
```

### 4. Microsoft Teams

```groovy
post {
    failure {
        office365ConnectorSend(
            webhookUrl: "${TEAMS_WEBHOOK}",
            message: "Build Failed: ${env.JOB_NAME}",
            status: "Failure",
            color: "d63333"
        )
    }
    success {
        office365ConnectorSend(
            webhookUrl: "${TEAMS_WEBHOOK}",
            message: "Build Succeeded: ${env.JOB_NAME}",
            status: "Success",
            color: "2dc72d"
        )
    }
}
```

### 5. Custom Webhook

```groovy
post {
    always {
        script {
            def payload = [
                job: env.JOB_NAME,
                build: env.BUILD_NUMBER,
                status: currentBuild.result,
                url: env.BUILD_URL,
                duration: currentBuild.durationString
            ]
            
            httpRequest(
                url: 'https://webhook.example.com/jenkins',
                httpMode: 'POST',
                contentType: 'APPLICATION_JSON',
                requestBody: groovy.json.JsonOutput.toJson(payload)
            )
        }
    }
}
```

### 6. Conditional Notifications

```groovy
post {
    always {
        script {
            // Only notify on status change
            if (currentBuild.result != currentBuild.previousBuild?.result) {
                slackSend(
                    channel: '#builds',
                    message: "Build status changed: ${currentBuild.result}"
                )
            }
        }
    }
    
    failure {
        script {
            // Only notify on first failure
            if (currentBuild.previousBuild?.result == 'SUCCESS') {
                mail(
                    to: 'team@example.com',
                    subject: "Build Started Failing: ${env.JOB_NAME}",
                    body: "The build has started failing. Please investigate."
                )
            }
        }
    }
    
    fixed {
        // Notify when build is fixed
        slackSend(
            channel: '#builds',
            color: 'good',
            message: "🎉 Build Fixed: ${env.JOB_NAME}"
        )
    }
}
```

### 7. Rich Notifications

```groovy
post {
    always {
        script {
            def testResults = junit(testResults: '**/junit.xml', allowEmptyResults: true)
            
            def message = """
                *${currentBuild.result}*: ${env.JOB_NAME} #${env.BUILD_NUMBER}
                
                📊 *Test Results:*
                • Total: ${testResults.totalCount}
                • Passed: ${testResults.passCount}
                • Failed: ${testResults.failCount}
                • Skipped: ${testResults.skipCount}
                
                🔗 <${env.BUILD_URL}|View Build>
            """
            
            slackSend(
                channel: '#builds',
                color: currentBuild.result == 'SUCCESS' ? 'good' : 'danger',
                message: message
            )
        }
    }
}
```

### 8. GitHub Status

```groovy
pipeline {
    agent any
    
    stages {
        stage('Test') {
            steps {
                // Set pending status
                githubNotify(
                    status: 'PENDING',
                    description: 'Tests running...'
                )
                
                sh 'npx playwright test'
            }
        }
    }
    
    post {
        success {
            githubNotify(status: 'SUCCESS', description: 'Tests passed')
        }
        failure {
            githubNotify(status: 'FAILURE', description: 'Tests failed')
        }
    }
}
```

---

## 💻 Practice Exercises

1. Configure email notifications
2. Set up Slack integration
3. Create custom webhooks
4. Implement conditional notifications
5. Add rich test summaries

---

## ✅ Best Practices

- ✅ Notify on status changes
- ✅ Include relevant details
- ✅ Use appropriate channels
- ✅ Add links to builds
- ❌ Don't spam notifications
- ❌ Avoid sensitive data in messages

---

## 📝 Quick Reference

```groovy
// Email
mail to: 'email', subject: 'subject', body: 'body'

// Slack
slackSend channel: '#channel', message: 'message', color: 'good'

// Teams
office365ConnectorSend webhookUrl: 'url', message: 'message'

// Post conditions
post {
    success { }
    failure { }
    unstable { }
    fixed { }
    always { }
}
```

