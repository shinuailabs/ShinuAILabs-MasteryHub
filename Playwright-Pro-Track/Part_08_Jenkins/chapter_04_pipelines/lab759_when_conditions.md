# Lab 759: When Conditions

## LEARNING CONCEPT

Using when conditions to control stage execution.

## EXERCISE

1. Use branch conditions
2. Implement expression conditions
3. Combine multiple conditions

## SOLUTION

### Branch Condition

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
                branch 'main'
            }
            steps {
                echo 'Deploying to production'
            }
        }
    }
}
```

### Branch Pattern

```groovy
pipeline {
    agent any
    
    stages {
        stage('Feature Build') {
            when {
                branch pattern: "feature-.*", comparator: "REGEXP"
            }
            steps {
                echo 'Building feature branch'
            }
        }
        
        stage('Release Build') {
            when {
                branch pattern: "release/*", comparator: "GLOB"
            }
            steps {
                echo 'Building release branch'
            }
        }
    }
}
```

### Tag Condition

```groovy
pipeline {
    agent any
    
    stages {
        stage('Release') {
            when {
                tag "v*"
            }
            steps {
                echo "Building tag: ${env.TAG_NAME}"
            }
        }
        
        stage('Semantic Version') {
            when {
                tag pattern: "v\\d+\\.\\d+\\.\\d+", comparator: "REGEXP"
            }
            steps {
                echo 'Valid semantic version tag'
            }
        }
    }
}
```

### Environment Condition

```groovy
pipeline {
    agent any
    
    environment {
        DEPLOY = 'true'
    }
    
    stages {
        stage('Deploy') {
            when {
                environment name: 'DEPLOY', value: 'true'
            }
            steps {
                echo 'Deploying...'
            }
        }
    }
}
```

### Expression Condition

```groovy
pipeline {
    agent any
    
    parameters {
        booleanParam(name: 'DEPLOY', defaultValue: false)
        string(name: 'VERSION', defaultValue: '1.0.0')
    }
    
    stages {
        stage('Deploy') {
            when {
                expression { params.DEPLOY == true }
            }
            steps {
                echo "Deploying version ${params.VERSION}"
            }
        }
        
        stage('Major Release') {
            when {
                expression { params.VERSION.startsWith('2.') }
            }
            steps {
                echo 'Major version release'
            }
        }
    }
}
```

### Change Request (PR)

```groovy
pipeline {
    agent any
    
    stages {
        stage('PR Checks') {
            when {
                changeRequest()
            }
            steps {
                echo "PR from ${env.CHANGE_BRANCH} to ${env.CHANGE_TARGET}"
                sh 'npm run lint'
            }
        }
        
        stage('PR to Main') {
            when {
                changeRequest target: 'main'
            }
            steps {
                echo 'PR targeting main branch'
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
        stage('Manual Build') {
            when {
                triggeredBy 'UserIdCause'
            }
            steps {
                echo 'Manually triggered build'
            }
        }
        
        stage('SCM Build') {
            when {
                triggeredBy 'SCMTrigger'
            }
            steps {
                echo 'Triggered by SCM change'
            }
        }
        
        stage('Scheduled Build') {
            when {
                triggeredBy 'TimerTrigger'
            }
            steps {
                echo 'Scheduled build'
            }
        }
    }
}
```

### AllOf Condition

```groovy
pipeline {
    agent any
    
    stages {
        stage('Production Deploy') {
            when {
                allOf {
                    branch 'main'
                    environment name: 'DEPLOY', value: 'true'
                    expression { currentBuild.result == null || currentBuild.result == 'SUCCESS' }
                }
            }
            steps {
                echo 'All conditions met - deploying to production'
            }
        }
    }
}
```

### AnyOf Condition

```groovy
pipeline {
    agent any
    
    stages {
        stage('Deploy') {
            when {
                anyOf {
                    branch 'main'
                    branch 'develop'
                    tag "v*"
                }
            }
            steps {
                echo 'Deploying...'
            }
        }
    }
}
```

### Not Condition

```groovy
pipeline {
    agent any
    
    stages {
        stage('Non-Production') {
            when {
                not {
                    branch 'main'
                }
            }
            steps {
                echo 'Not on main branch'
            }
        }
    }
}
```

### Before Agent

```groovy
pipeline {
    agent none
    
    stages {
        stage('Deploy') {
            when {
                beforeAgent true
                branch 'main'
            }
            agent { label 'deploy-server' }
            steps {
                echo 'Deploying...'
            }
        }
    }
}
```

### Before Input

```groovy
pipeline {
    agent any
    
    stages {
        stage('Deploy') {
            when {
                beforeInput true
                branch 'main'
            }
            input {
                message 'Deploy to production?'
            }
            steps {
                echo 'Deploying...'
            }
        }
    }
}
```

### Complex Example

```groovy
pipeline {
    agent any
    
    parameters {
        booleanParam(name: 'FORCE_DEPLOY', defaultValue: false)
    }
    
    stages {
        stage('Deploy') {
            when {
                anyOf {
                    allOf {
                        branch 'main'
                        not { changeRequest() }
                    }
                    expression { params.FORCE_DEPLOY }
                }
            }
            steps {
                echo 'Deploying...'
            }
        }
    }
}
```

