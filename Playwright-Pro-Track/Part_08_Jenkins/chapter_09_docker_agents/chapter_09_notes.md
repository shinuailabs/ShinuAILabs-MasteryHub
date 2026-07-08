# Part 09: Docker Agents

## 📚 Overview
Docker agents in Jenkins provide isolated, reproducible build environments for pipelines.

---

## 🎯 Key Concepts

### 1. Basic Docker Agent

```groovy
pipeline {
    agent {
        docker {
            image 'node:18'
        }
    }
    
    stages {
        stage('Build') {
            steps {
                sh 'node --version'
                sh 'npm --version'
            }
        }
    }
}
```

### 2. Playwright Docker Agent

```groovy
pipeline {
    agent {
        docker {
            image 'mcr.microsoft.com/playwright:v1.40.0-jammy'
            args '-u root'
        }
    }
    
    stages {
        stage('Install') {
            steps {
                sh 'npm ci'
            }
        }
        
        stage('Test') {
            steps {
                sh 'npx playwright test'
            }
        }
    }
}
```

### 3. Docker Agent Options

```groovy
pipeline {
    agent {
        docker {
            image 'node:18'
            
            // Run as specific user
            args '-u root'
            
            // Mount volumes
            args '-v /host/path:/container/path'
            
            // Set environment
            args '-e NODE_ENV=test'
            
            // Network mode
            args '--network host'
            
            // Resource limits
            args '--memory=4g --cpus=2'
            
            // Combined args
            args '-u root -v ${WORKSPACE}:/app -e CI=true'
        }
    }
    
    stages {
        stage('Test') {
            steps {
                sh 'npm test'
            }
        }
    }
}
```

### 4. Custom Dockerfile

```groovy
pipeline {
    agent {
        dockerfile {
            filename 'Dockerfile.test'
            dir 'docker'
            additionalBuildArgs '--build-arg VERSION=1.0'
            args '-v /tmp:/tmp'
        }
    }
    
    stages {
        stage('Test') {
            steps {
                sh 'npm test'
            }
        }
    }
}
```

### 5. Stage-Level Docker Agents

```groovy
pipeline {
    agent none
    
    stages {
        stage('Build') {
            agent {
                docker { image 'node:18' }
            }
            steps {
                sh 'npm run build'
                stash name: 'build', includes: 'dist/**'
            }
        }
        
        stage('Test') {
            agent {
                docker { image 'mcr.microsoft.com/playwright:v1.40.0-jammy' }
            }
            steps {
                unstash 'build'
                sh 'npx playwright test'
            }
        }
        
        stage('Deploy') {
            agent {
                docker { image 'amazon/aws-cli' }
            }
            steps {
                sh 'aws s3 sync dist/ s3://bucket/'
            }
        }
    }
}
```

### 6. Docker Registry

```groovy
pipeline {
    agent {
        docker {
            image 'my-registry.com/my-image:latest'
            registryUrl 'https://my-registry.com'
            registryCredentialsId 'registry-credentials'
        }
    }
    
    stages {
        stage('Test') {
            steps {
                sh 'npm test'
            }
        }
    }
}
```

### 7. Docker Compose Agent

```groovy
pipeline {
    agent any
    
    stages {
        stage('Test') {
            steps {
                sh 'docker-compose -f docker-compose.test.yml up --build --abort-on-container-exit'
            }
            post {
                always {
                    sh 'docker-compose -f docker-compose.test.yml down -v'
                }
            }
        }
    }
}
```

### 8. Sidecar Containers

```groovy
pipeline {
    agent {
        docker {
            image 'mcr.microsoft.com/playwright:v1.40.0-jammy'
        }
    }
    
    stages {
        stage('Test with Database') {
            steps {
                script {
                    docker.image('postgres:15').withRun('-e POSTGRES_PASSWORD=test') { db ->
                        docker.image('mcr.microsoft.com/playwright:v1.40.0-jammy').inside("--link ${db.id}:db") {
                            sh 'npm ci'
                            sh 'DATABASE_URL=postgres://postgres:test@db:5432/postgres npx playwright test'
                        }
                    }
                }
            }
        }
    }
}
```

### 9. Caching with Docker

```groovy
pipeline {
    agent {
        docker {
            image 'node:18'
            // Mount npm cache
            args '-v npm-cache:/root/.npm'
        }
    }
    
    stages {
        stage('Install') {
            steps {
                sh 'npm ci'
            }
        }
        
        stage('Test') {
            steps {
                sh 'npm test'
            }
        }
    }
}
```

---

## 💻 Practice Exercises

1. Use basic Docker agent
2. Configure Playwright agent
3. Use custom Dockerfile
4. Implement stage-level agents
5. Set up sidecar containers

---

## ✅ Best Practices

- ✅ Use specific image tags
- ✅ Mount volumes for caching
- ✅ Use stage-level agents
- ✅ Clean up containers
- ❌ Don't use `latest` tag
- ❌ Avoid running as root

---

## 📝 Quick Reference

```groovy
// Basic
agent { docker { image 'node:18' } }

// With options
agent {
    docker {
        image 'image:tag'
        args '-u root -v /path:/path'
        registryUrl 'https://registry'
        registryCredentialsId 'creds'
    }
}

// Dockerfile
agent {
    dockerfile {
        filename 'Dockerfile'
        args '-v /tmp:/tmp'
    }
}

// Stage-level
stage('Test') {
    agent { docker { image 'test-image' } }
    steps { }
}
```

