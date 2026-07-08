# Lab 764: Environment Variables

## LEARNING CONCEPT

Using environment variables in Jenkinsfile.

## EXERCISE

1. Define environment variables
2. Use built-in variables
3. Access credentials as environment

## SOLUTION

### Define Environment Variables

```groovy
pipeline {
    agent any
    
    environment {
        // Global environment variables
        APP_NAME = 'my-application'
        VERSION = '1.0.0'
        BUILD_ENV = 'production'
    }
    
    stages {
        stage('Build') {
            environment {
                // Stage-specific variables
                NODE_ENV = 'production'
                API_URL = 'https://api.example.com'
            }
            steps {
                echo "Building ${APP_NAME} v${VERSION}"
                echo "Environment: ${NODE_ENV}"
                sh 'npm run build'
            }
        }
    }
}
```

### Built-in Environment Variables

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
                echo "Job Base Name: ${env.JOB_BASE_NAME}"
                echo "Workspace: ${env.WORKSPACE}"
                echo "Jenkins URL: ${env.JENKINS_URL}"
                echo "Node Name: ${env.NODE_NAME}"
                echo "Executor Number: ${env.EXECUTOR_NUMBER}"
            }
        }
    }
}
```

### SCM Environment Variables

```groovy
pipeline {
    agent any
    
    stages {
        stage('Git Info') {
            steps {
                echo "Branch: ${env.BRANCH_NAME}"
                echo "Git Commit: ${env.GIT_COMMIT}"
                echo "Git Branch: ${env.GIT_BRANCH}"
                echo "Git URL: ${env.GIT_URL}"
                
                // For change requests (PRs)
                echo "Change ID: ${env.CHANGE_ID}"
                echo "Change URL: ${env.CHANGE_URL}"
                echo "Change Title: ${env.CHANGE_TITLE}"
                echo "Change Author: ${env.CHANGE_AUTHOR}"
                echo "Change Branch: ${env.CHANGE_BRANCH}"
                echo "Change Target: ${env.CHANGE_TARGET}"
            }
        }
    }
}
```

### Credentials as Environment

```groovy
pipeline {
    agent any
    
    environment {
        // Username/password credential
        GIT_CREDS = credentials('github-credentials')
        // Creates: GIT_CREDS_USR, GIT_CREDS_PSW
        
        // Secret text credential
        API_TOKEN = credentials('api-token')
        
        // Secret file credential
        CONFIG_FILE = credentials('config-file')
    }
    
    stages {
        stage('Use Credentials') {
            steps {
                // Username/password
                sh 'echo "User: $GIT_CREDS_USR"'
                // Password is masked in logs
                
                // Secret text
                sh '''
                    set +x
                    curl -H "Authorization: Bearer $API_TOKEN" https://api.example.com
                '''
                
                // Secret file
                sh 'cat $CONFIG_FILE'
            }
        }
    }
}
```

### Dynamic Environment Variables

```groovy
pipeline {
    agent any
    
    environment {
        // Using shell command
        GIT_COMMIT_SHORT = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
        
        // Using Groovy expression
        BUILD_TIMESTAMP = new Date().format('yyyyMMdd-HHmmss')
        
        // Conditional value
        DEPLOY_ENV = "${env.BRANCH_NAME == 'main' ? 'production' : 'staging'}"
    }
    
    stages {
        stage('Info') {
            steps {
                echo "Commit: ${GIT_COMMIT_SHORT}"
                echo "Timestamp: ${BUILD_TIMESTAMP}"
                echo "Deploy to: ${DEPLOY_ENV}"
            }
        }
    }
}
```

### Set Environment in Script

```groovy
pipeline {
    agent any
    
    stages {
        stage('Set Variables') {
            steps {
                script {
                    // Set environment variable
                    env.MY_VAR = 'my-value'
                    
                    // Read from file
                    env.VERSION = readFile('VERSION').trim()
                    
                    // From shell command
                    env.COMMIT_MSG = sh(
                        script: 'git log -1 --format=%s',
                        returnStdout: true
                    ).trim()
                }
            }
        }
        
        stage('Use Variables') {
            steps {
                echo "MY_VAR: ${env.MY_VAR}"
                echo "VERSION: ${env.VERSION}"
                echo "COMMIT_MSG: ${env.COMMIT_MSG}"
            }
        }
    }
}
```

### withEnv Block

```groovy
pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
                withEnv([
                    'NODE_ENV=production',
                    'API_URL=https://api.example.com',
                    "VERSION=${env.BUILD_NUMBER}"
                ]) {
                    sh 'echo $NODE_ENV'
                    sh 'echo $API_URL'
                    sh 'npm run build'
                }
            }
        }
    }
}
```

### Environment Variable Scope

```groovy
pipeline {
    agent any
    
    environment {
        GLOBAL_VAR = 'global'  // Available everywhere
    }
    
    stages {
        stage('Stage 1') {
            environment {
                STAGE_VAR = 'stage1'  // Only in this stage
            }
            steps {
                echo "Global: ${GLOBAL_VAR}"
                echo "Stage: ${STAGE_VAR}"
            }
        }
        
        stage('Stage 2') {
            steps {
                echo "Global: ${GLOBAL_VAR}"
                // STAGE_VAR not available here
            }
        }
    }
}
```

### Override Environment Variables

```groovy
pipeline {
    agent any
    
    environment {
        MY_VAR = 'pipeline-level'
    }
    
    stages {
        stage('Override') {
            environment {
                MY_VAR = 'stage-level'  // Overrides pipeline-level
            }
            steps {
                echo "MY_VAR: ${MY_VAR}"  // stage-level
            }
        }
        
        stage('Original') {
            steps {
                echo "MY_VAR: ${MY_VAR}"  // pipeline-level
            }
        }
    }
}
```

### Best Practices

```
✅ Use environment block for constants
✅ Use credentials() for secrets
✅ Don't log sensitive values
✅ Use meaningful variable names
✅ Document environment variables
✅ Use withEnv for temporary overrides
```

