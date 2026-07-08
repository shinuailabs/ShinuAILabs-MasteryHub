# Part 02: Pipeline Basics

## 📚 Overview
Jenkins Pipeline enables defining CI/CD workflows as code using Groovy-based DSL.

---

## 🎯 Key Concepts

### 1. Pipeline Types

```groovy
// Declarative Pipeline (recommended)
pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                echo 'Building...'
            }
        }
    }
}

// Scripted Pipeline (more flexible)
node {
    stage('Build') {
        echo 'Building...'
    }
}
```

### 2. Basic Declarative Pipeline

```groovy
// Jenkinsfile
pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install') {
            steps {
                sh 'npm ci'
            }
        }
        
        stage('Test') {
            steps {
                sh 'npm test'
            }
        }
        
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
    }
}
```

### 3. Agent Configuration

```groovy
pipeline {
    // Run on any available agent
    agent any
    
    stages {
        stage('Build') {
            // Run this stage on specific agent
            agent {
                label 'linux'
            }
            steps {
                sh 'npm run build'
            }
        }
        
        stage('Test') {
            // Run in Docker container
            agent {
                docker {
                    image 'node:18'
                }
            }
            steps {
                sh 'npm test'
            }
        }
    }
}
```

### 4. Environment Variables

```groovy
pipeline {
    agent any
    
    environment {
        NODE_ENV = 'test'
        CI = 'true'
        API_KEY = credentials('api-key-id')
    }
    
    stages {
        stage('Test') {
            environment {
                STAGE_VAR = 'stage-specific'
            }
            steps {
                sh 'echo $NODE_ENV'
                sh 'echo $STAGE_VAR'
            }
        }
    }
}
```

### 5. Parameters

```groovy
pipeline {
    agent any
    
    parameters {
        string(name: 'BRANCH', defaultValue: 'main', description: 'Branch to build')
        choice(name: 'ENV', choices: ['dev', 'staging', 'prod'], description: 'Environment')
        booleanParam(name: 'RUN_TESTS', defaultValue: true, description: 'Run tests?')
    }
    
    stages {
        stage('Build') {
            steps {
                echo "Building branch: ${params.BRANCH}"
                echo "Environment: ${params.ENV}"
            }
        }
        
        stage('Test') {
            when {
                expression { params.RUN_TESTS }
            }
            steps {
                sh 'npm test'
            }
        }
    }
}
```

### 6. Post Actions

```groovy
pipeline {
    agent any
    
    stages {
        stage('Test') {
            steps {
                sh 'npm test'
            }
        }
    }
    
    post {
        always {
            echo 'This always runs'
            archiveArtifacts artifacts: '**/test-results/**'
        }
        success {
            echo 'Build succeeded!'
        }
        failure {
            echo 'Build failed!'
            mail to: 'team@example.com',
                 subject: "Failed: ${env.JOB_NAME}",
                 body: "Build ${env.BUILD_NUMBER} failed"
        }
        cleanup {
            cleanWs()
        }
    }
}
```

### 7. Conditional Execution

```groovy
pipeline {
    agent any
    
    stages {
        stage('Deploy to Staging') {
            when {
                branch 'develop'
            }
            steps {
                sh 'deploy-staging.sh'
            }
        }
        
        stage('Deploy to Production') {
            when {
                branch 'main'
                beforeAgent true
            }
            steps {
                sh 'deploy-prod.sh'
            }
        }
        
        stage('Run E2E Tests') {
            when {
                anyOf {
                    branch 'main'
                    branch 'develop'
                }
            }
            steps {
                sh 'npm run e2e'
            }
        }
    }
}
```

### 8. Input and Approval

```groovy
pipeline {
    agent any
    
    stages {
        stage('Deploy') {
            input {
                message "Deploy to production?"
                ok "Deploy"
                submitter "admin,deployer"
                parameters {
                    string(name: 'VERSION', defaultValue: '1.0.0')
                }
            }
            steps {
                echo "Deploying version ${VERSION}"
            }
        }
    }
}
```

---

## 💻 Practice Exercises

1. Create declarative pipeline
2. Configure agents
3. Use environment variables
4. Add parameters
5. Implement post actions

---

## ✅ Best Practices

- ✅ Use declarative syntax
- ✅ Store Jenkinsfile in repo
- ✅ Use meaningful stage names
- ✅ Add post actions for cleanup
- ❌ Don't hardcode credentials
- ❌ Avoid complex scripted blocks

---

## 📝 Quick Reference

```groovy
pipeline {
    agent any
    environment { VAR = 'value' }
    parameters { string(name: 'PARAM') }
    stages {
        stage('Name') {
            when { branch 'main' }
            steps { sh 'command' }
        }
    }
    post {
        always { }
        success { }
        failure { }
    }
}
```

