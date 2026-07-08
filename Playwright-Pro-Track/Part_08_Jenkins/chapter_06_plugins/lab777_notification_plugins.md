# Lab 777: Notification Plugins

## LEARNING CONCEPT

Using plugins for build notifications.

## EXERCISE

1. Configure Slack notifications
2. Set up email notifications
3. Use Microsoft Teams

## SOLUTION

### Slack Notification Plugin

```
Install: Slack Notification Plugin

Configure:
Manage Jenkins → System → Slack

Workspace: my-workspace
Credential: slack-token (Secret text)
Default channel: #builds
```

### Create Slack App

```
1. Go to api.slack.com/apps
2. Create New App
3. Add Bot Token Scopes:
   - chat:write
   - chat:write.public
4. Install to Workspace
5. Copy Bot User OAuth Token
6. Add as Jenkins credential
```

### Basic Slack Notification

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

### Email Extension Plugin

```
Install: Email Extension Plugin

Configure:
Manage Jenkins → System → Extended E-mail Notification

SMTP server: smtp.example.com
SMTP Port: 587
Credentials: email-credentials
Use SSL: ✓
Default Recipients: team@example.com
```

### Basic Email Notification

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
                subject: "Build Failed: ${env.JOB_NAME}",
                body: "Check console output: ${env.BUILD_URL}"
            )
        }
    }
}
```

### Extended Email

```groovy
post {
    always {
        emailext(
            subject: "${currentBuild.result}: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
            body: '''
                <h2>Build ${BUILD_STATUS}</h2>
                <p><b>Job:</b> ${JOB_NAME}</p>
                <p><b>Build:</b> #${BUILD_NUMBER}</p>
                <p><b>Duration:</b> ${BUILD_DURATION}</p>
                <p><a href="${BUILD_URL}">View Build</a></p>
                <h3>Changes:</h3>
                ${CHANGES}
            ''',
            mimeType: 'text/html',
            to: 'team@example.com',
            attachLog: true,
            compressLog: true
        )
    }
}
```

### Microsoft Teams Plugin

```
Install: Office 365 Connector Plugin

Configure webhook in Teams:
1. Channel → Connectors
2. Add Incoming Webhook
3. Copy webhook URL
```

### Teams Notification

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

### Notification Helper Function

```groovy
def notifyBuild(String status) {
    def color = status == 'SUCCESS' ? 'good' : 'danger'
    
    // Slack
    slackSend(
        channel: '#builds',
        color: color,
        message: "${status}: ${env.JOB_NAME} #${env.BUILD_NUMBER}"
    )
    
    // Email on failure
    if (status != 'SUCCESS') {
        emailext(
            subject: "${status}: ${env.JOB_NAME}",
            body: "Check: ${env.BUILD_URL}",
            to: 'team@example.com'
        )
    }
}

pipeline {
    agent any
    stages {
        stage('Build') { steps { sh 'npm run build' } }
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

