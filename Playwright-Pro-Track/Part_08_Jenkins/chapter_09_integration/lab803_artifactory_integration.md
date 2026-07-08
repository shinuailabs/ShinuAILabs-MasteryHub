# Lab 803: Artifactory Integration

## LEARNING CONCEPT

Integrating Jenkins with JFrog Artifactory.

## EXERCISE

1. Configure Artifactory
2. Publish artifacts
3. Resolve dependencies

## SOLUTION

### Install Artifactory Plugin

```
Manage Jenkins → Plugins → Available
Install: Artifactory Plugin
```

### Configure Artifactory Server

```
Manage Jenkins → System → JFrog

JFrog Platform Instances → Add:
  Instance ID: artifactory
  JFrog Platform URL: https://company.jfrog.io
  Credentials: artifactory-credentials
```

### Publish npm Package

```groovy
pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
                sh 'npm ci'
                sh 'npm run build'
            }
        }
        
        stage('Publish') {
            steps {
                rtNpmPublish(
                    serverId: 'artifactory',
                    repo: 'npm-local',
                    path: 'dist/'
                )
            }
        }
    }
}
```

### Resolve npm Dependencies

```groovy
pipeline {
    agent any
    
    stages {
        stage('Install') {
            steps {
                rtNpmInstall(
                    serverId: 'artifactory',
                    repo: 'npm-remote'
                )
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

### Publish Docker Image

```groovy
pipeline {
    agent any
    
    environment {
        ARTIFACTORY_URL = 'company.jfrog.io'
        IMAGE_NAME = 'my-app'
    }
    
    stages {
        stage('Build Image') {
            steps {
                sh "docker build -t ${ARTIFACTORY_URL}/docker-local/${IMAGE_NAME}:${BUILD_NUMBER} ."
            }
        }
        
        stage('Push Image') {
            steps {
                rtDockerPush(
                    serverId: 'artifactory',
                    image: "${ARTIFACTORY_URL}/docker-local/${IMAGE_NAME}:${BUILD_NUMBER}",
                    targetRepo: 'docker-local'
                )
            }
        }
    }
}
```

### Build Info

```groovy
pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
                rtBuildInfo(
                    captureEnv: true,
                    maxBuilds: 10
                )
                
                sh 'npm ci'
                sh 'npm run build'
            }
        }
        
        stage('Publish') {
            steps {
                rtUpload(
                    serverId: 'artifactory',
                    spec: '''{
                        "files": [{
                            "pattern": "dist/*.js",
                            "target": "generic-local/my-app/${BUILD_NUMBER}/"
                        }]
                    }'''
                )
                
                rtPublishBuildInfo(serverId: 'artifactory')
            }
        }
    }
}
```

### Download Artifacts

```groovy
stage('Download') {
    steps {
        rtDownload(
            serverId: 'artifactory',
            spec: '''{
                "files": [{
                    "pattern": "generic-local/my-app/latest/*.js",
                    "target": "lib/"
                }]
            }'''
        )
    }
}
```

### Promote Build

```groovy
stage('Promote') {
    when { branch 'main' }
    steps {
        rtPromote(
            serverId: 'artifactory',
            sourceRepo: 'libs-staging-local',
            targetRepo: 'libs-release-local',
            status: 'Released',
            comment: 'Promoted by Jenkins'
        )
    }
}
```

### Maven Integration

```groovy
pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
                rtMavenDeployer(
                    id: 'maven-deployer',
                    serverId: 'artifactory',
                    releaseRepo: 'libs-release-local',
                    snapshotRepo: 'libs-snapshot-local'
                )
                
                rtMavenResolver(
                    id: 'maven-resolver',
                    serverId: 'artifactory',
                    releaseRepo: 'libs-release',
                    snapshotRepo: 'libs-snapshot'
                )
                
                rtMavenRun(
                    pom: 'pom.xml',
                    goals: 'clean install',
                    deployerId: 'maven-deployer',
                    resolverId: 'maven-resolver'
                )
            }
        }
    }
}
```

### Xray Scan

```groovy
stage('Security Scan') {
    steps {
        xrayScan(
            serverId: 'artifactory',
            failBuild: true
        )
    }
}
```

### Best Practices

```
✅ Use build info for traceability
✅ Implement promotion workflow
✅ Scan for vulnerabilities
✅ Use virtual repositories
✅ Clean up old artifacts
✅ Set retention policies
```

