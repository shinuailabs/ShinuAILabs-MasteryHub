# Lab 761: Input and Approval

## LEARNING CONCEPT

Implementing manual approval gates in pipelines.

## EXERCISE

1. Add input steps
2. Configure approvers
3. Handle timeouts

## SOLUTION

### Basic Input

```groovy
pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
        
        stage('Deploy') {
            steps {
                input message: 'Deploy to production?'
                sh './deploy.sh'
            }
        }
    }
}
```

### Input with Options

```groovy
pipeline {
    agent any
    
    stages {
        stage('Deploy') {
            steps {
                input(
                    message: 'Deploy to production?',
                    ok: 'Deploy Now',
                    submitter: 'admin,deployer',
                    submitterParameter: 'APPROVER'
                )
                echo "Approved by: ${env.APPROVER}"
                sh './deploy.sh'
            }
        }
    }
}
```

### Input with Parameters

```groovy
pipeline {
    agent any
    
    stages {
        stage('Deploy') {
            steps {
                script {
                    def userInput = input(
                        message: 'Configure deployment',
                        ok: 'Deploy',
                        parameters: [
                            string(name: 'VERSION', defaultValue: '1.0.0', description: 'Version to deploy'),
                            choice(name: 'ENVIRONMENT', choices: ['staging', 'production'], description: 'Target environment'),
                            booleanParam(name: 'NOTIFY', defaultValue: true, description: 'Send notifications')
                        ]
                    )
                    
                    echo "Deploying version ${userInput.VERSION} to ${userInput.ENVIRONMENT}"
                    
                    if (userInput.NOTIFY) {
                        slackSend(message: "Deploying ${userInput.VERSION}")
                    }
                }
            }
        }
    }
}
```

### Input Directive (Stage Level)

```groovy
pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
        
        stage('Deploy') {
            input {
                message 'Deploy to production?'
                ok 'Deploy'
                submitter 'admin,release-team'
                parameters {
                    string(name: 'VERSION', defaultValue: '1.0.0')
                }
            }
            steps {
                echo "Deploying version ${VERSION}"
                sh "./deploy.sh ${VERSION}"
            }
        }
    }
}
```

### Input with Timeout

```groovy
pipeline {
    agent any
    
    stages {
        stage('Deploy') {
            steps {
                timeout(time: 1, unit: 'HOURS') {
                    input message: 'Deploy to production?'
                }
                sh './deploy.sh'
            }
        }
    }
}
```

### Input with Abort Option

```groovy
pipeline {
    agent any
    
    stages {
        stage('Deploy') {
            steps {
                script {
                    try {
                        timeout(time: 30, unit: 'MINUTES') {
                            input message: 'Deploy to production?', ok: 'Deploy'
                        }
                        sh './deploy.sh'
                    } catch (err) {
                        echo "Deployment cancelled or timed out"
                        currentBuild.result = 'ABORTED'
                    }
                }
            }
        }
    }
}
```

### Multiple Approvals

```groovy
pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
        
        stage('QA Approval') {
            steps {
                input(
                    message: 'QA sign-off?',
                    submitter: 'qa-team'
                )
            }
        }
        
        stage('Deploy Staging') {
            steps {
                sh './deploy.sh staging'
            }
        }
        
        stage('Production Approval') {
            steps {
                input(
                    message: 'Deploy to production?',
                    submitter: 'release-managers'
                )
            }
        }
        
        stage('Deploy Production') {
            steps {
                sh './deploy.sh production'
            }
        }
    }
}
```

### Conditional Input

```groovy
pipeline {
    agent any
    
    parameters {
        booleanParam(name: 'AUTO_DEPLOY', defaultValue: false)
    }
    
    stages {
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
        
        stage('Deploy') {
            steps {
                script {
                    if (!params.AUTO_DEPLOY) {
                        input message: 'Deploy to production?'
                    }
                    sh './deploy.sh'
                }
            }
        }
    }
}
```

### Input Before Agent

```groovy
pipeline {
    agent none
    
    stages {
        stage('Deploy') {
            when {
                beforeInput true
                branch 'main'
            }
            input {
                message 'Deploy to production?'
            }
            agent { label 'deploy-server' }
            steps {
                sh './deploy.sh'
            }
        }
    }
}
```

### Approval with Notification

```groovy
pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
        
        stage('Approval') {
            steps {
                script {
                    slackSend(
                        channel: '#approvals',
                        message: "Approval needed: ${env.BUILD_URL}input"
                    )
                    
                    def approval = input(
                        message: 'Deploy to production?',
                        submitterParameter: 'APPROVER'
                    )
                    
                    slackSend(
                        channel: '#approvals',
                        message: "Approved by ${env.APPROVER}"
                    )
                }
            }
        }
        
        stage('Deploy') {
            steps {
                sh './deploy.sh'
            }
        }
    }
}
```

### Best Practices

```
✅ Set reasonable timeouts
✅ Specify allowed submitters
✅ Notify when approval needed
✅ Log who approved
✅ Handle timeout/abort gracefully
✅ Use beforeInput to save resources
```

