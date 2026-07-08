# Lab 775: Credentials Plugin

## LEARNING CONCEPT

Managing credentials securely with Jenkins plugins.

## EXERCISE

1. Create credentials
2. Use in pipelines
3. Manage credential scopes

## SOLUTION

### Install Credentials Plugins

```
Required plugins:
- credentials (Credentials)
- credentials-binding (Credentials Binding)
- ssh-credentials (SSH Credentials)
```

### Create Credentials via UI

```
Manage Jenkins → Credentials → System → Global credentials

Add Credentials:
1. Select credential type
2. Fill in details
3. Set ID (for reference)
4. Add description
5. Save
```

### Credential Types

```
Username with password:
- Git authentication
- API access
- Database connections

Secret text:
- API tokens
- Passwords
- Keys

Secret file:
- Configuration files
- Certificates
- Key files

SSH Username with private key:
- Git SSH access
- Server access

Certificate:
- TLS/SSL certificates
```

### Username/Password in Pipeline

```groovy
pipeline {
    agent any
    
    environment {
        GIT_CREDS = credentials('github-credentials')
    }
    
    stages {
        stage('Use Credentials') {
            steps {
                // Username: GIT_CREDS_USR
                // Password: GIT_CREDS_PSW
                sh 'echo "User: $GIT_CREDS_USR"'
            }
        }
    }
}
```

### withCredentials Block

```groovy
pipeline {
    agent any
    
    stages {
        stage('Deploy') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'deploy-creds',
                        usernameVariable: 'DEPLOY_USER',
                        passwordVariable: 'DEPLOY_PASS'
                    )
                ]) {
                    sh '''
                        set +x
                        ./deploy.sh --user $DEPLOY_USER --pass $DEPLOY_PASS
                    '''
                }
            }
        }
    }
}
```

### Secret Text

```groovy
pipeline {
    agent any
    
    stages {
        stage('API Call') {
            steps {
                withCredentials([
                    string(credentialsId: 'api-token', variable: 'TOKEN')
                ]) {
                    sh '''
                        set +x
                        curl -H "Authorization: Bearer $TOKEN" https://api.example.com
                    '''
                }
            }
        }
    }
}
```

### Secret File

```groovy
pipeline {
    agent any
    
    stages {
        stage('Use Config') {
            steps {
                withCredentials([
                    file(credentialsId: 'config-file', variable: 'CONFIG')
                ]) {
                    sh 'cp $CONFIG ./config.json'
                    sh 'cat ./config.json'
                }
            }
        }
    }
}
```

### SSH Key

```groovy
pipeline {
    agent any
    
    stages {
        stage('SSH Deploy') {
            steps {
                withCredentials([
                    sshUserPrivateKey(
                        credentialsId: 'ssh-key',
                        keyFileVariable: 'SSH_KEY',
                        usernameVariable: 'SSH_USER'
                    )
                ]) {
                    sh '''
                        ssh -i $SSH_KEY -o StrictHostKeyChecking=no \
                            $SSH_USER@server.example.com \
                            "cd /app && ./deploy.sh"
                    '''
                }
            }
        }
    }
}
```

### Multiple Credentials

```groovy
pipeline {
    agent any
    
    stages {
        stage('Deploy') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'docker-creds',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    ),
                    string(credentialsId: 'slack-token', variable: 'SLACK_TOKEN'),
                    file(credentialsId: 'kubeconfig', variable: 'KUBECONFIG')
                ]) {
                    sh '''
                        docker login -u $DOCKER_USER -p $DOCKER_PASS
                        kubectl --kubeconfig=$KUBECONFIG apply -f deployment.yaml
                    '''
                }
            }
        }
    }
}
```

### Credential Scopes

```
Global:
- Available to all jobs
- Use for shared credentials

System:
- Only for Jenkins system
- Agent connections

Folder:
- Available within folder
- Project-specific credentials
```

### Folder Credentials

```
1. Create folder
2. Folder → Credentials
3. Add credentials
4. Only jobs in folder can access
```

### Credential Domains

```
Manage Jenkins → Credentials → System → Global credentials → Add domain

Domain: github.com
Specifications:
  - Hostname: github.com
  - Scheme: https
```

### Best Practices

```
✅ Use specific scopes
✅ Rotate credentials regularly
✅ Use credential domains
✅ Don't log credential values
✅ Use set +x before using secrets
✅ Audit credential usage
```

