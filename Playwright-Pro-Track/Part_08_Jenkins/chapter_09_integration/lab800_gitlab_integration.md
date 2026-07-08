# Lab 800: GitLab Integration

## LEARNING CONCEPT

Integrating Jenkins with GitLab for CI/CD.

## EXERCISE

1. Configure GitLab connection
2. Set up MR builds
3. Update pipeline status

## SOLUTION

### Install GitLab Plugin

```
Manage Jenkins → Plugins → Available
Install: GitLab Plugin
```

### Configure GitLab Connection

```
Manage Jenkins → System → GitLab

GitLab connections → Add:
  Connection name: GitLab
  GitLab host URL: https://gitlab.example.com
  Credentials: gitlab-api-token
  Test Connection
```

### Create GitLab Token

```
GitLab → User Settings → Access Tokens

Name: jenkins-integration
Scopes:
  - api
  - read_repository
  - write_repository
```

### Configure Webhook

```
GitLab → Project → Settings → Webhooks

URL: https://jenkins.example.com/project/my-job
Secret Token: (optional)
Trigger:
  ✓ Push events
  ✓ Merge request events
  ✓ Tag push events
```

### Multibranch Pipeline

```
New Item → Multibranch Pipeline

Branch Sources → Add source → GitLab Project

Credentials: gitlab-credentials
Server: GitLab
Owner: group-name
Projects: project-name
Behaviors:
  - Discover branches
  - Discover merge requests
```

### Jenkinsfile for GitLab

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
    
    options {
        gitLabConnection('GitLab')
    }
    
    stages {
        stage('Build') {
            steps {
                gitlabCommitStatus(name: 'build') {
                    sh 'npm ci'
                    sh 'npm run build'
                }
            }
        }
        
        stage('Test') {
            steps {
                gitlabCommitStatus(name: 'test') {
                    sh 'npm test'
                }
            }
        }
    }
    
    post {
        success {
            updateGitlabCommitStatus name: 'jenkins', state: 'success'
        }
        failure {
            updateGitlabCommitStatus name: 'jenkins', state: 'failed'
        }
    }
}
```

### Merge Request Builds

```groovy
pipeline {
    agent any
    
    options {
        gitLabConnection('GitLab')
    }
    
    stages {
        stage('MR Build') {
            when {
                expression { env.gitlabMergeRequestId != null }
            }
            steps {
                echo "Building MR !${env.gitlabMergeRequestId}"
                echo "Source: ${env.gitlabSourceBranch}"
                echo "Target: ${env.gitlabTargetBranch}"
                
                gitlabCommitStatus(name: 'build') {
                    sh 'npm run build'
                }
            }
        }
    }
    
    post {
        success {
            addGitLabMRComment(comment: '✅ Build passed!')
        }
        failure {
            addGitLabMRComment(comment: '❌ Build failed!')
        }
    }
}
```

### GitLab Environment Variables

```groovy
// Available in GitLab-triggered builds
env.gitlabBranch
env.gitlabSourceBranch
env.gitlabTargetBranch
env.gitlabMergeRequestId
env.gitlabMergeRequestTitle
env.gitlabUserName
env.gitlabUserEmail
env.gitlabSourceRepoURL
```

### Accept Merge Request

```groovy
stage('Auto-Merge') {
    when {
        expression { env.gitlabMergeRequestId != null }
        expression { currentBuild.result == 'SUCCESS' }
    }
    steps {
        acceptGitLabMR(
            mergeCommitMessage: 'Merged by Jenkins',
            removeSourceBranch: true
        )
    }
}
```

### GitLab Pipeline Status

```groovy
pipeline {
    agent any
    
    options {
        gitLabConnection('GitLab')
        gitlabBuilds(builds: ['build', 'test', 'deploy'])
    }
    
    stages {
        stage('Build') {
            steps {
                gitlabCommitStatus(name: 'build') {
                    sh 'npm run build'
                }
            }
        }
        
        stage('Test') {
            steps {
                gitlabCommitStatus(name: 'test') {
                    sh 'npm test'
                }
            }
        }
        
        stage('Deploy') {
            steps {
                gitlabCommitStatus(name: 'deploy') {
                    sh './deploy.sh'
                }
            }
        }
    }
}
```

### Branch Protection

```
GitLab → Project → Settings → Repository → Protected branches

Branch: main
Allowed to merge: Maintainers
Allowed to push: No one
Require pipeline to succeed: ✓
```

### Best Practices

```
✅ Use GitLab API token
✅ Configure webhooks
✅ Update commit status
✅ Build merge requests
✅ Use branch protection
✅ Add MR comments
```

