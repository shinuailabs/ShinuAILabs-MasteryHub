# Lab 793: Docker Agents

## LEARNING CONCEPT

Using Docker containers as Jenkins agents.

## EXERCISE

1. Configure Docker cloud
2. Create agent templates
3. Use Docker agents in pipelines

## SOLUTION

### Install Docker Plugin

```
Manage Jenkins → Plugins → Available
Install: Docker plugin
```

### Configure Docker Cloud

```
Manage Jenkins → Clouds → New cloud → Docker

Docker Cloud details:
  Name: docker
  Docker Host URI: unix:///var/run/docker.sock
  
  Or TCP:
  Docker Host URI: tcp://docker-host:2376
  Server credentials: docker-tls-certs
  
  Enabled: ✓
```

### Docker Host URI Options

```
Local Docker:
unix:///var/run/docker.sock

Remote Docker (TLS):
tcp://docker-host:2376

Docker in Docker:
tcp://dind:2375
```

### Agent Template

```
Docker Agent templates → Add Docker Template

Labels: docker-agent
Enabled: ✓
Name: docker-agent
Docker Image: jenkins/agent:latest
Remote File System Root: /home/jenkins/agent
Connect method: Attach Docker container
Pull strategy: Pull once and update latest
```

### Custom Agent Image

```dockerfile
# Dockerfile.agent
FROM jenkins/agent:latest

USER root

# Install tools
RUN apt-get update && apt-get install -y \
    nodejs \
    npm \
    python3 \
    python3-pip

# Install global npm packages
RUN npm install -g typescript

USER jenkins
```

### Build and Use Custom Image

```bash
# Build image
docker build -t my-jenkins-agent -f Dockerfile.agent .

# Push to registry
docker tag my-jenkins-agent registry.example.com/my-jenkins-agent
docker push registry.example.com/my-jenkins-agent
```

### Template with Custom Image

```
Docker Agent templates:
  Labels: node-agent
  Docker Image: registry.example.com/my-jenkins-agent
  Remote File System Root: /home/jenkins/agent
  
  Container settings:
    Volumes: /var/run/docker.sock:/var/run/docker.sock
    Environment: NODE_ENV=production
```

### Pipeline with Docker Agent

```groovy
pipeline {
    agent {
        label 'docker-agent'
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

### Docker Pipeline Plugin

```groovy
// Using docker directive
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
                sh 'npm ci'
                sh 'npm run build'
            }
        }
    }
}
```

### Docker per Stage

```groovy
pipeline {
    agent none
    
    stages {
        stage('Build') {
            agent {
                docker { image 'node:18' }
            }
            steps {
                sh 'npm ci'
                sh 'npm run build'
                stash includes: 'dist/**/*', name: 'build'
            }
        }
        
        stage('Test') {
            agent {
                docker { image 'mcr.microsoft.com/playwright:v1.40.0' }
            }
            steps {
                unstash 'build'
                sh 'npx playwright test'
            }
        }
    }
}
```

### Docker Compose Agent

```yaml
# docker-compose.yml
version: '3.8'

services:
  jenkins:
    image: jenkins/jenkins:lts
    ports:
      - "8080:8080"
    volumes:
      - jenkins_home:/var/jenkins_home
      - /var/run/docker.sock:/var/run/docker.sock
    group_add:
      - docker

volumes:
  jenkins_home:
```

### Resource Limits

```
Docker Agent templates → Container settings:

Memory Limit: 2g
CPU Shares: 1024
```

### Docker Agent Cleanup

```
Docker Cloud → Container Cap: 10

Idle timeout: 10 minutes
Remove volumes: ✓
```

### Troubleshooting

```
Common issues:

1. Cannot connect to Docker
   - Check Docker socket permissions
   - Verify Docker daemon running
   - Check TLS certificates

2. Image pull fails
   - Check registry credentials
   - Verify image exists
   - Check network access

3. Container exits immediately
   - Check container logs
   - Verify entrypoint
   - Check resource limits
```

### Best Practices

```
✅ Use specific image tags
✅ Set resource limits
✅ Clean up containers
✅ Use private registry
✅ Mount only needed volumes
✅ Run as non-root user
✅ Regular image updates
```

