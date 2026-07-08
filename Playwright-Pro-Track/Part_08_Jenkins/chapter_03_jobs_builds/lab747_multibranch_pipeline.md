# Lab 747: Multibranch Pipeline

## LEARNING CONCEPT

Creating multibranch pipelines for branch-based workflows.

## EXERCISE

1. Create multibranch pipeline
2. Configure branch discovery
3. Handle different branches

## SOLUTION

### Create Multibranch Pipeline

```
1. Dashboard → New Item
2. Enter name: my-multibranch
3. Select "Multibranch Pipeline"
4. Click OK
```

### Branch Sources Configuration

```
Branch Sources:
  Git:
    Project Repository: https://github.com/user/repo.git
    Credentials: github-credentials
    
  Behaviors:
    - Discover branches
    - Discover tags
    - Filter by name (with wildcards)
      Include: main develop feature/*
```

### GitHub Branch Source

```
Branch Sources:
  GitHub:
    Credentials: github-credentials
    Owner: username
    Repository: repo-name
    
  Behaviors:
    - Discover branches
    - Discover pull requests from origin
    - Discover pull requests from forks
```

### Build Configuration

```
Build Configuration:
  Mode: by Jenkinsfile
  Script Path: Jenkinsfile
```

### Scan Triggers

```
Scan Multibranch Pipeline Triggers:
  □ Periodically if not otherwise run
    Interval: 1 hour
  
  □ Scan by webhook
    (Configure GitHub webhook)
```

### Jenkinsfile for Multibranch

```groovy
pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
                echo "Building branch: ${env.BRANCH_NAME}"
                sh 'npm ci'
                sh 'npm run build'
            }
        }
        
        stage('Test') {
            steps {
                sh 'npm test'
            }
        }
        
        stage('Deploy Staging') {
            when {
                branch 'develop'
            }
            steps {
                echo 'Deploying to staging...'
                sh './deploy.sh staging'
            }
        }
        
        stage('Deploy Production') {
            when {
                branch 'main'
            }
            steps {
                input message: 'Deploy to production?'
                echo 'Deploying to production...'
                sh './deploy.sh production'
            }
        }
    }
}
```

### Branch-Specific Configuration

```groovy
pipeline {
    agent any
    
    environment {
        DEPLOY_ENV = "${env.BRANCH_NAME == 'main' ? 'production' : 'staging'}"
    }
    
    stages {
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
        
        stage('Deploy') {
            when {
                anyOf {
                    branch 'main'
                    branch 'develop'
                }
            }
            steps {
                echo "Deploying to ${DEPLOY_ENV}"
                sh "./deploy.sh ${DEPLOY_ENV}"
            }
        }
    }
}
```

### Pull Request Handling

```groovy
pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
        
        stage('Test') {
            steps {
                sh 'npm test'
            }
        }
        
        stage('PR Checks') {
            when {
                changeRequest()
            }
            steps {
                echo "PR from ${env.CHANGE_BRANCH} to ${env.CHANGE_TARGET}"
                sh 'npm run lint'
                sh 'npm run security-check'
            }
        }
    }
}
```

### When Conditions

```groovy
// Branch name
when { branch 'main' }

// Branch pattern
when { branch pattern: "release-\\d+", comparator: "REGEXP" }

// Multiple branches
when {
    anyOf {
        branch 'main'
        branch 'develop'
    }
}

// Pull request
when { changeRequest() }

// Tag
when { tag "v*" }

// Environment
when { environment name: 'DEPLOY', value: 'true' }
```

### Orphaned Item Strategy

```
Orphaned Item Strategy:
  Discard old items:
    Days to keep old items: 7
    Max # of old items to keep: 10
```

### Branch Properties

```groovy
// Jenkinsfile
properties([
    buildDiscarder(logRotator(numToKeepStr: '5')),
    disableConcurrentBuilds()
])

pipeline {
    agent any
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
✅ Use consistent Jenkinsfile across branches
✅ Configure branch discovery appropriately
✅ Set up orphaned item cleanup
✅ Use when conditions for branch-specific steps
✅ Configure webhooks for immediate builds
✅ Handle pull requests appropriately
```

