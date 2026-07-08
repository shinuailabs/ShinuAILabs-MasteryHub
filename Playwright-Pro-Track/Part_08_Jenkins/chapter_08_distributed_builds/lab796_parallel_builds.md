# Lab 796: Parallel Builds

## LEARNING CONCEPT

Running parallel builds across multiple agents.

## EXERCISE

1. Configure parallel stages
2. Use matrix builds
3. Optimize parallel execution

## SOLUTION

### Basic Parallel Stages

```groovy
pipeline {
    agent none
    
    stages {
        stage('Test') {
            parallel {
                stage('Unit Tests') {
                    agent { label 'linux' }
                    steps {
                        sh 'npm run test:unit'
                    }
                }
                stage('Integration Tests') {
                    agent { label 'linux' }
                    steps {
                        sh 'npm run test:integration'
                    }
                }
                stage('E2E Tests') {
                    agent { label 'linux' }
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
                stage('Linux') {
                    agent { label 'linux' }
                    steps {
                        sh 'npm run build:linux'
                    }
                }
                stage('Windows') {
                    agent { label 'windows' }
                    steps {
                        bat 'npm run build:windows'
                    }
                }
                stage('macOS') {
                    agent { label 'macos' }
                    steps {
                        sh 'npm run build:macos'
                    }
                }
            }
        }
    }
}
```

### Matrix Builds

```groovy
pipeline {
    agent none
    
    stages {
        stage('Test Matrix') {
            matrix {
                axes {
                    axis {
                        name 'BROWSER'
                        values 'chromium', 'firefox', 'webkit'
                    }
                    axis {
                        name 'OS'
                        values 'linux', 'windows'
                    }
                }
                
                stages {
                    stage('Test') {
                        agent { label "${OS}" }
                        steps {
                            sh "npx playwright test --project=${BROWSER}"
                        }
                    }
                }
            }
        }
    }
}
```

### Matrix with Exclusions

```groovy
pipeline {
    agent none
    
    stages {
        stage('Test Matrix') {
            matrix {
                axes {
                    axis {
                        name 'BROWSER'
                        values 'chromium', 'firefox', 'webkit'
                    }
                    axis {
                        name 'OS'
                        values 'linux', 'windows', 'macos'
                    }
                }
                
                excludes {
                    exclude {
                        axis {
                            name 'BROWSER'
                            values 'webkit'
                        }
                        axis {
                            name 'OS'
                            values 'windows'
                        }
                    }
                }
                
                stages {
                    stage('Test') {
                        agent { label "${OS}" }
                        steps {
                            sh "npx playwright test --project=${BROWSER}"
                        }
                    }
                }
            }
        }
    }
}
```

### Parallel with failFast

```groovy
pipeline {
    agent none
    
    stages {
        stage('Test') {
            failFast true  // Stop all parallel branches on first failure
            parallel {
                stage('Unit') {
                    agent { label 'linux' }
                    steps {
                        sh 'npm run test:unit'
                    }
                }
                stage('Integration') {
                    agent { label 'linux' }
                    steps {
                        sh 'npm run test:integration'
                    }
                }
            }
        }
    }
}
```

### Dynamic Parallel

```groovy
pipeline {
    agent any
    
    stages {
        stage('Parallel Tests') {
            steps {
                script {
                    def browsers = ['chromium', 'firefox', 'webkit']
                    def parallelStages = [:]
                    
                    browsers.each { browser ->
                        parallelStages[browser] = {
                            node('linux') {
                                sh "npx playwright test --project=${browser}"
                            }
                        }
                    }
                    
                    parallel parallelStages
                }
            }
        }
    }
}
```

### Parallel with Shared Artifacts

```groovy
pipeline {
    agent none
    
    stages {
        stage('Build') {
            agent { label 'linux' }
            steps {
                sh 'npm ci'
                sh 'npm run build'
                stash includes: 'dist/**/*', name: 'build'
            }
        }
        
        stage('Test') {
            parallel {
                stage('Chrome') {
                    agent { label 'linux' }
                    steps {
                        unstash 'build'
                        sh 'npx playwright test --project=chromium'
                    }
                }
                stage('Firefox') {
                    agent { label 'linux' }
                    steps {
                        unstash 'build'
                        sh 'npx playwright test --project=firefox'
                    }
                }
            }
        }
    }
}
```

### Throttle Parallel Builds

```groovy
// Using Throttle Concurrent Builds Plugin
pipeline {
    agent none
    
    options {
        throttleJobProperty(
            categories: ['test-category'],
            throttleEnabled: true,
            throttleOption: 'category'
        )
    }
    
    stages {
        stage('Test') {
            parallel {
                stage('Test 1') {
                    agent { label 'linux' }
                    steps {
                        sh 'npm test'
                    }
                }
                stage('Test 2') {
                    agent { label 'linux' }
                    steps {
                        sh 'npm test'
                    }
                }
            }
        }
    }
}
```

### Resource Locking

```groovy
// Using Lockable Resources Plugin
pipeline {
    agent none
    
    stages {
        stage('Deploy') {
            parallel {
                stage('Deploy A') {
                    agent { label 'linux' }
                    steps {
                        lock('deploy-server-a') {
                            sh './deploy.sh server-a'
                        }
                    }
                }
                stage('Deploy B') {
                    agent { label 'linux' }
                    steps {
                        lock('deploy-server-b') {
                            sh './deploy.sh server-b'
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
✅ Consider failFast for critical paths
✅ Use matrix for combinatorial testing
✅ Stash/unstash for shared artifacts
✅ Throttle to prevent overload
✅ Lock shared resources
✅ Monitor parallel execution time
```

