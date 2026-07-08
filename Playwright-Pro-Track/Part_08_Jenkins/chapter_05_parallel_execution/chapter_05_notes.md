# Part 05: Parallel Execution

## 📚 Overview
Parallel execution in Jenkins reduces build time by running stages simultaneously.

---

## 🎯 Key Concepts

### 1. Basic Parallel Stages

```groovy
pipeline {
    agent any
    
    stages {
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
                        sh 'npx playwright test'
                    }
                }
            }
        }
    }
}
```

### 2. Parallel with Different Agents

```groovy
pipeline {
    agent none
    
    stages {
        stage('Test Browsers') {
            parallel {
                stage('Chromium') {
                    agent {
                        docker { image 'mcr.microsoft.com/playwright:v1.40.0-jammy' }
                    }
                    steps {
                        sh 'npm ci'
                        sh 'npx playwright test --project=chromium'
                    }
                }
                stage('Firefox') {
                    agent {
                        docker { image 'mcr.microsoft.com/playwright:v1.40.0-jammy' }
                    }
                    steps {
                        sh 'npm ci'
                        sh 'npx playwright test --project=firefox'
                    }
                }
                stage('WebKit') {
                    agent {
                        docker { image 'mcr.microsoft.com/playwright:v1.40.0-jammy' }
                    }
                    steps {
                        sh 'npm ci'
                        sh 'npx playwright test --project=webkit'
                    }
                }
            }
        }
    }
}
```

### 3. Matrix Builds

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
                        name 'NODE_VERSION'
                        values '18', '20'
                    }
                }
                agent {
                    docker { image "node:${NODE_VERSION}" }
                }
                stages {
                    stage('Test') {
                        steps {
                            sh 'npm ci'
                            sh "npx playwright test --project=${BROWSER}"
                        }
                    }
                }
            }
        }
    }
}
```

### 4. Sharded Test Execution

```groovy
pipeline {
    agent none
    
    stages {
        stage('Parallel Shards') {
            parallel {
                stage('Shard 1') {
                    agent { docker { image 'mcr.microsoft.com/playwright:v1.40.0-jammy' } }
                    steps {
                        sh 'npm ci'
                        sh 'npx playwright test --shard=1/4'
                    }
                }
                stage('Shard 2') {
                    agent { docker { image 'mcr.microsoft.com/playwright:v1.40.0-jammy' } }
                    steps {
                        sh 'npm ci'
                        sh 'npx playwright test --shard=2/4'
                    }
                }
                stage('Shard 3') {
                    agent { docker { image 'mcr.microsoft.com/playwright:v1.40.0-jammy' } }
                    steps {
                        sh 'npm ci'
                        sh 'npx playwright test --shard=3/4'
                    }
                }
                stage('Shard 4') {
                    agent { docker { image 'mcr.microsoft.com/playwright:v1.40.0-jammy' } }
                    steps {
                        sh 'npm ci'
                        sh 'npx playwright test --shard=4/4'
                    }
                }
            }
        }
    }
}
```

### 5. Dynamic Parallel

```groovy
def browsers = ['chromium', 'firefox', 'webkit']

pipeline {
    agent any
    
    stages {
        stage('Test') {
            steps {
                script {
                    def parallelStages = [:]
                    
                    browsers.each { browser ->
                        parallelStages[browser] = {
                            node {
                                docker.image('mcr.microsoft.com/playwright:v1.40.0-jammy').inside {
                                    sh 'npm ci'
                                    sh "npx playwright test --project=${browser}"
                                }
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

### 6. Fail Fast

```groovy
pipeline {
    agent any
    
    stages {
        stage('Test') {
            failFast true  // Stop all parallel stages if one fails
            parallel {
                stage('Unit') {
                    steps {
                        sh 'npm run test:unit'
                    }
                }
                stage('E2E') {
                    steps {
                        sh 'npx playwright test'
                    }
                }
            }
        }
    }
}
```

### 7. Collecting Results

```groovy
pipeline {
    agent none
    
    stages {
        stage('Test') {
            parallel {
                stage('Chromium') {
                    agent { docker { image 'mcr.microsoft.com/playwright:v1.40.0-jammy' } }
                    steps {
                        sh 'npm ci'
                        sh 'npx playwright test --project=chromium'
                    }
                    post {
                        always {
                            archiveArtifacts artifacts: 'test-results/**'
                            stash name: 'chromium-results', includes: 'test-results/**'
                        }
                    }
                }
                stage('Firefox') {
                    agent { docker { image 'mcr.microsoft.com/playwright:v1.40.0-jammy' } }
                    steps {
                        sh 'npm ci'
                        sh 'npx playwright test --project=firefox'
                    }
                    post {
                        always {
                            stash name: 'firefox-results', includes: 'test-results/**'
                        }
                    }
                }
            }
        }
        
        stage('Merge Results') {
            agent any
            steps {
                unstash 'chromium-results'
                unstash 'firefox-results'
                junit '**/junit.xml'
            }
        }
    }
}
```

---

## 💻 Practice Exercises

1. Create parallel stages
2. Use matrix builds
3. Implement sharding
4. Configure fail fast
5. Collect parallel results

---

## ✅ Best Practices

- ✅ Use parallel for independent tasks
- ✅ Consider fail fast for critical tests
- ✅ Collect and merge results
- ✅ Use matrix for combinations
- ❌ Don't parallelize dependent stages
- ❌ Avoid resource contention

---

## 📝 Quick Reference

```groovy
// Parallel stages
parallel {
    stage('A') { steps { } }
    stage('B') { steps { } }
}

// Matrix
matrix {
    axes {
        axis { name 'VAR'; values 'a', 'b' }
    }
    stages { stage('Test') { } }
}

// Fail fast
failFast true

// Stash/unstash
stash name: 'results', includes: '**'
unstash 'results'
```

