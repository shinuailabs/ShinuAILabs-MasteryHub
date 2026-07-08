# Lab 750: Build Artifacts

## LEARNING CONCEPT

Managing build artifacts in Jenkins.

## EXERCISE

1. Archive artifacts
2. Access artifacts
3. Manage artifact retention

## SOLUTION

### Archive Artifacts

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
        success {
            archiveArtifacts artifacts: 'dist/**/*', fingerprint: true
        }
    }
}
```

### Archive Patterns

```groovy
// Single file
archiveArtifacts artifacts: 'build/app.jar'

// Directory
archiveArtifacts artifacts: 'dist/**/*'

// Multiple patterns
archiveArtifacts artifacts: 'dist/**/*.js, dist/**/*.css'

// Exclude patterns
archiveArtifacts artifacts: 'dist/**/*', excludes: '**/*.map'

// With options
archiveArtifacts(
    artifacts: 'dist/**/*',
    fingerprint: true,
    onlyIfSuccessful: true,
    allowEmptyArchive: false
)
```

### Archive in Stage

```groovy
pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
                sh 'npm run build'
                archiveArtifacts artifacts: 'dist/**/*'
            }
        }
        
        stage('Test') {
            steps {
                sh 'npm test'
            }
            post {
                always {
                    archiveArtifacts artifacts: 'test-results/**/*'
                }
            }
        }
    }
}
```

### Stash and Unstash

```groovy
pipeline {
    agent none
    
    stages {
        stage('Build') {
            agent { label 'linux' }
            steps {
                sh 'npm run build'
                stash includes: 'dist/**/*', name: 'build-artifacts'
            }
        }
        
        stage('Deploy') {
            agent { label 'deploy-server' }
            steps {
                unstash 'build-artifacts'
                sh './deploy.sh'
            }
        }
    }
}
```

### Copy Artifacts from Another Job

```groovy
pipeline {
    agent any
    
    stages {
        stage('Get Artifacts') {
            steps {
                copyArtifacts(
                    projectName: 'build-job',
                    filter: 'dist/**/*',
                    selector: lastSuccessful(),
                    target: 'artifacts'
                )
            }
        }
        
        stage('Deploy') {
            steps {
                sh 'ls -la artifacts/'
                sh './deploy.sh artifacts/'
            }
        }
    }
}
```

### Artifact Selectors

```groovy
// Last successful build
selector: lastSuccessful()

// Last completed build
selector: lastCompleted()

// Specific build number
selector: specific('42')

// Upstream build
selector: upstream()

// Build with parameters
selector: buildParameter('BUILD_SELECTOR')
```

### Fingerprinting

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
        success {
            // Fingerprint for tracking
            archiveArtifacts artifacts: 'dist/**/*', fingerprint: true
            
            // Or fingerprint separately
            fingerprint 'dist/**/*.js'
        }
    }
}
```

### Artifact Retention

```groovy
pipeline {
    agent any
    
    options {
        buildDiscarder(logRotator(
            numToKeepStr: '10',
            artifactNumToKeepStr: '5'
        ))
    }
    
    stages {
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
    }
    
    post {
        success {
            archiveArtifacts artifacts: 'dist/**/*'
        }
    }
}
```

### Access Artifacts

```
Via UI:
1. Go to build page
2. Click "Build Artifacts"
3. Download files

Via API:
curl -O http://jenkins:8080/job/my-job/lastSuccessfulBuild/artifact/dist/app.js

Via CLI:
java -jar jenkins-cli.jar -s http://jenkins:8080/ \
    get-job my-job | grep artifact
```

### Publish to External Storage

```groovy
pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
        
        stage('Publish') {
            steps {
                // S3
                s3Upload(
                    bucket: 'my-artifacts',
                    path: 'builds/${BUILD_NUMBER}/',
                    includePathPattern: 'dist/**/*'
                )
                
                // Nexus
                nexusArtifactUploader(
                    nexusVersion: 'nexus3',
                    protocol: 'https',
                    nexusUrl: 'nexus.example.com',
                    repository: 'releases',
                    credentialsId: 'nexus-creds',
                    artifacts: [[
                        artifactId: 'my-app',
                        file: 'dist/app.jar',
                        type: 'jar'
                    ]]
                )
            }
        }
    }
}
```

### Best Practices

```
✅ Archive only necessary files
✅ Use fingerprinting for tracking
✅ Configure retention policies
✅ Use stash for cross-agent sharing
✅ Consider external artifact storage
✅ Exclude source maps and dev files
```

