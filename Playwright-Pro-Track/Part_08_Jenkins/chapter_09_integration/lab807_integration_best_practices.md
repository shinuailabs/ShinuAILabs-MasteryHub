# Lab 807: Integration Best Practices

## LEARNING CONCEPT

Best practices for Jenkins integrations.

## EXERCISE

1. Review integration patterns
2. Implement best practices
3. Secure integrations

## SOLUTION

### Integration Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Jenkins                             │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐   │
│  │ GitHub  │  │ Slack   │  │ Jira    │  │ AWS     │   │
│  │ Plugin  │  │ Plugin  │  │ Plugin  │  │ Plugin  │   │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘   │
└───────┼────────────┼────────────┼────────────┼─────────┘
        │            │            │            │
        ▼            ▼            ▼            ▼
    ┌───────┐   ┌───────┐   ┌───────┐   ┌───────┐
    │GitHub │   │ Slack │   │ Jira  │   │  AWS  │
    └───────┘   └───────┘   └───────┘   └───────┘
```

### Credential Management

```groovy
// ✅ Good: Use credentials binding
withCredentials([
    string(credentialsId: 'api-token', variable: 'TOKEN')
]) {
    sh 'curl -H "Authorization: Bearer $TOKEN" ...'
}

// ❌ Bad: Hardcoded credentials
sh 'curl -H "Authorization: Bearer abc123" ...'
```

### Error Handling

```groovy
stage('Integration') {
    steps {
        script {
            try {
                // Integration call
                slackSend(message: 'Build started')
            } catch (Exception e) {
                echo "Slack notification failed: ${e.message}"
                // Don't fail build for notification failure
            }
        }
    }
}
```

### Retry Logic

```groovy
stage('Deploy') {
    steps {
        retry(3) {
            timeout(time: 5, unit: 'MINUTES') {
                sh 'kubectl apply -f deployment.yaml'
            }
        }
    }
}
```

### Webhook Security

```
Secure webhooks:
1. Use HTTPS
2. Verify signatures
3. Use secrets
4. Whitelist IPs
5. Validate payloads
```

### Rate Limiting

```groovy
// Avoid hitting API rate limits
stage('Batch Updates') {
    steps {
        script {
            def issues = ['PROJ-1', 'PROJ-2', 'PROJ-3']
            
            issues.each { issue ->
                jiraComment(issueKey: issue, body: 'Build complete')
                sleep(time: 1, unit: 'SECONDS')  // Rate limit
            }
        }
    }
}
```

### Idempotent Operations

```groovy
// ✅ Idempotent: Can run multiple times safely
sh 'kubectl apply -f deployment.yaml'

// ❌ Not idempotent: May fail on second run
sh 'kubectl create -f deployment.yaml'
```

### Timeout Configuration

```groovy
stage('External Service') {
    options {
        timeout(time: 10, unit: 'MINUTES')
    }
    steps {
        // External service call
    }
}
```

### Logging and Debugging

```groovy
stage('Integration') {
    steps {
        script {
            echo "Calling external service..."
            
            def response = httpRequest(
                url: 'https://api.example.com/endpoint',
                httpMode: 'POST',
                contentType: 'APPLICATION_JSON',
                requestBody: '{"key": "value"}',
                validResponseCodes: '200:299',
                consoleLogResponseBody: true  // Log response
            )
            
            echo "Response: ${response.status}"
        }
    }
}
```

### Health Checks

```groovy
stage('Verify Integration') {
    steps {
        script {
            // Check GitHub connection
            def github = httpRequest(
                url: 'https://api.github.com/rate_limit',
                authentication: 'github-token'
            )
            
            if (github.status != 200) {
                error 'GitHub integration unhealthy'
            }
        }
    }
}
```

### Notification Strategy

```groovy
def notifyTeam(String status) {
    // Slack for real-time
    slackSend(
        channel: '#builds',
        message: "Build ${status}"
    )
    
    // Email for failures
    if (status == 'FAILURE') {
        emailext(
            to: 'team@example.com',
            subject: "Build Failed",
            body: "Check: ${env.BUILD_URL}"
        )
    }
    
    // Jira for tracking
    if (env.JIRA_ISSUE) {
        jiraComment(
            issueKey: env.JIRA_ISSUE,
            body: "Build ${status}"
        )
    }
}
```

### Integration Testing

```groovy
stage('Test Integrations') {
    steps {
        script {
            // Test Slack
            def slackTest = slackSend(
                channel: '#test',
                message: 'Integration test'
            )
            
            // Test AWS
            withAWS(credentials: 'aws-creds') {
                sh 'aws sts get-caller-identity'
            }
            
            // Test Kubernetes
            sh 'kubectl cluster-info'
        }
    }
}
```

### Documentation

```markdown
# Integration Documentation

## GitHub
- Webhook URL: https://jenkins.example.com/github-webhook/
- Events: push, pull_request
- Credentials: github-token

## Slack
- Workspace: company
- Channel: #builds
- Credentials: slack-bot-token

## AWS
- Region: us-east-1
- Credentials: aws-credentials
- Services: S3, ECR, ECS
```

### Checklist

```
Security:
□ Use credential binding
□ Secure webhooks
□ Rotate credentials
□ Audit access

Reliability:
□ Implement retries
□ Set timeouts
□ Handle errors gracefully
□ Use idempotent operations

Monitoring:
□ Log integration calls
□ Monitor rate limits
□ Health checks
□ Alert on failures
```

### Best Practices Summary

```
✅ Use credential binding
✅ Implement error handling
✅ Set appropriate timeouts
✅ Use retry logic
✅ Secure webhooks
✅ Monitor integrations
✅ Document configurations
✅ Test integrations regularly
```

