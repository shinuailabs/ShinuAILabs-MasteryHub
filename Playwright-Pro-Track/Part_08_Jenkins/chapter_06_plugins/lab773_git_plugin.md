# Lab 773: Git Plugin

## LEARNING CONCEPT

Using Git plugin for source control integration.

## EXERCISE

1. Configure Git in Jenkins
2. Use Git in pipelines
3. Handle branches and tags

## SOLUTION

### Install Git Plugin

```
Manage Jenkins → Plugins → Available
Search: Git
Install: Git plugin
```

### Configure Git Tool

```
Manage Jenkins → Tools → Git

Git installations:
  Name: Default
  Path to Git executable: git
  
  Or specify full path:
  Path to Git executable: /usr/bin/git
```

### Basic Git Checkout

```groovy
pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/user/repo.git',
                    branch: 'main'
            }
        }
    }
}
```

### Git with Credentials

```groovy
pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/user/repo.git',
                    branch: 'main',
                    credentialsId: 'github-credentials'
            }
        }
    }
}
```

### Checkout SCM

```groovy
pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
    }
}
```

### Advanced Checkout

```groovy
pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/main']],
                    extensions: [
                        [$class: 'CleanBeforeCheckout'],
                        [$class: 'CloneOption', depth: 1, shallow: true]
                    ],
                    userRemoteConfigs: [[
                        url: 'https://github.com/user/repo.git',
                        credentialsId: 'github-credentials'
                    ]]
                ])
            }
        }
    }
}
```

### Git Environment Variables

```groovy
pipeline {
    agent any
    
    stages {
        stage('Git Info') {
            steps {
                echo "Branch: ${env.GIT_BRANCH}"
                echo "Commit: ${env.GIT_COMMIT}"
                echo "URL: ${env.GIT_URL}"
                echo "Author: ${env.GIT_AUTHOR_NAME}"
                echo "Committer: ${env.GIT_COMMITTER_NAME}"
            }
        }
    }
}
```

### Get Git Info via Shell

```groovy
pipeline {
    agent any
    
    stages {
        stage('Git Info') {
            steps {
                script {
                    env.GIT_COMMIT_SHORT = sh(
                        script: 'git rev-parse --short HEAD',
                        returnStdout: true
                    ).trim()
                    
                    env.GIT_COMMIT_MSG = sh(
                        script: 'git log -1 --format=%s',
                        returnStdout: true
                    ).trim()
                    
                    env.GIT_AUTHOR = sh(
                        script: 'git log -1 --format=%an',
                        returnStdout: true
                    ).trim()
                }
                
                echo "Commit: ${env.GIT_COMMIT_SHORT}"
                echo "Message: ${env.GIT_COMMIT_MSG}"
                echo "Author: ${env.GIT_AUTHOR}"
            }
        }
    }
}
```

### Sparse Checkout

```groovy
checkout([
    $class: 'GitSCM',
    branches: [[name: '*/main']],
    extensions: [
        [$class: 'SparseCheckoutPaths', sparseCheckoutPaths: [
            [$class: 'SparseCheckoutPath', path: 'src/'],
            [$class: 'SparseCheckoutPath', path: 'tests/']
        ]]
    ],
    userRemoteConfigs: [[url: 'https://github.com/user/repo.git']]
])
```

### Checkout to Subdirectory

```groovy
checkout([
    $class: 'GitSCM',
    branches: [[name: '*/main']],
    extensions: [
        [$class: 'RelativeTargetDirectory', relativeTargetDir: 'my-repo']
    ],
    userRemoteConfigs: [[url: 'https://github.com/user/repo.git']]
])
```

### Multiple Repositories

```groovy
pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                dir('app') {
                    git url: 'https://github.com/user/app.git', branch: 'main'
                }
                dir('config') {
                    git url: 'https://github.com/user/config.git', branch: 'main'
                }
            }
        }
    }
}
```

### Git Tags

```groovy
pipeline {
    agent any
    
    stages {
        stage('Checkout Tag') {
            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: 'refs/tags/v1.0.0']],
                    userRemoteConfigs: [[url: 'https://github.com/user/repo.git']]
                ])
            }
        }
    }
}
```

### Best Practices

```
✅ Use credentials for private repos
✅ Use shallow clone for large repos
✅ Clean workspace before checkout
✅ Use specific branch/tag names
✅ Cache Git operations when possible
```

