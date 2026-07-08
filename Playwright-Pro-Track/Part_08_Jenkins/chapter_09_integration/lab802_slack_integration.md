# Lab 802: Slack Integration

## LEARNING CONCEPT

Integrating Jenkins with Slack for notifications.

## EXERCISE

1. Configure Slack app
2. Send build notifications
3. Create rich messages

## SOLUTION

### Install Slack Plugin

```
Manage Jenkins → Plugins → Available
Install: Slack Notification Plugin
```

### Create Slack App

```
1. Go to api.slack.com/apps
2. Create New App → From scratch
3. Name: Jenkins CI
4. Workspace: Your workspace

OAuth & Permissions:
  Bot Token Scopes:
    - chat:write
    - chat:write.public
    - files:write (for file uploads)

Install to Workspace
Copy Bot User OAuth Token
```

### Configure Jenkins

```
Manage Jenkins → System → Slack

Workspace: your-workspace
Credential: slack-bot-token (Secret text)
Default channel: #builds
```

### Basic Notification

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

### Rich Message with Blocks

```groovy
post {
    always {
        script {
            def color = currentBuild.result == 'SUCCESS' ? 'good' : 'danger'
            def status = currentBuild.result ?: 'SUCCESS'
            def emoji = status == 'SUCCESS' ? ':white_check_mark:' : ':x:'
            
            slackSend(
                channel: '#builds',
                color: color,
                blocks: [
                    [
                        type: 'header',
                        text: [
                            type: 'plain_text',
                            text: "${emoji} ${status}: ${env.JOB_NAME}",
                            emoji: true
                        ]
                    ],
                    [
                        type: 'section',
                        fields: [
                            [type: 'mrkdwn', text: "*Build:*\n#${env.BUILD_NUMBER}"],
                            [type: 'mrkdwn', text: "*Branch:*\n${env.BRANCH_NAME}"],
                            [type: 'mrkdwn', text: "*Duration:*\n${currentBuild.durationString}"],
                            [type: 'mrkdwn', text: "*Triggered by:*\n${currentBuild.getBuildCauses()[0].shortDescription}"]
                        ]
                    ],
                    [
                        type: 'actions',
                        elements: [
                            [
                                type: 'button',
                                text: [type: 'plain_text', text: 'View Build'],
                                url: env.BUILD_URL
                            ],
                            [
                                type: 'button',
                                text: [type: 'plain_text', text: 'View Console'],
                                url: "${env.BUILD_URL}console"
                            ]
                        ]
                    ]
                ]
            )
        }
    }
}
```

### Notification Helper Function

```groovy
def notifySlack(String status) {
    def colorMap = [
        'SUCCESS': 'good',
        'FAILURE': 'danger',
        'UNSTABLE': 'warning',
        'ABORTED': '#808080'
    ]
    
    def emojiMap = [
        'SUCCESS': ':white_check_mark:',
        'FAILURE': ':x:',
        'UNSTABLE': ':warning:',
        'ABORTED': ':no_entry:'
    ]
    
    slackSend(
        channel: '#builds',
        color: colorMap[status],
        message: "${emojiMap[status]} *${status}*: <${env.BUILD_URL}|${env.JOB_NAME} #${env.BUILD_NUMBER}>"
    )
}

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
        success { notifySlack('SUCCESS') }
        failure { notifySlack('FAILURE') }
        unstable { notifySlack('UNSTABLE') }
        aborted { notifySlack('ABORTED') }
    }
}
```

### Thread Replies

```groovy
pipeline {
    agent any
    
    stages {
        stage('Start') {
            steps {
                script {
                    def response = slackSend(
                        channel: '#builds',
                        message: "Build Started: ${env.JOB_NAME} #${env.BUILD_NUMBER}"
                    )
                    env.SLACK_THREAD_TS = response.threadId
                }
            }
        }
        
        stage('Build') {
            steps {
                slackSend(
                    channel: '#builds',
                    message: 'Building...',
                    timestamp: env.SLACK_THREAD_TS
                )
                sh 'npm run build'
            }
        }
    }
    
    post {
        always {
            slackSend(
                channel: '#builds',
                message: "Build ${currentBuild.result}",
                timestamp: env.SLACK_THREAD_TS
            )
        }
    }
}
```

### Upload Files

```groovy
post {
    failure {
        slackUploadFile(
            channel: '#builds',
            filePath: 'test-results/report.html',
            initialComment: 'Test report attached'
        )
    }
}
```

### Conditional Notifications

```groovy
post {
    failure {
        script {
            // Only notify on main branch
            if (env.BRANCH_NAME == 'main') {
                slackSend(
                    channel: '#alerts',
                    color: 'danger',
                    message: "@channel Production build failed!"
                )
            }
        }
    }
}
```

### Best Practices

```
✅ Use appropriate channels
✅ Include build URL
✅ Use color coding
✅ Don't over-notify
✅ Use threads for updates
✅ Include relevant context
```

