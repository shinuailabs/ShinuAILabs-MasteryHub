# Lab 756: Parallel Stages

## LEARNING CONCEPT

Running stages in parallel for faster builds.

## EXERCISE

1. Create parallel stages
2. Handle parallel failures
3. Optimize build time

## SOLUTION

### Basic Parallel Stages

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
        
        stage('Test') {
            parallel {
                stage('Unit Tests') {
                    steps {
                        sh 'npm run test:unit'
                    }
                }
                stage('Integration Tests') {
                    steps {
                        sh 'npm run test:integration'
                    }
                }
                stage('E2E Tests') {
                    steps {
                        sh 'npm run test:e2e'
                    }
                }
            }
        }
    }
}
```

### Parallel with Different Agents

```groovy
pipeline {
    agent none
    
    stages {
        stage('Build') {
            parallel {
                stage('Build Linux') {
                    agent { label 'linux' }
                    steps {
                        sh 'make build-linux'
                    }
                }
                stage('Build Windows') {
                    agent { label 'windows' }
                    steps {
                        bat 'msbuild'
                    }
                }
                stage('Build macOS') {
                    agent { label 'macos' }
                    steps {
                        sh 'make build-macos'
                    }
                }
            }
        }
    }
}
```

### Parallel with Docker

```groovy
pipeline {
    agent none
    
    stages {
        stage('Test') {
            parallel {
                stage('Test Node 16') {
                    agent {
                        docker { image 'node:16' }
                    }
                    steps {
                        sh 'npm ci'
                        sh 'npm test'
                    }
                }
                stage('Test Node 18') {
                    agent {
                        docker { image 'node:18' }
                    }
                    steps {
                        sh 'npm ci'
                        sh 'npm test'
                    }
                }
                stage('Test Node 20') {
                    agent {
                        docker { image 'node:20' }
                    }
                    steps {
                        sh 'npm ci'
                        sh 'npm test'
                    }
                }
            }
        }
    }
}
```

### Fail Fast

```groovy
pipeline {
    agent any
    
    stages {
        stage('Test') {
            failFast true
            parallel {
                stage('Unit Tests') {
                    steps {
                        sh 'npm run test:unit'
                    }
                }
                stage('Integration Tests') {
                    steps {
                        sh 'npm run test:integration'
                    }
                }
            }
        }
    }
}
```

### Global Fail Fast Option

```groovy
pipeline {
    agent any
    
    options {
        parallelsAlwaysFailFast()
    }
    
    stages {
        stage('Test') {
            parallel {
                stage('Test 1') {
                    steps { sh 'npm run test1' }
                }
                stage('Test 2') {
                    steps { sh 'npm run test2' }
                }
            }
        }
    }
}
```

### Parallel Browser Testing

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
        
        stage('E2E Tests') {
            parallel {
                stage('Chrome') {
                    steps {
                        sh 'npx playwright test --project=chromium'
                    }
                }
                stage('Firefox') {
                    steps {
                        sh 'npx playwright test --project=firefox'
                    }
                }
                stage('Safari') {
                    steps {
                        sh 'npx playwright test --project=webkit'
                    }
                }
            }
        }
    }
    
    post {
        always {
            publishHTML([
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright Report'
            ])
        }
    }
}
```

### Dynamic Parallel Stages

```groovy
pipeline {
    agent any
    
    stages {
        stage('Test') {
            steps {
                script {
                    def browsers = ['chrome', 'firefox', 'webkit']
                    def parallelStages = [:]
                    
                    browsers.each { browser ->
                        parallelStages[browser] = {
                            sh "npx playwright test --project=${browser}"
                        }
                    }
                    
                    parallel parallelStages
                }
            }
        }
    }
}
```

### Matrix Build

```groovy
pipeline {
    agent none
    
    stages {
        stage('Build') {
            matrix {
                axes {
                    axis {
                        name 'PLATFORM'
                        values 'linux', 'windows', 'macos'
                    }
                    axis {
                        name 'NODE_VERSION'
                        values '16', '18', '20'
                    }
                }
                stages {
                    stage('Build') {
                        agent { label "${PLATFORM}" }
                        steps {
                            sh "nvm use ${NODE_VERSION}"
                            sh 'npm ci'
                            sh 'npm run build'
                        }
                    }
                }
            }
        }
    }
}
```

### Matrix with Excludes

```groovy
pipeline {
    agent none
    
    stages {
        stage('Test') {
            matrix {
                axes {
                    axis {
                        name 'OS'
                        values 'linux', 'windows'
                    }
                    axis {
                        name 'BROWSER'
                        values 'chrome', 'firefox', 'webkit'
                    }
                }
                excludes {
                    exclude {
                        axis {
                            name 'OS'
                            values 'windows'
                        }
                        axis {
                            name 'BROWSER'
                            values 'webkit'
                        }
                    }
                }
                stages {
                    stage('Test') {
                        steps {
                            echo "Testing ${BROWSER} on ${OS}"
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
✅ Use parallel for independent tasks
✅ Consider fail fast for critical tests
✅ Balance parallel stages with resources
✅ Use matrix for cross-platform testing
✅ Monitor executor usage
```

