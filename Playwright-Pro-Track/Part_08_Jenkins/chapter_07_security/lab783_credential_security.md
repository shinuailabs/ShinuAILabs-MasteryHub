# Lab 783: Credential Security

## LEARNING CONCEPT

Securing credentials in Jenkins.

## EXERCISE

1. Implement credential best practices
2. Use credential scopes
3. Audit credential usage

## SOLUTION

### Credential Types

```
Secure credential types:
- Username with password
- Secret text
- Secret file
- SSH Username with private key
- Certificate
- AWS Credentials
- Kubernetes credentials
```

### Credential Scopes

```
Global:
- Available to all jobs
- Use for shared credentials
- Higher risk if compromised

System:
- Only for Jenkins system
- Agent connections
- Not available to jobs

Folder:
- Available within folder only
- Project-specific credentials
- Better isolation
```

### Create Secure Credentials

```
Manage Jenkins → Credentials → System → Global credentials

Best practices:
1. Use descriptive ID
2. Add description
3. Choose appropriate scope
4. Use strong secrets
```

### Folder-Scoped Credentials

```
1. Create folder for project
2. Folder → Credentials → Add credentials
3. Credentials only available in folder

Benefits:
- Isolation between projects
- Easier management
- Reduced blast radius
```

### Credential Domains

```
Manage Jenkins → Credentials → System → Add domain

Domain: github.com
Specifications:
  - Hostname: github.com
  - Scheme: https

Add credentials to domain:
- Only used for matching hosts
- Better organization
```

### Mask Credentials in Logs

```groovy
pipeline {
    agent any
    
    stages {
        stage('Use Credentials') {
            steps {
                withCredentials([
                    string(credentialsId: 'api-token', variable: 'TOKEN')
                ]) {
                    // Credentials automatically masked
                    sh '''
                        set +x  # Disable command echo
                        curl -H "Authorization: Bearer $TOKEN" https://api.example.com
                    '''
                }
            }
        }
    }
}
```

### Credential Rotation

```
Regular rotation schedule:
- API tokens: 90 days
- Passwords: 90 days
- SSH keys: Annually
- Certificates: Before expiry

Rotation process:
1. Create new credential
2. Update jobs to use new credential
3. Verify functionality
4. Delete old credential
```

### Credential Audit

```groovy
// Script to audit credential usage
import com.cloudbees.plugins.credentials.*
import com.cloudbees.plugins.credentials.domains.*

def creds = CredentialsProvider.lookupCredentials(
    com.cloudbees.plugins.credentials.Credentials.class,
    Jenkins.instance,
    null,
    null
)

creds.each { cred ->
    println "ID: ${cred.id}"
    println "Description: ${cred.description}"
    println "Scope: ${cred.scope}"
    println "---"
}
```

### Restrict Credential Access

```
Role-based credential access:
1. Use Role-Based Strategy
2. Configure credential permissions
3. Limit who can view/update

Permissions:
- Credentials/Create
- Credentials/Delete
- Credentials/Update
- Credentials/View
```

### Credential Provider Security

```
External credential providers:
- HashiCorp Vault
- AWS Secrets Manager
- Azure Key Vault
- CyberArk

Benefits:
- Centralized management
- Automatic rotation
- Audit logging
- Better security
```

### HashiCorp Vault Integration

```
Install: HashiCorp Vault Plugin

Configure:
Manage Jenkins → System → Vault

Vault URL: https://vault.example.com
Credential: vault-token

Use in pipeline:
withVault([
    vaultSecrets: [[
        path: 'secret/myapp',
        secretValues: [[vaultKey: 'password', envVar: 'PASSWORD']]
    ]]
]) {
    sh 'echo $PASSWORD'
}
```

### Credential Backup

```
Credentials stored in:
$JENKINS_HOME/credentials.xml
$JENKINS_HOME/secrets/

Backup:
- Include in Jenkins backup
- Encrypt backups
- Secure backup storage
- Test restore process
```

### Credential Security Checklist

```
Creation:
□ Use appropriate scope
□ Add description
□ Use strong secrets
□ Document purpose

Usage:
□ Use withCredentials
□ Mask in logs
□ Don't echo secrets
□ Limit access

Maintenance:
□ Regular rotation
□ Audit usage
□ Remove unused
□ Update documentation
```

### Detect Credential Exposure

```groovy
// Check for exposed credentials in logs
pipeline {
    agent any
    
    stages {
        stage('Security Check') {
            steps {
                script {
                    def log = currentBuild.rawBuild.getLog(1000)
                    
                    // Check for common patterns
                    def patterns = [
                        ~/password\s*[:=]\s*\S+/,
                        ~/token\s*[:=]\s*\S+/,
                        ~/secret\s*[:=]\s*\S+/
                    ]
                    
                    patterns.each { pattern ->
                        if (log.any { it =~ pattern }) {
                            error "Potential credential exposure detected!"
                        }
                    }
                }
            }
        }
    }
}
```

### Best Practices

```
✅ Use folder-scoped credentials
✅ Implement credential rotation
✅ Audit credential usage
✅ Use external secret managers
✅ Mask credentials in logs
✅ Follow least privilege
✅ Document credential purpose
✅ Regular security reviews
```

