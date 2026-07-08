# Lab 809: Performance Optimization

## LEARNING CONCEPT

Optimizing Jenkins performance for faster builds.

## EXERCISE

1. Identify bottlenecks
2. Optimize pipelines
3. Tune Jenkins configuration

## SOLUTION

### Pipeline Optimization

```groovy
pipeline {
    agent any
    
    options {
        // Skip default checkout for faster start
        skipDefaultCheckout()
    }
    
    stages {
        stage('Checkout') {
            steps {
                // Shallow clone for faster checkout
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/main']],
                    extensions: [
                        [$class: 'CloneOption', depth: 1, shallow: true],
                        [$class: 'CleanBeforeCheckout']
                    ],
                    userRemoteConfigs: [[url: 'https://github.com/user/repo.git']]
                ])
            }
        }
    }
}
```

### Parallel Execution

```groovy
stage('Test') {
    parallel {
        stage('Unit Tests') {
            agent { label 'linux' }
            steps { sh 'npm run test:unit' }
        }
        stage('Integration Tests') {
            agent { label 'linux' }
            steps { sh 'npm run test:integration' }
        }
        stage('E2E Tests') {
            agent { label 'linux' }
            steps { sh 'npm run test:e2e' }
        }
    }
}
```

### Caching Dependencies

```groovy
pipeline {
    agent {
        docker {
            image 'node:18'
            args '-v npm-cache:/root/.npm'
        }
    }
    
    stages {
        stage('Install') {
            steps {
                // Use cache
                sh 'npm ci --cache /root/.npm'
            }
        }
    }
}
```

### Incremental Builds

```groovy
stage('Build') {
    steps {
        script {
            // Check if rebuild needed
            def changes = sh(
                script: 'git diff --name-only HEAD~1',
                returnStdout: true
            ).trim()
            
            if (changes.contains('src/')) {
                sh 'npm run build'
            } else {
                echo 'No source changes, skipping build'
            }
        }
    }
}
```

### Artifact Caching

```groovy
stage('Build') {
    steps {
        // Check for cached artifacts
        script {
            def cacheKey = sh(
                script: 'md5sum package-lock.json | cut -d" " -f1',
                returnStdout: true
            ).trim()
            
            def cached = fileExists("cache/${cacheKey}/node_modules.tar.gz")
            
            if (cached) {
                sh "tar -xzf cache/${cacheKey}/node_modules.tar.gz"
            } else {
                sh 'npm ci'
                sh "mkdir -p cache/${cacheKey}"
                sh "tar -czf cache/${cacheKey}/node_modules.tar.gz node_modules"
            }
        }
    }
}
```

### JVM Tuning

```bash
# /etc/default/jenkins or JAVA_OPTS
JAVA_OPTS="-Xms2g -Xmx4g -XX:+UseG1GC -XX:+ParallelRefProcEnabled"

# Recommended settings:
# -Xms: Initial heap size (25% of RAM)
# -Xmx: Maximum heap size (50% of RAM)
# -XX:+UseG1GC: Use G1 garbage collector
```

### Plugin Optimization

```
Reduce plugin count:
1. Audit installed plugins
2. Remove unused plugins
3. Disable unnecessary features

Manage Jenkins → Plugins → Installed
Review and uninstall unused plugins
```

### Build History

```groovy
options {
    // Keep only recent builds
    buildDiscarder(logRotator(
        numToKeepStr: '10',
        artifactNumToKeepStr: '5',
        daysToKeepStr: '30'
    ))
}
```

### Workspace Cleanup

```groovy
post {
    always {
        // Clean workspace
        cleanWs(
            cleanWhenNotBuilt: false,
            deleteDirs: true,
            disableDeferredWipeout: true,
            notFailBuild: true
        )
    }
}
```

### Agent Optimization

```
Agent sizing:
- Match executors to CPU cores
- Allocate sufficient RAM
- Use SSD storage
- Network bandwidth

Executor formula:
- CPU-bound: 1 executor per core
- I/O-bound: 2 executors per core
```

### Docker Optimization

```groovy
pipeline {
    agent {
        docker {
            image 'node:18-alpine'  // Use smaller images
            args '--memory=2g --cpus=2'  // Limit resources
            reuseNode true  // Reuse workspace
        }
    }
}
```

### Database Optimization

```
For large Jenkins instances:
1. Use external database (PostgreSQL)
2. Regular maintenance
3. Index optimization
4. Connection pooling
```

### Monitoring Performance

```groovy
// Add timing to stages
stage('Build') {
    steps {
        script {
            def start = System.currentTimeMillis()
            
            sh 'npm run build'
            
            def duration = System.currentTimeMillis() - start
            echo "Build took ${duration}ms"
        }
    }
}
```

### Performance Checklist

```
Pipeline:
□ Use shallow clones
□ Parallel execution
□ Cache dependencies
□ Incremental builds
□ Clean workspaces

Infrastructure:
□ Tune JVM settings
□ Right-size agents
□ Use SSD storage
□ Optimize network

Maintenance:
□ Limit build history
□ Remove old artifacts
□ Audit plugins
□ Monitor metrics
```

### Best Practices

```
✅ Use shallow git clones
✅ Run tests in parallel
✅ Cache dependencies
✅ Clean up workspaces
✅ Tune JVM settings
✅ Monitor build times
✅ Regular maintenance
```

