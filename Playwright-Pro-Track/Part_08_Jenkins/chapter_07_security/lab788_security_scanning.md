# Lab 788: Security Scanning

## LEARNING CONCEPT

Implementing security scanning in Jenkins pipelines.

## EXERCISE

1. Integrate SAST tools
2. Implement dependency scanning
3. Add container scanning

## SOLUTION

### SAST (Static Analysis)

```groovy
pipeline {
    agent any
    
    stages {
        stage('SAST') {
            steps {
                // SonarQube analysis
                withSonarQubeEnv('SonarQube') {
                    sh 'npm run sonar'
                }
            }
        }
        
        stage('Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }
    }
}
```

### SonarQube Integration

```
Install: SonarQube Scanner Plugin

Configure:
Manage Jenkins → System → SonarQube servers

Name: SonarQube
Server URL: https://sonar.example.com
Server authentication token: sonar-token
```

### Dependency Scanning

```groovy
pipeline {
    agent any
    
    stages {
        stage('Dependency Check') {
            steps {
                // OWASP Dependency Check
                dependencyCheck(
                    additionalArguments: '--scan ./ --format HTML --format XML',
                    odcInstallation: 'OWASP-DC'
                )
                
                dependencyCheckPublisher(
                    pattern: 'dependency-check-report.xml'
                )
            }
        }
    }
}
```

### npm Audit

```groovy
pipeline {
    agent {
        docker { image 'node:18' }
    }
    
    stages {
        stage('Install') {
            steps {
                sh 'npm ci'
            }
        }
        
        stage('Security Audit') {
            steps {
                // npm audit
                sh 'npm audit --audit-level=high'
                
                // Or with JSON output
                sh 'npm audit --json > audit-report.json || true'
                
                script {
                    def audit = readJSON file: 'audit-report.json'
                    if (audit.metadata.vulnerabilities.high > 0) {
                        unstable 'High vulnerabilities found'
                    }
                }
            }
        }
    }
}
```

### Snyk Integration

```groovy
pipeline {
    agent any
    
    environment {
        SNYK_TOKEN = credentials('snyk-token')
    }
    
    stages {
        stage('Snyk Test') {
            steps {
                sh 'npm install -g snyk'
                sh 'snyk auth $SNYK_TOKEN'
                sh 'snyk test --severity-threshold=high'
            }
        }
        
        stage('Snyk Monitor') {
            when { branch 'main' }
            steps {
                sh 'snyk monitor'
            }
        }
    }
}
```

### Container Scanning

```groovy
pipeline {
    agent any
    
    stages {
        stage('Build Image') {
            steps {
                sh 'docker build -t my-app:${BUILD_NUMBER} .'
            }
        }
        
        stage('Scan Image') {
            steps {
                // Trivy scanner
                sh '''
                    docker run --rm \
                        -v /var/run/docker.sock:/var/run/docker.sock \
                        aquasec/trivy image \
                        --severity HIGH,CRITICAL \
                        --exit-code 1 \
                        my-app:${BUILD_NUMBER}
                '''
            }
        }
    }
}
```

### Trivy Integration

```groovy
pipeline {
    agent any
    
    stages {
        stage('Trivy Scan') {
            steps {
                sh '''
                    # Scan filesystem
                    trivy fs --severity HIGH,CRITICAL .
                    
                    # Scan image
                    trivy image --severity HIGH,CRITICAL my-app:latest
                    
                    # Generate report
                    trivy image --format json -o trivy-report.json my-app:latest
                '''
                
                archiveArtifacts artifacts: 'trivy-report.json'
            }
        }
    }
}
```

### Secret Scanning

```groovy
pipeline {
    agent any
    
    stages {
        stage('Secret Scan') {
            steps {
                // Gitleaks
                sh '''
                    docker run --rm \
                        -v $(pwd):/path \
                        zricethezav/gitleaks:latest \
                        detect --source=/path --verbose
                '''
            }
        }
    }
}
```

### Complete Security Pipeline

```groovy
pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Security Scans') {
            parallel {
                stage('SAST') {
                    steps {
                        withSonarQubeEnv('SonarQube') {
                            sh 'npm run sonar'
                        }
                    }
                }
                
                stage('Dependencies') {
                    steps {
                        sh 'npm audit --audit-level=high'
                    }
                }
                
                stage('Secrets') {
                    steps {
                        sh 'gitleaks detect --verbose'
                    }
                }
            }
        }
        
        stage('Build Image') {
            steps {
                sh 'docker build -t my-app .'
            }
        }
        
        stage('Container Scan') {
            steps {
                sh 'trivy image --severity HIGH,CRITICAL my-app'
            }
        }
    }
    
    post {
        always {
            archiveArtifacts artifacts: '*-report.*', allowEmptyArchive: true
        }
    }
}
```

### Security Gate

```groovy
stage('Security Gate') {
    steps {
        script {
            def issues = 0
            
            // Check various scan results
            if (fileExists('audit-report.json')) {
                def audit = readJSON file: 'audit-report.json'
                issues += audit.metadata.vulnerabilities.critical
            }
            
            if (issues > 0) {
                error "Security gate failed: ${issues} critical issues"
            }
        }
    }
}
```

### Best Practices

```
✅ Scan early in pipeline
✅ Fail on critical vulnerabilities
✅ Scan dependencies and containers
✅ Check for secrets
✅ Generate reports
✅ Track trends over time
✅ Integrate with security tools
```

