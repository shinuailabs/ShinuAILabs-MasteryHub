# Lab 748: Build Triggers

## LEARNING CONCEPT

Configuring various build triggers in Jenkins.

## EXERCISE

1. Configure SCM polling
2. Set up webhooks
3. Use cron triggers

## SOLUTION

### Trigger Types

```
1. Manual trigger
2. SCM polling
3. Webhooks
4. Scheduled (cron)
5. Upstream job
6. Remote trigger (API)
```

### SCM Polling

```groovy
pipeline {
    agent any
    
    triggers {
        pollSCM('H/5 * * * *')  // Every 5 minutes
    }
    
    stages {
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
    }
}
```

### Cron Schedule

```groovy
pipeline {
    agent any
    
    triggers {
        cron('H 2 * * *')  // Daily at 2 AM
    }
    
    stages {
        stage('Nightly Build') {
            steps {
                sh 'npm run build'
                sh 'npm test'
            }
        }
    }
}
```

### Cron Syntax

```
# ┌───────────── minute (0 - 59)
# │ ┌───────────── hour (0 - 23)
# │ │ ┌───────────── day of month (1 - 31)
# │ │ │ ┌───────────── month (1 - 12)
# │ │ │ │ ┌───────────── day of week (0 - 7)
# │ │ │ │ │
# * * * * *

Examples:
H * * * *       # Every hour
H/15 * * * *    # Every 15 minutes
H 2 * * *       # Daily at 2 AM
H 2 * * 1-5     # Weekdays at 2 AM
H 2 1 * *       # Monthly on 1st at 2 AM
```

### GitHub Webhook

```groovy
pipeline {
    agent any
    
    triggers {
        githubPush()
    }
    
    stages {
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
    }
}
```

### GitHub Webhook Setup

```
1. Go to GitHub repository → Settings → Webhooks
2. Add webhook:
   - Payload URL: http://jenkins.example.com/github-webhook/
   - Content type: application/json
   - Secret: (optional)
   - Events: Just the push event
```

### GitLab Webhook

```groovy
pipeline {
    agent any
    
    triggers {
        gitlab(
            triggerOnPush: true,
            triggerOnMergeRequest: true,
            branchFilterType: 'All'
        )
    }
    
    stages {
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
    }
}
```

### Upstream Trigger

```groovy
pipeline {
    agent any
    
    triggers {
        upstream(
            upstreamProjects: 'build-job',
            threshold: hudson.model.Result.SUCCESS
        )
    }
    
    stages {
        stage('Deploy') {
            steps {
                sh './deploy.sh'
            }
        }
    }
}
```

### Remote Trigger (API)

```groovy
pipeline {
    agent any
    
    triggers {
        // Enable remote trigger
    }
    
    stages {
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
    }
}
```

```bash
# Trigger via API
curl -X POST http://jenkins:8080/job/my-job/build \
    --user admin:api-token

# Trigger with parameters
curl -X POST http://jenkins:8080/job/my-job/buildWithParameters \
    --user admin:api-token \
    --data "PARAM1=value1&PARAM2=value2"

# Trigger with token
curl -X POST "http://jenkins:8080/job/my-job/build?token=BUILD_TOKEN"
```

### Generic Webhook Trigger

```groovy
pipeline {
    agent any
    
    triggers {
        GenericTrigger(
            genericVariables: [
                [key: 'ref', value: '$.ref'],
                [key: 'commit', value: '$.after']
            ],
            token: 'my-token',
            printContributedVariables: true,
            printPostContent: true
        )
    }
    
    stages {
        stage('Build') {
            steps {
                echo "Building ref: ${ref}"
                echo "Commit: ${commit}"
            }
        }
    }
}
```

### Multiple Triggers

```groovy
pipeline {
    agent any
    
    triggers {
        pollSCM('H/5 * * * *')
        cron('H 2 * * *')
        githubPush()
    }
    
    stages {
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
    }
}
```

### Best Practices

```
✅ Use webhooks over polling when possible
✅ Use H (hash) in cron for load distribution
✅ Set appropriate polling intervals
✅ Secure webhook endpoints
✅ Document trigger configuration
```

