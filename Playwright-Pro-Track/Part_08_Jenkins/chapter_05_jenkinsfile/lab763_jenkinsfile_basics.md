# Lab 763: Jenkinsfile Basics

## LEARNING CONCEPT

Understanding Jenkinsfile fundamentals.

## EXERCISE

1. Create basic Jenkinsfile
2. Configure pipeline from SCM
3. Understand file structure

## SOLUTION

### Basic Jenkinsfile

```groovy
// Jenkinsfile
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
            }
        }
    }
}
```

### File Location

```
Repository structure:
├── Jenkinsfile          # Default location (root)
├── src/
├── tests/
└── package.json

Alternative locations:
├── ci/
│   └── Jenkinsfile      # Custom path
├── .jenkins/
│   └── Jenkinsfile
└── pipelines/
    ├── build.jenkinsfile
    └── deploy.jenkinsfile
```

### Configure in Jenkins

```
Pipeline Job:
1. New Item → Pipeline
2. Pipeline section:
   - Definition: Pipeline script from SCM
   - SCM: Git
   - Repository URL: https://github.com/user/repo.git
   - Credentials: github-credentials
   - Branch: */main
   - Script Path: Jenkinsfile
```

### Jenkinsfile with All Sections

```groovy
pipeline {
    // Where to run
    agent any
    
    // Pipeline options
    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
        timestamps()
    }
    
    // Environment variables
    environment {
        APP_NAME = 'my-app'
        VERSION = '1.0.0'
    }
    
    // Build parameters
    parameters {
        string(name: 'DEPLOY_ENV', defaultValue: 'staging')
        booleanParam(name: 'RUN_TESTS', defaultValue: true)
    }
    
    // Build triggers
    triggers {
        pollSCM('H/5 * * * *')
    }
    
    // Tools
    tools {
        nodejs 'Node18'
    }
    
    // Stages
    stages {
        stage('Build') {
            steps {
                sh 'npm ci'
                sh 'npm run build'
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
        
        stage('Deploy') {
            steps {
                sh "./deploy.sh ${params.DEPLOY_ENV}"
            }
        }
    }
    
    // Post-build actions
    post {
        always {
            junit 'test-results/*.xml'
            cleanWs()
        }
        success {
            echo 'Build succeeded!'
        }
        failure {
            echo 'Build failed!'
        }
    }
}
```

### Comments in Jenkinsfile

```groovy
// Single line comment

/*
 * Multi-line comment
 * describing the pipeline
 */

/**
 * Jenkinsfile for My Application
 * 
 * This pipeline builds, tests, and deploys the application.
 * 
 * Parameters:
 *   - DEPLOY_ENV: Target environment (staging/production)
 *   - RUN_TESTS: Whether to run tests
 */
pipeline {
    agent any
    
    stages {
        // Build stage - compiles the application
        stage('Build') {
            steps {
                sh 'npm run build'  // Run build command
            }
        }
    }
}
```

### Jenkinsfile Validation

```bash
# Using Jenkins CLI
java -jar jenkins-cli.jar -s http://jenkins:8080/ \
    declarative-linter < Jenkinsfile

# Using curl
curl -X POST -F "jenkinsfile=<Jenkinsfile" \
    http://jenkins:8080/pipeline-model-converter/validate
```

### Multiple Jenkinsfiles

```
Repository:
├── Jenkinsfile              # Main pipeline
├── Jenkinsfile.deploy       # Deployment pipeline
├── Jenkinsfile.nightly      # Nightly build
└── ci/
    ├── Jenkinsfile.test     # Test pipeline
    └── Jenkinsfile.release  # Release pipeline
```

### Jenkinsfile for Different Branches

```groovy
pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
        
        stage('Deploy Dev') {
            when { branch 'develop' }
            steps {
                sh './deploy.sh dev'
            }
        }
        
        stage('Deploy Staging') {
            when { branch 'release/*' }
            steps {
                sh './deploy.sh staging'
            }
        }
        
        stage('Deploy Production') {
            when { branch 'main' }
            steps {
                input 'Deploy to production?'
                sh './deploy.sh production'
            }
        }
    }
}
```

### Best Practices

```
✅ Keep Jenkinsfile in repository root
✅ Use declarative syntax
✅ Add comments for complex logic
✅ Validate before committing
✅ Version control changes
✅ Keep it simple and readable
```

