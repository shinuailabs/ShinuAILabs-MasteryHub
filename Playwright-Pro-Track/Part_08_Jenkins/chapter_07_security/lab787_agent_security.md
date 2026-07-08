# Lab 787: Agent Security

## LEARNING CONCEPT

Securing Jenkins agents and build environments.

## EXERCISE

1. Secure agent connections
2. Isolate build environments
3. Implement agent policies

## SOLUTION

### Agent Connection Methods

```
Secure methods:
1. SSH - Encrypted connection
2. JNLP with TLS - Encrypted tunnel
3. Kubernetes - Pod-based isolation

Less secure:
- JNLP without TLS
- Direct TCP
```

### SSH Agent Setup

```
Manage Jenkins → Nodes → New Node

Launch method: Launch agents via SSH

Host: agent.example.com
Credentials: ssh-agent-key
Host Key Verification: Known hosts file
```

### SSH Key Security

```bash
# Generate dedicated key for Jenkins
ssh-keygen -t ed25519 -f jenkins_agent_key -C "jenkins-agent"

# Restrict key usage
# On agent, add to authorized_keys:
command="/usr/bin/java -jar agent.jar",no-port-forwarding,no-X11-forwarding ssh-ed25519 AAAA... jenkins-agent
```

### JNLP with TLS

```
Manage Jenkins → Security → Agents

TCP port for inbound agents: Fixed (50000)
Agent protocols: 
✓ JNLP4-connect (TLS)
✗ JNLP3-connect (deprecated)
✗ JNLP2-connect (deprecated)
```

### Agent Isolation

```yaml
# Docker agent with isolation
version: '3.8'

services:
  jenkins-agent:
    image: jenkins/inbound-agent
    user: jenkins
    read_only: true
    security_opt:
      - no-new-privileges:true
    cap_drop:
      - ALL
    tmpfs:
      - /tmp
    volumes:
      - workspace:/home/jenkins/agent:rw
```

### Kubernetes Agent Security

```yaml
# Pod template with security context
apiVersion: v1
kind: Pod
spec:
  securityContext:
    runAsNonRoot: true
    runAsUser: 1000
    fsGroup: 1000
  containers:
    - name: jnlp
      image: jenkins/inbound-agent
      securityContext:
        allowPrivilegeEscalation: false
        readOnlyRootFilesystem: true
        capabilities:
          drop:
            - ALL
```

### Agent Labels and Restrictions

```groovy
pipeline {
    agent {
        label 'secure-agent'
    }
    
    stages {
        stage('Build') {
            steps {
                // Runs only on labeled agents
                sh 'npm run build'
            }
        }
    }
}
```

### Restrict Job Execution

```
Node → Configure → Usage

Options:
- Use this node as much as possible
- Only build jobs with label expressions matching this node

Restrict to specific jobs:
- Use folder-based restrictions
- Label-based access control
```

### Agent Workspace Security

```groovy
pipeline {
    agent any
    
    options {
        // Clean workspace before build
        skipDefaultCheckout()
    }
    
    stages {
        stage('Checkout') {
            steps {
                cleanWs()
                checkout scm
            }
        }
    }
    
    post {
        always {
            // Clean workspace after build
            cleanWs()
        }
    }
}
```

### Ephemeral Agents

```groovy
// Use Docker for ephemeral agents
pipeline {
    agent {
        docker {
            image 'node:18'
            // Container destroyed after build
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

### Agent Monitoring

```groovy
// Monitor agent health
pipeline {
    agent any
    
    triggers {
        cron('H * * * *')  // Hourly
    }
    
    stages {
        stage('Check Agents') {
            steps {
                script {
                    def nodes = Jenkins.instance.nodes
                    
                    nodes.each { node ->
                        def computer = node.toComputer()
                        
                        if (computer.isOffline()) {
                            echo "ALERT: ${node.name} is offline"
                            slackSend(
                                color: 'warning',
                                message: "Agent ${node.name} is offline"
                            )
                        }
                    }
                }
            }
        }
    }
}
```

### Agent Hardening

```bash
# On agent machine

# Dedicated user
useradd -m -s /bin/bash jenkins

# Restrict sudo
# No sudo access for jenkins user

# Firewall
ufw default deny incoming
ufw allow from jenkins-controller-ip to any port 22

# File permissions
chmod 700 /home/jenkins
chown -R jenkins:jenkins /home/jenkins
```

### Network Segmentation

```
Recommended architecture:
┌─────────────────┐
│  Jenkins        │
│  Controller     │
└────────┬────────┘
         │ (Secure network)
    ┌────┴────┐
    │         │
┌───┴───┐ ┌───┴───┐
│Agent 1│ │Agent 2│
│(Build)│ │(Test) │
└───────┘ └───────┘
```

### Best Practices

```
✅ Use SSH or JNLP with TLS
✅ Isolate agents from controller
✅ Use ephemeral agents
✅ Clean workspaces
✅ Restrict agent access
✅ Monitor agent health
✅ Regular security updates
✅ Network segmentation
```

