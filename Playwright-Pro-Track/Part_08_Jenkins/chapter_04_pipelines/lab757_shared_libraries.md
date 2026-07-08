# Lab 757: Shared Libraries

## LEARNING CONCEPT

Creating and using shared libraries for reusable pipeline code.

## EXERCISE

1. Create shared library
2. Use library in pipeline
3. Implement common patterns

## SOLUTION

### Library Structure

```
my-shared-library/
├── vars/
│   ├── buildApp.groovy
│   ├── deployApp.groovy
│   └── notifySlack.groovy
├── src/
│   └── org/
│       └── example/
│           └── Utils.groovy
├── resources/
│   └── templates/
│       └── email.html
└── README.md
```

### Simple Global Variable

```groovy
// vars/sayHello.groovy
def call(String name = 'World') {
    echo "Hello, ${name}!"
}
```

```groovy
// Jenkinsfile
@Library('my-shared-library') _

pipeline {
    agent any
    stages {
        stage('Greet') {
            steps {
                sayHello 'Jenkins'
            }
        }
    }
}
```

### Build Pipeline Function

```groovy
// vars/buildApp.groovy
def call(Map config = [:]) {
    def appName = config.appName ?: 'app'
    def nodeVersion = config.nodeVersion ?: '18'
    
    pipeline {
        agent {
            docker { image "node:${nodeVersion}" }
        }
        
        options {
            buildDiscarder(logRotator(numToKeepStr: '10'))
            timeout(time: 30, unit: 'MINUTES')
        }
        
        stages {
            stage('Install') {
                steps {
                    sh 'npm ci'
                }
            }
            
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
                cleanWs()
            }
        }
    }
}
```

```groovy
// Jenkinsfile
@Library('my-shared-library') _

buildApp(
    appName: 'my-app',
    nodeVersion: '20'
)
```

### Notification Function

```groovy
// vars/notifySlack.groovy
def call(Map config = [:]) {
    def channel = config.channel ?: '#builds'
    def status = config.status ?: currentBuild.result ?: 'SUCCESS'
    def color = status == 'SUCCESS' ? 'good' : 'danger'
    
    def message = """
        *${status}*: ${env.JOB_NAME} #${env.BUILD_NUMBER}
        <${env.BUILD_URL}|View Build>
    """.stripIndent()
    
    slackSend(
        channel: channel,
        color: color,
        message: message
    )
}
```

```groovy
// Jenkinsfile
@Library('my-shared-library') _

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
            notifySlack(channel: '#ci-builds')
        }
    }
}
```

### Deploy Function

```groovy
// vars/deployApp.groovy
def call(Map config) {
    def environment = config.environment
    def version = config.version ?: env.BUILD_NUMBER
    
    echo "Deploying version ${version} to ${environment}"
    
    withCredentials([
        usernamePassword(
            credentialsId: "${environment}-deploy-creds",
            usernameVariable: 'DEPLOY_USER',
            passwordVariable: 'DEPLOY_PASS'
        )
    ]) {
        sh """
            ./deploy.sh \
                --env ${environment} \
                --version ${version} \
                --user \$DEPLOY_USER \
                --pass \$DEPLOY_PASS
        """
    }
}
```

### Class-based Library

```groovy
// src/org/example/Docker.groovy
package org.example

class Docker implements Serializable {
    def steps
    
    Docker(steps) {
        this.steps = steps
    }
    
    def build(String imageName, String tag = 'latest') {
        steps.sh "docker build -t ${imageName}:${tag} ."
    }
    
    def push(String imageName, String tag = 'latest') {
        steps.sh "docker push ${imageName}:${tag}"
    }
}
```

```groovy
// vars/docker.groovy
import org.example.Docker

def call() {
    return new Docker(this)
}
```

```groovy
// Jenkinsfile
@Library('my-shared-library') _

pipeline {
    agent any
    stages {
        stage('Build Image') {
            steps {
                script {
                    docker().build('my-app', env.BUILD_NUMBER)
                    docker().push('my-app', env.BUILD_NUMBER)
                }
            }
        }
    }
}
```

### Configure Library in Jenkins

```
Manage Jenkins → System → Global Pipeline Libraries

Name: my-shared-library
Default version: main
Load implicitly: false
Allow default version to be overridden: true

Retrieval method: Modern SCM
  Git:
    Project Repository: https://github.com/org/shared-library.git
    Credentials: github-credentials
```

### Load Library Dynamically

```groovy
// Load specific version
@Library('my-shared-library@v1.0.0') _

// Load from branch
@Library('my-shared-library@feature-branch') _

// Load multiple libraries
@Library(['my-shared-library', 'another-library']) _

// Dynamic loading
library 'my-shared-library@main'
```

### Best Practices

```
✅ Version your library
✅ Write tests for library code
✅ Document functions
✅ Use meaningful names
✅ Handle errors gracefully
✅ Keep functions focused
```

