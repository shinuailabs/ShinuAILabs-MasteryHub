# Lab 741: Agent Setup

## LEARNING CONCEPT

Setting up Jenkins agents for distributed builds.

## EXERCISE

1. Configure SSH agent
2. Set up JNLP agent
3. Configure Docker agent

## SOLUTION

### Agent Types

```
Permanent Agents:
- SSH agents
- JNLP agents
- Windows agents

Ephemeral Agents:
- Docker agents
- Kubernetes agents
- Cloud agents (AWS, Azure, GCP)
```

### SSH Agent Setup

```
1. Manage Jenkins → Nodes → New Node
2. Node name: linux-agent
3. Type: Permanent Agent
4. Configure:
   - # of executors: 2
   - Remote root directory: /home/jenkins
   - Labels: linux docker
   - Launch method: Launch agents via SSH
   - Host: 192.168.1.100
   - Credentials: ssh-key
   - Host Key Verification: Known hosts file
```

### JNLP Agent Setup

```
1. Manage Jenkins → Nodes → New Node
2. Node name: windows-agent
3. Type: Permanent Agent
4. Configure:
   - # of executors: 2
   - Remote root directory: C:\jenkins
   - Labels: windows
   - Launch method: Launch agent by connecting it to the controller

On Agent Machine:
java -jar agent.jar \
    -jnlpUrl http://jenkins:8080/computer/windows-agent/jenkins-agent.jnlp \
    -secret <secret> \
    -workDir "C:\jenkins"
```

### Docker Agent in Pipeline

```groovy
pipeline {
    agent {
        docker {
            image 'node:18'
            args '-v /tmp:/tmp'
        }
    }
    
    stages {
        stage('Build') {
            steps {
                sh 'node --version'
                sh 'npm ci'
                sh 'npm run build'
            }
        }
    }
}
```

### Docker Agent with Dockerfile

```groovy
pipeline {
    agent {
        dockerfile {
            filename 'Dockerfile.ci'
            dir 'docker'
            args '-v /tmp:/tmp'
        }
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

### Kubernetes Agent

```groovy
pipeline {
    agent {
        kubernetes {
            yaml '''
            apiVersion: v1
            kind: Pod
            spec:
              containers:
              - name: node
                image: node:18
                command:
                - cat
                tty: true
              - name: docker
                image: docker:dind
                securityContext:
                  privileged: true
            '''
        }
    }
    
    stages {
        stage('Build') {
            steps {
                container('node') {
                    sh 'npm ci && npm run build'
                }
            }
        }
    }
}
```

### Agent Labels

```groovy
// Use specific agent
pipeline {
    agent { label 'linux' }
    // ...
}

// Multiple labels (AND)
pipeline {
    agent { label 'linux && docker' }
    // ...
}

// Multiple labels (OR)
pipeline {
    agent { label 'linux || macos' }
    // ...
}
```

### Agent per Stage

```groovy
pipeline {
    agent none
    
    stages {
        stage('Build Linux') {
            agent { label 'linux' }
            steps {
                sh 'make build'
            }
        }
        
        stage('Build Windows') {
            agent { label 'windows' }
            steps {
                bat 'msbuild'
            }
        }
    }
}
```

### Agent Configuration

```
Key Settings:
- # of executors: Parallel builds
- Remote root directory: Workspace location
- Labels: For agent selection
- Usage: Only build jobs with matching labels
- Launch method: How to connect
- Availability: When agent is available
```

### Best Practices

```
✅ Don't run builds on controller
✅ Use labels for agent selection
✅ Use ephemeral agents when possible
✅ Monitor agent health
✅ Set appropriate executor count
✅ Secure agent communication
```

