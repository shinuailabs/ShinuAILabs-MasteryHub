# Lab 740: Credentials Setup

## LEARNING CONCEPT

Managing credentials securely in Jenkins.

## EXERCISE

1. Create credentials
2. Use credentials in pipelines
3. Manage credential scopes

## SOLUTION

### Credential Types

```
- Username with password
- SSH Username with private key
- Secret text
- Secret file
- Certificate
- Docker Host Certificate Authentication
```

### Create Credentials via UI

```
Manage Jenkins → Credentials → System → Global credentials

1. Click "Add Credentials"
2. Select credential type
3. Fill in details
4. Set ID (for reference in pipelines)
5. Add description
6. Save
```

### Username/Password Credential

```
Kind: Username with password
Scope: Global
Username: myuser
Password: ********
ID: github-credentials
Description: GitHub access credentials
```

### SSH Key Credential

```
Kind: SSH Username with private key
Scope: Global
ID: ssh-key
Username: git
Private Key: Enter directly
-----BEGIN RSA PRIVATE KEY-----
...
-----END RSA PRIVATE KEY-----
```

### Secret Text Credential

```
Kind: Secret text
Scope: Global
Secret: my-api-token-value
ID: api-token
Description: API access token
```

### Use in Declarative Pipeline

```groovy
pipeline {
    agent any
    
    environment {
        // Username/password
        GIT_CREDS = credentials('github-credentials')
        
        // Secret text
        API_TOKEN = credentials('api-token')
    }
    
    stages {
        stage('Build') {
            steps {
                // Username available as GIT_CREDS_USR
                // Password available as GIT_CREDS_PSW
                sh 'echo "User: $GIT_CREDS_USR"'
                
                // Secret text
                sh 'curl -H "Authorization: $API_TOKEN" https://api.example.com'
            }
        }
    }
}
```

### Use withCredentials

```groovy
pipeline {
    agent any
    
    stages {
        stage('Deploy') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'github-credentials',
                        usernameVariable: 'GIT_USER',
                        passwordVariable: 'GIT_PASS'
                    )
                ]) {
                    sh 'git push https://$GIT_USER:$GIT_PASS@github.com/repo.git'
                }
                
                withCredentials([
                    string(credentialsId: 'api-token', variable: 'TOKEN')
                ]) {
                    sh 'curl -H "Authorization: Bearer $TOKEN" https://api.example.com'
                }
                
                withCredentials([
                    sshUserPrivateKey(
                        credentialsId: 'ssh-key',
                        keyFileVariable: 'SSH_KEY'
                    )
                ]) {
                    sh 'ssh -i $SSH_KEY user@server.com'
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
- Only available to Jenkins system
- Use for agent connections

Folder:
- Available within folder
- Use for project-specific credentials
```

### Folder Credentials

```
1. Create folder
2. Go to folder → Credentials
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

### Security Best Practices

```
✅ Use specific scopes
✅ Rotate credentials regularly
✅ Use credential domains
✅ Audit credential usage
✅ Don't log credential values
✅ Use secret text for tokens
✅ Use SSH keys over passwords
```

### Credential Providers

```
Built-in:
- Jenkins credential store

External:
- HashiCorp Vault
- AWS Secrets Manager
- Azure Key Vault
- CyberArk
```

