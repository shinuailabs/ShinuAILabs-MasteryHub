# Part 04: Credentials Management

## 📚 Overview
Jenkins credentials management securely stores and uses sensitive data in pipelines.

---

## 🎯 Key Concepts

### 1. Credential Types

```
Username with password - Login credentials
Secret text - API keys, tokens
Secret file - Certificate files, config files
SSH Username with private key - SSH access
Certificate - PKCS#12 certificates
```

### 2. Adding Credentials

```
1. Go to: Manage Jenkins > Credentials
2. Select domain (global or folder)
3. Click "Add Credentials"
4. Choose credential type
5. Fill in details:
   - ID: unique identifier
   - Description: human-readable name
   - Scope: Global or System
6. Save
```

### 3. Using Credentials in Pipeline

```groovy
pipeline {
    agent any
    
    environment {
        // Secret text
        API_KEY = credentials('api-key-id')
        
        // Username/password (creates _USR and _PSW)
        DB_CREDS = credentials('database-credentials')
    }
    
    stages {
        stage('Test') {
            steps {
                sh '''
                    echo "API Key: $API_KEY"
                    echo "DB User: $DB_CREDS_USR"
                    echo "DB Pass: $DB_CREDS_PSW"
                '''
            }
        }
    }
}
```

### 4. withCredentials Block

```groovy
pipeline {
    agent any
    
    stages {
        stage('Deploy') {
            steps {
                withCredentials([
                    string(credentialsId: 'api-key', variable: 'API_KEY'),
                    usernamePassword(
                        credentialsId: 'deploy-creds',
                        usernameVariable: 'DEPLOY_USER',
                        passwordVariable: 'DEPLOY_PASS'
                    )
                ]) {
                    sh '''
                        curl -H "Authorization: Bearer $API_KEY" \
                             -u "$DEPLOY_USER:$DEPLOY_PASS" \
                             https://api.example.com/deploy
                    '''
                }
            }
        }
    }
}
```

### 5. SSH Credentials

```groovy
pipeline {
    agent any
    
    stages {
        stage('Deploy') {
            steps {
                withCredentials([
                    sshUserPrivateKey(
                        credentialsId: 'ssh-key',
                        keyFileVariable: 'SSH_KEY',
                        usernameVariable: 'SSH_USER'
                    )
                ]) {
                    sh '''
                        ssh -i $SSH_KEY $SSH_USER@server.example.com \
                            "cd /app && git pull && npm restart"
                    '''
                }
            }
        }
    }
}
```

### 6. File Credentials

```groovy
pipeline {
    agent any
    
    stages {
        stage('Test') {
            steps {
                withCredentials([
                    file(credentialsId: 'env-file', variable: 'ENV_FILE'),
                    file(credentialsId: 'auth-json', variable: 'AUTH_FILE')
                ]) {
                    sh '''
                        cp $ENV_FILE .env
                        cp $AUTH_FILE auth.json
                        npx playwright test
                    '''
                }
            }
        }
    }
}
```

### 7. Playwright Test Credentials

```groovy
pipeline {
    agent any
    
    stages {
        stage('Test') {
            environment {
                TEST_USER = credentials('test-user-creds')
            }
            steps {
                sh '''
                    export TEST_EMAIL=$TEST_USER_USR
                    export TEST_PASSWORD=$TEST_USER_PSW
                    npx playwright test
                '''
            }
        }
    }
}
```

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    // Use environment variables
    httpCredentials: {
      username: process.env.TEST_EMAIL!,
      password: process.env.TEST_PASSWORD!,
    },
  },
});
```

### 8. Credential Scopes

```groovy
// Global scope - available everywhere
credentials('global-api-key')

// Folder scope - available in folder and subfolders
// Set when creating credential in folder

// System scope - only for Jenkins system
// Not available in pipelines
```

### 9. Masking Credentials

```groovy
pipeline {
    agent any
    
    stages {
        stage('Test') {
            steps {
                withCredentials([string(credentialsId: 'secret', variable: 'SECRET')]) {
                    // SECRET is automatically masked in logs
                    sh 'echo "Using secret: $SECRET"'
                    // Output: Using secret: ****
                }
            }
        }
    }
}
```

---

## 💻 Practice Exercises

1. Add different credential types
2. Use credentials in pipeline
3. Implement withCredentials
4. Set up SSH credentials
5. Use file credentials

---

## ✅ Best Practices

- ✅ Use credential IDs, not values
- ✅ Limit credential scope
- ✅ Use withCredentials for sensitive ops
- ✅ Rotate credentials regularly
- ❌ Don't echo credentials
- ❌ Never commit credentials

---

## 📝 Quick Reference

```groovy
// Environment binding
environment {
    API_KEY = credentials('api-key-id')
    CREDS = credentials('user-pass-id')
}

// withCredentials
withCredentials([
    string(credentialsId: 'id', variable: 'VAR'),
    usernamePassword(credentialsId: 'id', 
        usernameVariable: 'USER', 
        passwordVariable: 'PASS'),
    file(credentialsId: 'id', variable: 'FILE')
]) {
    sh 'command using $VAR'
}
```

