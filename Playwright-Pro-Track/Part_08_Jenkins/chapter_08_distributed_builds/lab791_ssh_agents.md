# Lab 791: SSH Agents

## LEARNING CONCEPT

Setting up Jenkins agents via SSH.

## EXERCISE

1. Configure SSH agent
2. Set up credentials
3. Troubleshoot connections

## SOLUTION

### Prerequisites

```bash
# On agent machine
# Install Java
apt-get update
apt-get install openjdk-17-jdk

# Create jenkins user
useradd -m -s /bin/bash jenkins

# Create workspace directory
mkdir -p /home/jenkins/agent
chown jenkins:jenkins /home/jenkins/agent
```

### Generate SSH Key

```bash
# On controller or locally
ssh-keygen -t ed25519 -f jenkins_agent_key -C "jenkins-agent"

# Copy public key to agent
ssh-copy-id -i jenkins_agent_key.pub jenkins@agent-host
```

### Add SSH Credentials

```
Manage Jenkins → Credentials → System → Global credentials

Kind: SSH Username with private key
ID: ssh-agent-key
Username: jenkins
Private Key: Enter directly (paste private key)
Passphrase: (if set)
```

### Create SSH Agent

```
Manage Jenkins → Nodes → New Node

Node name: linux-agent-1
Type: Permanent Agent

Configuration:
- Remote root directory: /home/jenkins/agent
- Labels: linux docker
- Usage: Use this node as much as possible
- Launch method: Launch agents via SSH
- Host: agent-host.example.com
- Credentials: ssh-agent-key
- Host Key Verification Strategy: Known hosts file
```

### Host Key Verification

```
Options:
1. Known hosts file verification
   - Most secure
   - Requires known_hosts setup

2. Manually trusted key verification
   - Trust on first connect
   - Verify fingerprint

3. Non verifying verification strategy
   - Not recommended
   - Security risk
```

### Setup Known Hosts

```bash
# On controller
mkdir -p /var/lib/jenkins/.ssh
ssh-keyscan agent-host.example.com >> /var/lib/jenkins/.ssh/known_hosts
chown -R jenkins:jenkins /var/lib/jenkins/.ssh
chmod 700 /var/lib/jenkins/.ssh
chmod 600 /var/lib/jenkins/.ssh/known_hosts
```

### SSH Agent Configuration

```
Advanced settings:

Java Path: /usr/bin/java
JVM Options: -Xmx512m
Prefix Start Agent Command: 
Suffix Start Agent Command:
Connection Timeout: 60
Max Retries: 10
Retry Wait Time: 15
```

### Agent Environment

```
Node → Configure → Node Properties

Environment variables:
Name: PATH
Value: /usr/local/bin:/usr/bin:/bin

Tool Locations:
Name: JDK
Home: /usr/lib/jvm/java-17-openjdk
```

### Multiple SSH Agents

```bash
#!/bin/bash
# setup-agents.sh

AGENTS="agent1.example.com agent2.example.com agent3.example.com"

for agent in $AGENTS; do
    echo "Setting up $agent..."
    
    # Copy SSH key
    ssh-copy-id -i jenkins_agent_key.pub jenkins@$agent
    
    # Install Java
    ssh jenkins@$agent "sudo apt-get update && sudo apt-get install -y openjdk-17-jdk"
    
    # Create workspace
    ssh jenkins@$agent "mkdir -p /home/jenkins/agent"
done
```

### Troubleshooting

```
Common issues:

1. Connection refused
   - Check SSH service running
   - Verify firewall rules
   - Check port 22 open

2. Authentication failed
   - Verify credentials
   - Check key permissions
   - Verify authorized_keys

3. Java not found
   - Set Java path in agent config
   - Install Java on agent

4. Permission denied
   - Check workspace permissions
   - Verify user ownership
```

### Debug SSH Connection

```bash
# Test SSH connection
ssh -i jenkins_agent_key jenkins@agent-host

# Verbose SSH
ssh -v -i jenkins_agent_key jenkins@agent-host

# Check agent logs
tail -f /var/log/jenkins/jenkins.log
```

### Agent Availability

```
Node → Configure → Availability

Options:
- Keep this agent online as much as possible
- Bring this agent online according to schedule
  - Startup: 0 8 * * 1-5 (8 AM weekdays)
  - Shutdown: 0 20 * * 1-5 (8 PM weekdays)
- Bring this agent online when in demand
  - In demand delay: 1 minute
  - Idle delay: 10 minutes
```

### SSH Agent in Pipeline

```groovy
pipeline {
    agent {
        label 'linux-agent-1'
    }
    
    stages {
        stage('Build') {
            steps {
                sh 'echo "Running on $(hostname)"'
                sh 'java -version'
            }
        }
    }
}
```

### Best Practices

```
✅ Use SSH key authentication
✅ Use known hosts verification
✅ Dedicated jenkins user
✅ Minimal permissions
✅ Regular key rotation
✅ Monitor agent health
✅ Document agent setup
```

