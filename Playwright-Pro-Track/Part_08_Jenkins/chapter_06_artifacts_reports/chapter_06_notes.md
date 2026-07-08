# Part 06: Artifacts and Reports

## 📚 Overview
Managing artifacts and reports in Jenkins preserves build outputs and provides test visibility.

---

## 🎯 Key Concepts

### 1. Archiving Artifacts

```groovy
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
        always {
            // Archive test results
            archiveArtifacts artifacts: 'test-results/**', allowEmptyArchive: true
            
            // Archive reports
            archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
            
            // Archive specific files
            archiveArtifacts artifacts: '**/*.log', allowEmptyArchive: true
        }
    }
}
```

### 2. Archive Options

```groovy
archiveArtifacts(
    artifacts: 'dist/**/*.js',
    allowEmptyArchive: true,      // Don't fail if no files
    fingerprint: true,            // Track file usage
    onlyIfSuccessful: false,      // Archive even on failure
    excludes: '**/*.map'          // Exclude patterns
)
```

### 3. JUnit Test Results

```groovy
pipeline {
    agent any
    
    stages {
        stage('Test') {
            steps {
                sh 'npx playwright test --reporter=junit'
            }
        }
    }
    
    post {
        always {
            // Publish JUnit results
            junit(
                testResults: '**/junit.xml',
                allowEmptyResults: true,
                skipPublishingChecks: false
            )
        }
    }
}
```

### 4. HTML Reports

```groovy
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
        always {
            publishHTML([
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright Report',
                reportTitles: 'E2E Test Results'
            ])
        }
    }
}
```

### 5. Multiple Reports

```groovy
post {
    always {
        // Playwright HTML report
        publishHTML([
            reportDir: 'playwright-report',
            reportFiles: 'index.html',
            reportName: 'Playwright Report'
        ])
        
        // Coverage report
        publishHTML([
            reportDir: 'coverage/lcov-report',
            reportFiles: 'index.html',
            reportName: 'Coverage Report'
        ])
        
        // Allure report
        allure([
            results: [[path: 'allure-results']]
        ])
    }
}
```

### 6. Stash and Unstash

```groovy
pipeline {
    agent none
    
    stages {
        stage('Build') {
            agent { label 'builder' }
            steps {
                sh 'npm run build'
                stash name: 'build-output', includes: 'dist/**'
            }
        }
        
        stage('Test') {
            agent { label 'tester' }
            steps {
                unstash 'build-output'
                sh 'npx playwright test'
                stash name: 'test-results', includes: 'test-results/**'
            }
        }
        
        stage('Report') {
            agent any
            steps {
                unstash 'test-results'
                junit '**/junit.xml'
            }
        }
    }
}
```

### 7. Fingerprinting

```groovy
pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
                sh 'npm run build'
            }
            post {
                success {
                    // Fingerprint for tracking
                    fingerprint 'dist/**/*.js'
                }
            }
        }
    }
}
```

### 8. Artifact Retention

```groovy
pipeline {
    agent any
    
    options {
        // Keep artifacts for last 10 builds
        buildDiscarder(logRotator(
            numToKeepStr: '10',
            artifactNumToKeepStr: '5'
        ))
    }
    
    stages {
        stage('Test') {
            steps {
                sh 'npx playwright test'
            }
        }
    }
    
    post {
        always {
            archiveArtifacts artifacts: 'playwright-report/**'
        }
    }
}
```

### 9. Custom Report Dashboard

```groovy
pipeline {
    agent any
    
    stages {
        stage('Test') {
            steps {
                sh 'npx playwright test --reporter=json'
            }
        }
    }
    
    post {
        always {
            script {
                def results = readJSON file: 'test-results.json'
                def passed = results.stats.expected
                def failed = results.stats.unexpected
                
                // Update build description
                currentBuild.description = "Passed: ${passed}, Failed: ${failed}"
                
                // Set build status
                if (failed > 0) {
                    currentBuild.result = 'UNSTABLE'
                }
            }
        }
    }
}
```

---

## 💻 Practice Exercises

1. Archive test artifacts
2. Publish JUnit results
3. Create HTML reports
4. Use stash/unstash
5. Configure retention

---

## ✅ Best Practices

- ✅ Always archive on failure
- ✅ Use allowEmptyArchive
- ✅ Publish HTML reports
- ✅ Configure retention policies
- ❌ Don't archive large files
- ❌ Avoid archiving node_modules

---

## 📝 Quick Reference

```groovy
// Archive
archiveArtifacts artifacts: 'path/**', allowEmptyArchive: true

// JUnit
junit '**/junit.xml'

// HTML Report
publishHTML([
    reportDir: 'report',
    reportFiles: 'index.html',
    reportName: 'Report Name'
])

// Stash/Unstash
stash name: 'name', includes: 'path/**'
unstash 'name'

// Retention
buildDiscarder(logRotator(numToKeepStr: '10'))
```

