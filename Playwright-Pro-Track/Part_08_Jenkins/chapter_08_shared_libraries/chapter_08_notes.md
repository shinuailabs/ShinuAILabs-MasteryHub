# Part 08: Shared Libraries

## 📚 Overview
Jenkins Shared Libraries enable reusable pipeline code across multiple projects.

---

## 🎯 Key Concepts

### 1. Library Structure

```
shared-library/
├── vars/
│   ├── playwrightTest.groovy    # Global variables/functions
│   ├── notifySlack.groovy
│   └── deployApp.groovy
├── src/
│   └── com/
│       └── example/
│           ├── Pipeline.groovy   # Classes
│           └── Utils.groovy
├── resources/
│   └── templates/
│       └── email.html
└── README.md
```

### 2. Global Variables (vars/)

```groovy
// vars/playwrightTest.groovy
def call(Map config = [:]) {
    def browser = config.browser ?: 'chromium'
    def workers = config.workers ?: 4
    
    pipeline {
        agent {
            docker {
                image 'mcr.microsoft.com/playwright:v1.40.0-jammy'
            }
        }
        
        stages {
            stage('Install') {
                steps {
                    sh 'npm ci'
                }
            }
            
            stage('Test') {
                steps {
                    sh "npx playwright test --project=${browser} --workers=${workers}"
                }
            }
        }
        
        post {
            always {
                archiveArtifacts artifacts: 'playwright-report/**'
                junit 'test-results/junit.xml'
            }
        }
    }
}
```

### 3. Using Shared Library

```groovy
// Jenkinsfile
@Library('my-shared-library') _

playwrightTest(
    browser: 'chromium',
    workers: 4
)
```

### 4. Helper Functions

```groovy
// vars/notifySlack.groovy
def call(String status, String channel = '#builds') {
    def color = status == 'SUCCESS' ? 'good' : 'danger'
    def emoji = status == 'SUCCESS' ? '✅' : '❌'
    
    slackSend(
        channel: channel,
        color: color,
        message: "${emoji} ${status}: ${env.JOB_NAME} #${env.BUILD_NUMBER}\n${env.BUILD_URL}"
    )
}

// Usage in Jenkinsfile
@Library('my-shared-library') _

pipeline {
    agent any
    stages {
        stage('Test') {
            steps {
                sh 'npx playwright test'
            }
        }
    }
    post {
        success { notifySlack('SUCCESS') }
        failure { notifySlack('FAILURE') }
    }
}
```

### 5. Classes (src/)

```groovy
// src/com/example/PlaywrightRunner.groovy
package com.example

class PlaywrightRunner implements Serializable {
    def script
    String browser
    int workers
    
    PlaywrightRunner(script, Map config = [:]) {
        this.script = script
        this.browser = config.browser ?: 'chromium'
        this.workers = config.workers ?: 4
    }
    
    def run() {
        script.sh "npx playwright test --project=${browser} --workers=${workers}"
    }
    
    def runWithRetry(int retries = 2) {
        script.retry(retries) {
            run()
        }
    }
}

// vars/runPlaywright.groovy
import com.example.PlaywrightRunner

def call(Map config = [:]) {
    def runner = new PlaywrightRunner(this, config)
    runner.runWithRetry()
}
```

### 6. Configuring Library

```groovy
// In Jenkins: Manage Jenkins > Configure System > Global Pipeline Libraries

// Or in Jenkinsfile
@Library('my-shared-library@main') _

// Or with specific version
@Library('my-shared-library@v1.0.0') _

// Multiple libraries
@Library(['lib1', 'lib2@develop']) _
```

### 7. Pipeline Templates

```groovy
// vars/standardPipeline.groovy
def call(Map config) {
    pipeline {
        agent any
        
        options {
            timeout(time: config.timeout ?: 30, unit: 'MINUTES')
            buildDiscarder(logRotator(numToKeepStr: '10'))
        }
        
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
                    sh config.testCommand ?: 'npm test'
                }
            }
            
            stage('Build') {
                when { expression { config.build } }
                steps {
                    sh config.buildCommand ?: 'npm run build'
                }
            }
        }
        
        post {
            always {
                archiveArtifacts artifacts: config.artifacts ?: '**/*.log'
            }
            failure {
                notifySlack('FAILURE', config.slackChannel ?: '#builds')
            }
        }
    }
}

// Usage
@Library('my-shared-library') _

standardPipeline(
    testCommand: 'npx playwright test',
    build: true,
    artifacts: 'playwright-report/**',
    slackChannel: '#qa-team'
)
```

### 8. Resource Files

```groovy
// resources/templates/report.html
// HTML template file

// vars/generateReport.groovy
def call(Map data) {
    def template = libraryResource('templates/report.html')
    def report = template
        .replace('{{jobName}}', data.jobName)
        .replace('{{buildNumber}}', data.buildNumber)
        .replace('{{status}}', data.status)
    
    writeFile file: 'report.html', text: report
}
```

---

## 💻 Practice Exercises

1. Create shared library structure
2. Write global variables
3. Create helper functions
4. Build pipeline templates
5. Use resource files

---

## ✅ Best Practices

- ✅ Version your library
- ✅ Document functions
- ✅ Use meaningful names
- ✅ Keep functions focused
- ❌ Don't hardcode values
- ❌ Avoid complex logic in vars/

---

## 📝 Quick Reference

```groovy
// Import library
@Library('library-name') _
@Library('library-name@version') _

// vars/myFunction.groovy
def call(Map config = [:]) {
    // Implementation
}

// Usage
myFunction(param: 'value')

// Class usage
import com.example.MyClass
def obj = new MyClass(this)
```

