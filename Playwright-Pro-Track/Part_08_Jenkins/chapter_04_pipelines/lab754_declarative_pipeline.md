# Lab 754: Declarative Pipeline

## LEARNING CONCEPT

Understanding declarative pipeline syntax in Jenkins.

## EXERCISE

1. Create declarative pipeline
2. Use pipeline directives
3. Configure stages and steps

## SOLUTION

### Basic Structure

```groovy
pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
                echo 'Building...'
            }
        }
        
        stage('Test') {
            steps {
                echo 'Testing...'
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

### Agent Directive

```groovy
// Any available agent
pipeline {
    agent any
    stages { ... }
}

// Specific label
pipeline {
    agent { label 'linux' }
    stages { ... }
}

// Docker agent
pipeline {
    agent {
        docker {
            image 'node:18'
            args '-v /tmp:/tmp'
        }
    }
    stages { ... }
}

// No agent (define per stage)
pipeline {
    agent none
    stages {
        stage('Build') {
            agent { label 'linux' }
            steps { ... }
        }
    }
}
```

### Options Directive

```groovy
pipeline {
    agent any
    
    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
        timestamps()
        disableConcurrentBuilds()
        skipDefaultCheckout()
        retry(3)
        quietPeriod(30)
    }
    
    stages { ... }
}
```

### Environment Directive

```groovy
pipeline {
    agent any
    
    environment {
        // Global environment
        APP_NAME = 'my-app'
        VERSION = '1.0.0'
        CREDENTIALS = credentials('my-credentials')
    }
    
    stages {
        stage('Build') {
            environment {
                // Stage-specific environment
                BUILD_ENV = 'production'
            }
            steps {
                echo "Building ${APP_NAME} v${VERSION}"
                echo "Environment: ${BUILD_ENV}"
            }
        }
    }
}
```

### Parameters Directive

```groovy
pipeline {
    agent any
    
    parameters {
        string(name: 'VERSION', defaultValue: '1.0.0', description: 'Version')
        choice(name: 'ENV', choices: ['dev', 'staging', 'prod'], description: 'Environment')
        booleanParam(name: 'DEPLOY', defaultValue: true, description: 'Deploy?')
    }
    
    stages {
        stage('Build') {
            steps {
                echo "Version: ${params.VERSION}"
                echo "Environment: ${params.ENV}"
            }
        }
    }
}
```

### Triggers Directive

```groovy
pipeline {
    agent any
    
    triggers {
        pollSCM('H/5 * * * *')
        cron('H 2 * * *')
        upstream(upstreamProjects: 'build-job', threshold: hudson.model.Result.SUCCESS)
    }
    
    stages { ... }
}
```

### Tools Directive

```groovy
pipeline {
    agent any
    
    tools {
        jdk 'JDK17'
        maven 'Maven3'
        nodejs 'Node18'
    }
    
    stages {
        stage('Build') {
            steps {
                sh 'java -version'
                sh 'mvn -version'
                sh 'node -version'
            }
        }
    }
}
```

### When Directive

```groovy
pipeline {
    agent any
    
    stages {
        stage('Deploy Staging') {
            when {
                branch 'develop'
            }
            steps {
                echo 'Deploying to staging'
            }
        }
        
        stage('Deploy Production') {
            when {
                allOf {
                    branch 'main'
                    environment name: 'DEPLOY', value: 'true'
                }
            }
            steps {
                echo 'Deploying to production'
            }
        }
    }
}
```

### Input Directive

```groovy
pipeline {
    agent any
    
    stages {
        stage('Deploy') {
            input {
                message 'Deploy to production?'
                ok 'Deploy'
                submitter 'admin,deployer'
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

### Post Directive

```groovy
pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
    }
    
    post {
        always {
            echo 'Always runs'
            cleanWs()
        }
        success {
            echo 'Build succeeded'
        }
        failure {
            echo 'Build failed'
        }
        unstable {
            echo 'Build unstable'
        }
        changed {
            echo 'Build status changed'
        }
    }
}
```

### Complete Example

```groovy
pipeline {
    agent any
    
    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
        timestamps()
    }
    
    environment {
        APP_NAME = 'my-app'
    }
    
    stages {
        stage('Build') {
            steps {
                sh 'npm ci'
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
            cleanWs()
        }
    }
}
```

