# Lab 755: Scripted Pipeline

## LEARNING CONCEPT

Understanding scripted pipeline syntax in Jenkins.

## EXERCISE

1. Create scripted pipeline
2. Use Groovy constructs
3. Compare with declarative

## SOLUTION

### Basic Structure

```groovy
node {
    stage('Build') {
        echo 'Building...'
    }
    
    stage('Test') {
        echo 'Testing...'
    }
    
    stage('Deploy') {
        echo 'Deploying...'
    }
}
```

### Node Selection

```groovy
// Any node
node {
    stage('Build') {
        sh 'npm run build'
    }
}

// Specific label
node('linux') {
    stage('Build') {
        sh 'npm run build'
    }
}

// Multiple nodes
node('linux') {
    stage('Build Linux') {
        sh 'make build'
    }
}

node('windows') {
    stage('Build Windows') {
        bat 'msbuild'
    }
}
```

### Checkout

```groovy
node {
    stage('Checkout') {
        checkout scm
        
        // Or explicit checkout
        git url: 'https://github.com/user/repo.git',
            branch: 'main',
            credentialsId: 'github-credentials'
    }
}
```

### Environment Variables

```groovy
node {
    // Set environment
    withEnv(['APP_NAME=my-app', 'VERSION=1.0.0']) {
        stage('Build') {
            echo "Building ${env.APP_NAME} v${env.VERSION}"
            sh 'npm run build'
        }
    }
}
```

### Credentials

```groovy
node {
    stage('Deploy') {
        withCredentials([
            usernamePassword(
                credentialsId: 'deploy-creds',
                usernameVariable: 'USER',
                passwordVariable: 'PASS'
            )
        ]) {
            sh 'deploy --user $USER --pass $PASS'
        }
        
        withCredentials([
            string(credentialsId: 'api-token', variable: 'TOKEN')
        ]) {
            sh 'curl -H "Authorization: $TOKEN" https://api.example.com'
        }
    }
}
```

### Try-Catch-Finally

```groovy
node {
    try {
        stage('Build') {
            sh 'npm run build'
        }
        
        stage('Test') {
            sh 'npm test'
        }
        
        stage('Deploy') {
            sh './deploy.sh'
        }
    } catch (Exception e) {
        currentBuild.result = 'FAILURE'
        echo "Build failed: ${e.message}"
        throw e
    } finally {
        stage('Cleanup') {
            cleanWs()
        }
    }
}
```

### Conditional Logic

```groovy
node {
    stage('Build') {
        sh 'npm run build'
    }
    
    stage('Deploy') {
        if (env.BRANCH_NAME == 'main') {
            echo 'Deploying to production'
            sh './deploy.sh production'
        } else if (env.BRANCH_NAME == 'develop') {
            echo 'Deploying to staging'
            sh './deploy.sh staging'
        } else {
            echo 'Skipping deployment'
        }
    }
}
```

### Loops

```groovy
node {
    def environments = ['dev', 'staging', 'prod']
    
    stage('Build') {
        sh 'npm run build'
    }
    
    environments.each { env ->
        stage("Deploy to ${env}") {
            if (env == 'prod') {
                input message: "Deploy to ${env}?"
            }
            sh "./deploy.sh ${env}"
        }
    }
}
```

### Parallel Execution

```groovy
node {
    stage('Build') {
        sh 'npm run build'
    }
    
    stage('Test') {
        parallel(
            'Unit Tests': {
                sh 'npm run test:unit'
            },
            'Integration Tests': {
                sh 'npm run test:integration'
            },
            'E2E Tests': {
                sh 'npm run test:e2e'
            }
        )
    }
}
```

### Timeout and Retry

```groovy
node {
    stage('Build') {
        timeout(time: 10, unit: 'MINUTES') {
            sh 'npm run build'
        }
    }
    
    stage('Deploy') {
        retry(3) {
            sh './deploy.sh'
        }
    }
    
    stage('Health Check') {
        timeout(time: 5, unit: 'MINUTES') {
            retry(10) {
                sleep 30
                sh 'curl -f http://app.example.com/health'
            }
        }
    }
}
```

### Input

```groovy
node {
    stage('Build') {
        sh 'npm run build'
    }
    
    stage('Approval') {
        def userInput = input(
            message: 'Deploy to production?',
            ok: 'Deploy',
            parameters: [
                string(name: 'VERSION', defaultValue: '1.0.0'),
                choice(name: 'REGION', choices: ['us-east', 'eu-west'])
            ]
        )
        
        echo "Deploying version ${userInput.VERSION} to ${userInput.REGION}"
    }
}
```

### Stash and Unstash

```groovy
node('build-agent') {
    stage('Build') {
        sh 'npm run build'
        stash includes: 'dist/**/*', name: 'build-artifacts'
    }
}

node('deploy-agent') {
    stage('Deploy') {
        unstash 'build-artifacts'
        sh './deploy.sh'
    }
}
```

### Declarative vs Scripted

```
Declarative:
✅ Simpler syntax
✅ Better validation
✅ Blue Ocean support
✅ Restart from stage

Scripted:
✅ More flexible
✅ Full Groovy power
✅ Complex logic
✅ Dynamic stages
```

