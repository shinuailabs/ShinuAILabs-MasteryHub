# Lab 751: Build Notifications

## LEARNING CONCEPT

Configuring build notifications in Jenkins.

## EXERCISE

1. Set up email notifications
2. Configure Slack notifications
3. Use custom notifications

## SOLUTION

### Email Notification

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
        failure {
            mail(
                to: 'team@example.com',
                subject: "Build Failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: "Check console output: ${env.BUILD_URL}"
            )
        }
    }
}
```

### Extended Email

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
            emailext(
                subject: "${currentBuild.result}: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: '''
                    <h2>Build ${BUILD_STATUS}</h2>
                    <p>Job: ${JOB_NAME}</p>
                    <p>Build: #${BUILD_NUMBER}</p>
                    <p>Duration: ${BUILD_DURATION}</p>
                    <p><a href="${BUILD_URL}">View Build</a></p>
                ''',
                mimeType: 'text/html',
                to: 'team@example.com',
                attachLog: true,
                compressLog: true
            )
        }
    }
}
```

### Slack Notification

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
                message: "Build Succeeded: ${env.JOB_NAME} #${env.BUILD_NUMBER}"
            )
        }
        failure {
            slackSend(
                channel: '#builds',
                color: 'danger',
                message: "Build Failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}"
            )
        }
    }
}
```

### Slack with Blocks

```groovy
post {
    always {
        script {
            def color = currentBuild.result == 'SUCCESS' ? 'good' : 'danger'
            def status = currentBuild.result ?: 'SUCCESS'
            
            slackSend(
                channel: '#builds',
                color: color,
                blocks: [
                    [
                        type: 'header',
                        text: [
                            type: 'plain_text',
                            text: "${status}: ${env.JOB_NAME}"
                        ]
                    ],
                    [
                        type: 'section',
                        fields: [
                            [type: 'mrkdwn', text: "*Build:* #${env.BUILD_NUMBER}"],
                            [type: 'mrkdwn', text: "*Duration:* ${currentBuild.durationString}"]
                        ]
                    ],
                    [
                        type: 'actions',
                        elements: [
                            [
                                type: 'button',
                                text: [type: 'plain_text', text: 'View Build'],
                                url: env.BUILD_URL
                            ]
                        ]
                    ]
                ]
            )
        }
    }
}
```

### Microsoft Teams

```groovy
post {
    always {
        office365ConnectorSend(
            webhookUrl: 'https://outlook.office.com/webhook/...',
            message: "Build ${currentBuild.result}: ${env.JOB_NAME}",
            status: currentBuild.result,
            color: currentBuild.result == 'SUCCESS' ? '00FF00' : 'FF0000'
        )
    }
}
```

### Custom Webhook

```groovy
post {
    always {
        script {
            def payload = [
                job: env.JOB_NAME,
                build: env.BUILD_NUMBER,
                status: currentBuild.result,
                url: env.BUILD_URL
            ]
            
            httpRequest(
                url: 'https://api.example.com/webhook',
                httpMode: 'POST',
                contentType: 'APPLICATION_JSON',
                requestBody: groovy.json.JsonOutput.toJson(payload)
            )
        }
    }
}
```

### Conditional Notifications

```groovy
post {
    success {
        echo 'Build succeeded!'
    }
    unstable {
        slackSend(color: 'warning', message: 'Build unstable')
    }
    failure {
        slackSend(color: 'danger', message: 'Build failed')
        mail(to: 'team@example.com', subject: 'Build Failed', body: '...')
    }
    changed {
        // Notify when status changes
        slackSend(message: "Build status changed to ${currentBuild.result}")
    }
    fixed {
        slackSend(color: 'good', message: 'Build is fixed!')
    }
    regression {
        slackSend(color: 'danger', message: 'Build regression detected')
    }
}
```

### Notification Helper Function

```groovy
def notifyBuild(String status) {
    def color = status == 'SUCCESS' ? 'good' : 'danger'
    
    slackSend(
        channel: '#builds',
        color: color,
        message: "${status}: ${env.JOB_NAME} #${env.BUILD_NUMBER}\n${env.BUILD_URL}"
    )
    
    if (status != 'SUCCESS') {
        mail(
            to: 'team@example.com',
            subject: "${status}: ${env.JOB_NAME}",
            body: "Check: ${env.BUILD_URL}"
        )
    }
}

pipeline {
    agent any
    stages {
        stage('Build') {
            steps { sh 'npm run build' }
        }
    }
    post {
        success { notifyBuild('SUCCESS') }
        failure { notifyBuild('FAILURE') }
    }
}
```

### Best Practices

```
✅ Notify on failures
✅ Include build URL
✅ Use appropriate channels
✅ Don't over-notify
✅ Include relevant context
✅ Use color coding
```

