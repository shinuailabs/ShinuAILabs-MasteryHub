# Lab 746: Pipeline Jobs

## LEARNING CONCEPT

Creating pipeline jobs with Jenkinsfile.

## EXERCISE

1. Create pipeline job
2. Write Jenkinsfile
3. Configure pipeline options

## SOLUTION

### Create Pipeline Job

```
1. Dashboard → New Item
2. Enter job name: my-pipeline
3. Select "Pipeline"
4. Click OK
```

### Pipeline Definition Options

```
Definition:
1. Pipeline script
   - Write directly in Jenkins UI

2. Pipeline script from SCM
   - Git repository
   - Script Path: Jenkinsfile
```

### Basic Declarative Pipeline

```groovy
pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
                echo 'Building...'
                sh 'npm ci'
                sh 'npm run build'
            }
        }
        
        stage('Test') {
            steps {
                echo 'Testing...'
                sh 'npm test'
            }
        }
        
        stage('Deploy') {
            steps {
                echo 'Deploying...'
                sh './deploy.sh'
            }
        }
    }
}
```

### Pipeline with Options

```groovy
pipeline {
    agent any
    
    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
        timestamps()
        disableConcurrentBuilds()
    }
    
    stages {
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
    }
}
```

### Pipeline with Environment

```groovy
pipeline {
    agent any
    
    environment {
        NODE_ENV = 'production'
        API_URL = 'https://api.example.com'
        CREDENTIALS = credentials('api-credentials')
    }
    
    stages {
        stage('Build') {
            steps {
                sh 'echo "Building for $NODE_ENV"'
                sh 'npm run build'
            }
        }
    }
}
```

### Pipeline with Parameters

```groovy
pipeline {
    agent any
    
    parameters {
        string(name: 'ENVIRONMENT', defaultValue: 'staging', description: 'Target environment')
        choice(name: 'BROWSER', choices: ['chrome', 'firefox', 'webkit'], description: 'Browser')
        booleanParam(name: 'SKIP_TESTS', defaultValue: false, description: 'Skip tests')
    }
    
    stages {
        stage('Deploy') {
            steps {
                echo "Deploying to ${params.ENVIRONMENT}"
                echo "Using browser: ${params.BROWSER}"
            }
        }
        
        stage('Test') {
            when {
                expression { params.SKIP_TESTS == false }
            }
            steps {
                sh 'npm test'
            }
        }
    }
}
```

### Pipeline with Triggers

```groovy
pipeline {
    agent any
    
    triggers {
        pollSCM('H/5 * * * *')
        cron('H 2 * * *')
    }
    
    stages {
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
    }
}
```

### Pipeline with Post Actions

```groovy
pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
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
            junit 'test-results/*.xml'
            archiveArtifacts artifacts: 'dist/**/*'
            cleanWs()
        }
        success {
            echo 'Build succeeded!'
            slackSend channel: '#builds', message: 'Build succeeded!'
        }
        failure {
            echo 'Build failed!'
            emailext subject: 'Build Failed',
                body: 'Check console output',
                to: 'team@example.com'
        }
    }
}
```

### Pipeline from SCM

```
Pipeline:
  Definition: Pipeline script from SCM
  SCM: Git
  Repository URL: https://github.com/user/repo.git
  Credentials: github-credentials
  Branch: */main
  Script Path: Jenkinsfile
```

### Jenkinsfile Location

```
Repository structure:
├── Jenkinsfile          # Root level (default)
├── ci/
│   └── Jenkinsfile      # Custom path
├── src/
└── package.json
```

### Best Practices

```
✅ Use declarative syntax
✅ Store Jenkinsfile in repository
✅ Use meaningful stage names
✅ Configure post actions
✅ Set timeouts
✅ Use credentials plugin
✅ Archive artifacts
```

