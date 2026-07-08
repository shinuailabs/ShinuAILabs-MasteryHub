# Lab 799: GitHub Integration

## LEARNING CONCEPT

Integrating Jenkins with GitHub for CI/CD.

## EXERCISE

1. Configure GitHub webhooks
2. Set up PR builds
3. Update commit status

## SOLUTION

### Install GitHub Plugins

```
Required plugins:
- GitHub plugin
- GitHub Branch Source Plugin
- GitHub API Plugin
```

### Configure GitHub Server

```
Manage Jenkins → System → GitHub

GitHub Servers → Add GitHub Server:
  Name: GitHub
  API URL: https://api.github.com
  Credentials: github-token (Secret text)
  Manage hooks: ✓
```

### Create GitHub Token

```
GitHub → Settings → Developer settings → Personal access tokens

Scopes needed:
- repo (full control)
- admin:repo_hook (webhooks)
- admin:org_hook (org webhooks)

Or use GitHub App for better security
```

### Configure Webhook

```
Repository → Settings → Webhooks → Add webhook

Payload URL: https://jenkins.example.com/github-webhook/
Content type: application/json
Secret: (optional, for security)
Events: 
  - Push events
  - Pull request events
```

### Multibranch Pipeline

```
New Item → Multibranch Pipeline

Branch Sources → Add source → GitHub

Credentials: github-credentials
Repository HTTPS URL: https://github.com/user/repo.git
Behaviors:
  - Discover branches
  - Discover pull requests from origin
  - Discover pull requests from forks
```

### Jenkinsfile for GitHub

```groovy
pipeline {
    agent any
    
    triggers {
        githubPush()
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
    }
    
    post {
        always {
            // Update GitHub commit status
            script {
                def status = currentBuild.result ?: 'SUCCESS'
                githubNotify(
                    status: status,
                    description: "Build ${status}",
                    context: 'jenkins/build'
                )
            }
        }
    }
}
```

### GitHub Commit Status

```groovy
pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
                githubNotify(
                    status: 'PENDING',
                    description: 'Build in progress',
                    context: 'jenkins/build'
                )
                
                sh 'npm run build'
            }
        }
    }
    
    post {
        success {
            githubNotify(
                status: 'SUCCESS',
                description: 'Build passed',
                context: 'jenkins/build'
            )
        }
        failure {
            githubNotify(
                status: 'FAILURE',
                description: 'Build failed',
                context: 'jenkins/build'
            )
        }
    }
}
```

### PR Builds

```groovy
pipeline {
    agent any
    
    stages {
        stage('PR Check') {
            when {
                changeRequest()
            }
            steps {
                echo "Building PR #${env.CHANGE_ID}"
                echo "Target: ${env.CHANGE_TARGET}"
                echo "Author: ${env.CHANGE_AUTHOR}"
                
                sh 'npm test'
            }
        }
        
        stage('Main Build') {
            when {
                branch 'main'
            }
            steps {
                sh 'npm run build'
                sh 'npm run deploy'
            }
        }
    }
}
```

### Branch Protection

```
GitHub → Repository → Settings → Branches → Branch protection rules

Require status checks:
  ✓ jenkins/build
  ✓ jenkins/test

Require branches to be up to date
```

### GitHub Actions Trigger

```groovy
// Trigger GitHub Actions from Jenkins
pipeline {
    agent any
    
    stages {
        stage('Trigger GitHub Action') {
            steps {
                withCredentials([string(credentialsId: 'github-token', variable: 'TOKEN')]) {
                    sh '''
                        curl -X POST \
                            -H "Authorization: token $TOKEN" \
                            -H "Accept: application/vnd.github.v3+json" \
                            https://api.github.com/repos/user/repo/dispatches \
                            -d '{"event_type": "jenkins-trigger"}'
                    '''
                }
            }
        }
    }
}
```

### GitHub Release

```groovy
stage('Release') {
    when { tag 'v*' }
    steps {
        withCredentials([string(credentialsId: 'github-token', variable: 'TOKEN')]) {
            sh '''
                curl -X POST \
                    -H "Authorization: token $TOKEN" \
                    -H "Accept: application/vnd.github.v3+json" \
                    https://api.github.com/repos/user/repo/releases \
                    -d '{
                        "tag_name": "'${TAG_NAME}'",
                        "name": "Release '${TAG_NAME}'",
                        "body": "Automated release",
                        "draft": false,
                        "prerelease": false
                    }'
            '''
        }
    }
}
```

### Best Practices

```
✅ Use GitHub App instead of PAT
✅ Configure branch protection
✅ Update commit status
✅ Use webhooks for triggers
✅ Secure webhook secret
✅ Build PRs before merge
```

