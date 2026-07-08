# Lab 776: Test Reporting Plugins

## LEARNING CONCEPT

Using plugins for test result reporting.

## EXERCISE

1. Configure JUnit plugin
2. Publish HTML reports
3. Use Allure reporting

## SOLUTION

### JUnit Plugin

```
Install: JUnit Plugin

Features:
- Parse JUnit XML reports
- Test trends
- Failure analysis
```

### Publish JUnit Results

```groovy
pipeline {
    agent any
    
    stages {
        stage('Test') {
            steps {
                sh 'npm test'
            }
            post {
                always {
                    junit 'test-results/*.xml'
                }
            }
        }
    }
}
```

### JUnit with Options

```groovy
pipeline {
    agent any
    
    stages {
        stage('Test') {
            steps {
                sh 'npm test'
            }
            post {
                always {
                    junit(
                        testResults: 'test-results/**/*.xml',
                        allowEmptyResults: true,
                        skipPublishingChecks: false,
                        healthScaleFactor: 1.0
                    )
                }
            }
        }
    }
}
```

### HTML Publisher Plugin

```
Install: HTML Publisher Plugin

Features:
- Publish HTML reports
- Coverage reports
- Custom reports
```

### Publish HTML Report

```groovy
pipeline {
    agent any
    
    stages {
        stage('Test') {
            steps {
                sh 'npm test'
                sh 'npm run coverage'
            }
            post {
                always {
                    publishHTML([
                        reportDir: 'coverage',
                        reportFiles: 'index.html',
                        reportName: 'Coverage Report',
                        keepAll: true,
                        alwaysLinkToLastBuild: true,
                        allowMissing: false
                    ])
                }
            }
        }
    }
}
```

### Multiple HTML Reports

```groovy
post {
    always {
        publishHTML([
            reportDir: 'coverage',
            reportFiles: 'index.html',
            reportName: 'Coverage Report'
        ])
        
        publishHTML([
            reportDir: 'playwright-report',
            reportFiles: 'index.html',
            reportName: 'Playwright Report'
        ])
        
        publishHTML([
            reportDir: 'docs',
            reportFiles: 'index.html',
            reportName: 'Documentation'
        ])
    }
}
```

### Allure Plugin

```
Install: Allure Jenkins Plugin

Features:
- Rich test reports
- Test history
- Categories and trends
```

### Configure Allure

```
Manage Jenkins → Tools → Allure Commandline

Allure Commandline installations:
  Name: Allure
  Install automatically: ✓
  Version: 2.24.0
```

### Publish Allure Report

```groovy
pipeline {
    agent any
    
    stages {
        stage('Test') {
            steps {
                sh 'npm test'
            }
            post {
                always {
                    allure([
                        results: [[path: 'allure-results']]
                    ])
                }
            }
        }
    }
}
```

### Allure with Options

```groovy
post {
    always {
        allure([
            results: [[path: 'allure-results']],
            reportBuildPolicy: 'ALWAYS',
            includeProperties: true,
            jdk: '',
            properties: [],
            report: 'allure-report'
        ])
    }
}
```

### Playwright with JUnit

```groovy
// playwright.config.ts
reporter: [
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['html', { outputFolder: 'playwright-report' }]
]
```

```groovy
pipeline {
    agent any
    
    stages {
        stage('Test') {
            steps {
                sh 'npx playwright test'
            }
            post {
                always {
                    junit 'test-results/junit.xml'
                    publishHTML([
                        reportDir: 'playwright-report',
                        reportFiles: 'index.html',
                        reportName: 'Playwright Report'
                    ])
                }
            }
        }
    }
}
```

### Test Trends

```
JUnit plugin provides:
- Test result trends
- Pass/fail history
- Duration trends
- Failure analysis

View in:
- Job page → Test Result Trend
- Build page → Test Result
```

### Archive Test Artifacts

```groovy
post {
    always {
        junit 'test-results/*.xml'
        
        archiveArtifacts(
            artifacts: 'test-results/**/*',
            allowEmptyArchive: true
        )
    }
    
    failure {
        archiveArtifacts(
            artifacts: 'screenshots/**/*',
            allowEmptyArchive: true
        )
    }
}
```

### Best Practices

```
✅ Always publish test results
✅ Use allowEmptyResults for optional tests
✅ Archive test artifacts
✅ Configure test trends
✅ Use appropriate report format
✅ Keep reports for debugging
```

