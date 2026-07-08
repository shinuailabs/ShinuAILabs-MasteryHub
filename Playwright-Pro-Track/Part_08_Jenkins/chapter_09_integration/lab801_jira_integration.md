# Lab 801: Jira Integration

## LEARNING CONCEPT

Integrating Jenkins with Jira for issue tracking.

## EXERCISE

1. Configure Jira connection
2. Update issues from builds
3. Link builds to issues

## SOLUTION

### Install Jira Plugin

```
Manage Jenkins → Plugins → Available
Install: Jira Plugin
```

### Configure Jira Site

```
Manage Jenkins → System → Jira

Jira Sites → Add:
  URL: https://company.atlassian.net
  Credentials: jira-credentials (Username/Password or API Token)
  
  Alternative Authentication:
  Use HTTP Basic Authentication: ✓
```

### Create Jira API Token

```
Atlassian Account → Security → API tokens

Create API token:
  Label: jenkins-integration
  
Use with:
  Username: your-email@company.com
  Password: API-token
```

### Update Jira from Pipeline

```groovy
pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
        
        stage('Update Jira') {
            steps {
                script {
                    // Get Jira issue from commit message
                    def commitMsg = sh(
                        script: 'git log -1 --format=%s',
                        returnStdout: true
                    ).trim()
                    
                    def issueKey = (commitMsg =~ /([A-Z]+-\d+)/)[0][0]
                    
                    if (issueKey) {
                        jiraComment(
                            issueKey: issueKey,
                            body: "Build ${env.BUILD_NUMBER} completed: ${env.BUILD_URL}"
                        )
                    }
                }
            }
        }
    }
}
```

### Jira Issue Updater

```groovy
pipeline {
    agent any
    
    environment {
        JIRA_SITE = 'Jira'
    }
    
    stages {
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
    }
    
    post {
        success {
            jiraSendBuildInfo(
                site: 'Jira',
                branch: env.BRANCH_NAME
            )
        }
    }
}
```

### Transition Jira Issue

```groovy
stage('Deploy') {
    steps {
        sh './deploy.sh'
        
        script {
            def issueKey = 'PROJ-123'
            
            // Transition to "Done"
            jiraTransitionIssue(
                idOrKey: issueKey,
                input: [
                    transition: [id: '31']  // Transition ID
                ]
            )
        }
    }
}
```

### Add Jira Comment

```groovy
post {
    success {
        script {
            def issues = jiraIssueSelector(
                issueSelector: [$class: 'DefaultIssueSelector']
            )
            
            issues.each { issue ->
                jiraComment(
                    issueKey: issue,
                    body: """
                        Build Successful!
                        - Build: ${env.BUILD_NUMBER}
                        - URL: ${env.BUILD_URL}
                        - Branch: ${env.BRANCH_NAME}
                    """
                )
            }
        }
    }
}
```

### Link Build to Jira

```groovy
pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
                // Extract Jira issues from commits
                script {
                    def changes = currentBuild.changeSets
                    def issues = []
                    
                    changes.each { changeSet ->
                        changeSet.items.each { entry ->
                            def matcher = entry.msg =~ /([A-Z]+-\d+)/
                            while (matcher.find()) {
                                issues << matcher.group(1)
                            }
                        }
                    }
                    
                    env.JIRA_ISSUES = issues.unique().join(',')
                }
                
                sh 'npm run build'
            }
        }
    }
    
    post {
        always {
            script {
                if (env.JIRA_ISSUES) {
                    env.JIRA_ISSUES.split(',').each { issue ->
                        jiraComment(
                            issueKey: issue,
                            body: "Build ${currentBuild.result}: ${env.BUILD_URL}"
                        )
                    }
                }
            }
        }
    }
}
```

### Jira Deployment Info

```groovy
stage('Deploy') {
    steps {
        sh './deploy.sh'
        
        jiraSendDeploymentInfo(
            site: 'Jira',
            environmentId: 'production',
            environmentName: 'Production',
            environmentType: 'production'
        )
    }
}
```

### Create Jira Issue

```groovy
stage('Create Bug') {
    when {
        expression { currentBuild.result == 'FAILURE' }
    }
    steps {
        script {
            def issue = jiraNewIssue(
                issue: [
                    fields: [
                        project: [key: 'PROJ'],
                        summary: "Build ${env.BUILD_NUMBER} failed",
                        description: "Build failed: ${env.BUILD_URL}",
                        issuetype: [name: 'Bug']
                    ]
                ]
            )
            
            echo "Created issue: ${issue.data.key}"
        }
    }
}
```

### Best Practices

```
✅ Use API tokens, not passwords
✅ Extract issues from commits
✅ Update issues on build events
✅ Link deployments to issues
✅ Use meaningful comments
✅ Automate transitions
```

