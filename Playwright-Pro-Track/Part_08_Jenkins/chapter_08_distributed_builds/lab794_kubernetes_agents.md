# Lab 794: Kubernetes Agents

## LEARNING CONCEPT

Using Kubernetes pods as Jenkins agents.

## EXERCISE

1. Configure Kubernetes cloud
2. Create pod templates
3. Use K8s agents in pipelines

## SOLUTION

### Install Kubernetes Plugin

```
Manage Jenkins → Plugins → Available
Install: Kubernetes plugin
```

### Configure Kubernetes Cloud

```
Manage Jenkins → Clouds → New cloud → Kubernetes

Kubernetes Cloud details:
  Name: kubernetes
  Kubernetes URL: https://kubernetes.default.svc
  Kubernetes Namespace: jenkins
  Credentials: kubernetes-service-account
  Jenkins URL: http://jenkins.jenkins.svc:8080
  Jenkins tunnel: jenkins-agent.jenkins.svc:50000
```

### Service Account

```yaml
# jenkins-sa.yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: jenkins
  namespace: jenkins
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: jenkins
  namespace: jenkins
rules:
  - apiGroups: [""]
    resources: ["pods", "pods/exec", "pods/log"]
    verbs: ["*"]
  - apiGroups: [""]
    resources: ["secrets"]
    verbs: ["get"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: jenkins
  namespace: jenkins
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: jenkins
subjects:
  - kind: ServiceAccount
    name: jenkins
    namespace: jenkins
```

### Pod Template

```
Kubernetes Cloud → Pod Templates → Add Pod Template

Name: jnlp
Namespace: jenkins
Labels: kubernetes-agent

Containers:
  Name: jnlp
  Docker image: jenkins/inbound-agent
  Working directory: /home/jenkins/agent
  Command to run: (leave empty)
  Arguments: (leave empty)
```

### Custom Pod Template

```yaml
# Pod template in Jenkins UI
apiVersion: v1
kind: Pod
spec:
  containers:
    - name: jnlp
      image: jenkins/inbound-agent
      resources:
        requests:
          memory: "256Mi"
          cpu: "100m"
        limits:
          memory: "512Mi"
          cpu: "500m"
    - name: node
      image: node:18
      command:
        - cat
      tty: true
    - name: docker
      image: docker:dind
      securityContext:
        privileged: true
```

### Pipeline with Kubernetes Agent

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
'''
        }
    }
    
    stages {
        stage('Build') {
            steps {
                container('node') {
                    sh 'node --version'
                    sh 'npm ci'
                    sh 'npm run build'
                }
            }
        }
    }
}
```

### Multi-Container Pod

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
      command: ["cat"]
      tty: true
    - name: playwright
      image: mcr.microsoft.com/playwright:v1.40.0
      command: ["cat"]
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
                    sh 'npm ci'
                    sh 'npm run build'
                }
            }
        }
        
        stage('Test') {
            steps {
                container('playwright') {
                    sh 'npx playwright test'
                }
            }
        }
        
        stage('Docker Build') {
            steps {
                container('docker') {
                    sh 'docker build -t my-app .'
                }
            }
        }
    }
}
```

### Pod Template from File

```groovy
pipeline {
    agent {
        kubernetes {
            yamlFile 'jenkins/pod-template.yaml'
        }
    }
    
    stages {
        stage('Build') {
            steps {
                container('node') {
                    sh 'npm run build'
                }
            }
        }
    }
}
```

### Shared Pod Template

```
Kubernetes Cloud → Pod Templates

Name: node-builder
Labels: node-builder
Containers:
  - Name: jnlp
    Image: jenkins/inbound-agent
  - Name: node
    Image: node:18
    Command: cat
    TTY: true
```

```groovy
pipeline {
    agent {
        label 'node-builder'
    }
    
    stages {
        stage('Build') {
            steps {
                container('node') {
                    sh 'npm run build'
                }
            }
        }
    }
}
```

### Resource Management

```groovy
agent {
    kubernetes {
        yaml '''
spec:
  containers:
    - name: node
      image: node:18
      resources:
        requests:
          memory: "512Mi"
          cpu: "250m"
        limits:
          memory: "1Gi"
          cpu: "1"
'''
    }
}
```

### Persistent Volume

```groovy
agent {
    kubernetes {
        yaml '''
spec:
  containers:
    - name: node
      image: node:18
      volumeMounts:
        - name: npm-cache
          mountPath: /home/jenkins/.npm
  volumes:
    - name: npm-cache
      persistentVolumeClaim:
        claimName: npm-cache-pvc
'''
    }
}
```

### Best Practices

```
✅ Use resource limits
✅ Use pod templates for common patterns
✅ Clean up pods after builds
✅ Use node selectors for specific workloads
✅ Monitor pod resource usage
✅ Use persistent volumes for caching
```

