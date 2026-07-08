# Lab 752: Build History

## LEARNING CONCEPT

Managing and analyzing build history in Jenkins.

## EXERCISE

1. Configure build retention
2. Access build history
3. Analyze build trends

## SOLUTION

### Build Retention

```groovy
pipeline {
    agent any
    
    options {
        buildDiscarder(logRotator(
            numToKeepStr: '10',           // Keep last 10 builds
            daysToKeepStr: '30',          // Keep builds for 30 days
            artifactNumToKeepStr: '5',    // Keep artifacts from 5 builds
            artifactDaysToKeepStr: '15'   // Keep artifacts for 15 days
        ))
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

### Access Build Information

```groovy
pipeline {
    agent any
    
    stages {
        stage('Info') {
            steps {
                echo "Build Number: ${env.BUILD_NUMBER}"
                echo "Build ID: ${env.BUILD_ID}"
                echo "Build URL: ${env.BUILD_URL}"
                echo "Job Name: ${env.JOB_NAME}"
                echo "Workspace: ${env.WORKSPACE}"
            }
        }
    }
}
```

### Current Build Object

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
            script {
                echo "Result: ${currentBuild.result}"
                echo "Duration: ${currentBuild.duration}"
                echo "Duration String: ${currentBuild.durationString}"
                echo "Start Time: ${currentBuild.startTimeInMillis}"
                echo "Previous Build: ${currentBuild.previousBuild?.number}"
            }
        }
    }
}
```

### Access Previous Builds

```groovy
pipeline {
    agent any
    
    stages {
        stage('Compare') {
            steps {
                script {
                    def previousBuild = currentBuild.previousBuild
                    
                    if (previousBuild) {
                        echo "Previous build: #${previousBuild.number}"
                        echo "Previous result: ${previousBuild.result}"
                        
                        if (previousBuild.result == 'FAILURE' && 
                            currentBuild.result == 'SUCCESS') {
                            echo "Build is fixed!"
                        }
                    }
                }
            }
        }
    }
}
```

### Build Cause

```groovy
pipeline {
    agent any
    
    stages {
        stage('Check Cause') {
            steps {
                script {
                    def causes = currentBuild.getBuildCauses()
                    
                    causes.each { cause ->
                        echo "Cause: ${cause.shortDescription}"
                    }
                    
                    // Check specific cause
                    if (currentBuild.getBuildCauses('hudson.model.Cause$UserIdCause')) {
                        echo "Build triggered by user"
                    }
                    
                    if (currentBuild.getBuildCauses('hudson.triggers.SCMTrigger$SCMTriggerCause')) {
                        echo "Build triggered by SCM change"
                    }
                }
            }
        }
    }
}
```

### Build Description

```groovy
pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
                sh 'npm run build'
                
                script {
                    currentBuild.description = "Version: 1.0.${BUILD_NUMBER}"
                }
            }
        }
    }
}
```

### Build Display Name

```groovy
pipeline {
    agent any
    
    parameters {
        string(name: 'VERSION', defaultValue: '1.0.0')
    }
    
    stages {
        stage('Build') {
            steps {
                script {
                    currentBuild.displayName = "#${BUILD_NUMBER} - ${params.VERSION}"
                }
                sh 'npm run build'
            }
        }
    }
}
```

### Query Build History via API

```bash
# Get build list
curl http://jenkins:8080/job/my-job/api/json?tree=builds[number,result,timestamp]

# Get specific build
curl http://jenkins:8080/job/my-job/42/api/json

# Get last successful build
curl http://jenkins:8080/job/my-job/lastSuccessfulBuild/api/json

# Get build console output
curl http://jenkins:8080/job/my-job/42/consoleText
```

### Build Trends

```
View in Jenkins UI:
1. Job page → Build History
2. Trend graphs show:
   - Build duration
   - Test results
   - Code coverage
   - Static analysis
```

### Cleanup Old Builds

```groovy
// Programmatic cleanup
pipeline {
    agent any
    
    stages {
        stage('Cleanup') {
            steps {
                script {
                    def job = Jenkins.instance.getItemByFullName(env.JOB_NAME)
                    def builds = job.getBuilds()
                    
                    builds.each { build ->
                        if (build.number < (env.BUILD_NUMBER.toInteger() - 10)) {
                            echo "Deleting build #${build.number}"
                            build.delete()
                        }
                    }
                }
            }
        }
    }
}
```

### Best Practices

```
✅ Configure appropriate retention
✅ Use meaningful descriptions
✅ Monitor build trends
✅ Archive important builds
✅ Clean up regularly
✅ Use API for automation
```

