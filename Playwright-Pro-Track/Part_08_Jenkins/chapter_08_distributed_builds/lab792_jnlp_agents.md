# Lab 792: JNLP Agents

## LEARNING CONCEPT

Setting up Jenkins agents via JNLP (inbound connection).

## EXERCISE

1. Configure JNLP agent
2. Connect agent to controller
3. Run as service

## SOLUTION

### Enable JNLP Port

```
Manage Jenkins → Security → Agents

TCP port for inbound agents:
- Fixed: 50000
- Random: (not recommended)
- Disable: (if not using JNLP)

Agent protocols:
✓ Inbound TCP Agent Protocol/4 (TLS)
```

### Create JNLP Agent

```
Manage Jenkins → Nodes → New Node

Node name: jnlp-agent-1
Type: Permanent Agent

Configuration:
- Remote root directory: /home/jenkins/agent
- Labels: linux jnlp
- Usage: Use this node as much as possible
- Launch method: Launch agent by connecting it to the controller
```

### Get Agent Connection Info

```
After creating agent:
Manage Jenkins → Nodes → jnlp-agent-1

Connection info:
- Secret: abc123...
- Agent JAR URL: http://jenkins:8080/jnlpJars/agent.jar
```

### Connect Agent (Command Line)

```bash
# Download agent.jar
curl -O http://jenkins:8080/jnlpJars/agent.jar

# Connect agent
java -jar agent.jar \
    -url http://jenkins:8080/ \
    -secret abc123... \
    -name jnlp-agent-1 \
    -workDir /home/jenkins/agent
```

### Connect with WebSocket

```bash
java -jar agent.jar \
    -url http://jenkins:8080/ \
    -secret abc123... \
    -name jnlp-agent-1 \
    -workDir /home/jenkins/agent \
    -webSocket
```

### Run as Linux Service

```bash
# /etc/systemd/system/jenkins-agent.service
[Unit]
Description=Jenkins Agent
After=network.target

[Service]
Type=simple
User=jenkins
WorkingDirectory=/home/jenkins/agent
ExecStart=/usr/bin/java -jar /home/jenkins/agent.jar \
    -url http://jenkins:8080/ \
    -secret abc123... \
    -name jnlp-agent-1 \
    -workDir /home/jenkins/agent
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start
systemctl daemon-reload
systemctl enable jenkins-agent
systemctl start jenkins-agent
```

### Run as Windows Service

```powershell
# Download agent
Invoke-WebRequest -Uri "http://jenkins:8080/jnlpJars/agent.jar" -OutFile "C:\Jenkins\agent.jar"

# Install as service using NSSM
nssm install JenkinsAgent "C:\Program Files\Java\jdk-17\bin\java.exe"
nssm set JenkinsAgent AppParameters "-jar C:\Jenkins\agent.jar -url http://jenkins:8080/ -secret abc123... -name windows-agent -workDir C:\Jenkins\agent"
nssm set JenkinsAgent AppDirectory "C:\Jenkins"
nssm start JenkinsAgent
```

### Docker JNLP Agent

```bash
docker run -d \
    --name jenkins-agent \
    -e JENKINS_URL=http://jenkins:8080 \
    -e JENKINS_SECRET=abc123... \
    -e JENKINS_AGENT_NAME=docker-agent \
    -e JENKINS_AGENT_WORKDIR=/home/jenkins/agent \
    jenkins/inbound-agent
```

### Docker Compose

```yaml
version: '3.8'

services:
  jenkins-agent:
    image: jenkins/inbound-agent
    environment:
      - JENKINS_URL=http://jenkins:8080
      - JENKINS_SECRET=abc123...
      - JENKINS_AGENT_NAME=docker-agent
      - JENKINS_AGENT_WORKDIR=/home/jenkins/agent
    volumes:
      - agent-workspace:/home/jenkins/agent
    restart: unless-stopped

volumes:
  agent-workspace:
```

### Agent with Tools

```dockerfile
FROM jenkins/inbound-agent

USER root

# Install tools
RUN apt-get update && apt-get install -y \
    nodejs \
    npm \
    docker.io

USER jenkins
```

### Kubernetes JNLP Agent

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: jenkins-agent
spec:
  containers:
    - name: jnlp
      image: jenkins/inbound-agent
      env:
        - name: JENKINS_URL
          value: "http://jenkins:8080"
        - name: JENKINS_SECRET
          valueFrom:
            secretKeyRef:
              name: jenkins-agent-secret
              key: secret
        - name: JENKINS_AGENT_NAME
          value: "k8s-agent"
```

### Troubleshooting

```
Common issues:

1. Connection refused
   - Check JNLP port enabled
   - Verify firewall rules
   - Check controller URL

2. Invalid secret
   - Regenerate secret
   - Check agent name matches

3. Agent disconnects
   - Check network stability
   - Increase timeout
   - Check Java memory
```

### Agent Logs

```bash
# View agent logs
journalctl -u jenkins-agent -f

# Docker logs
docker logs -f jenkins-agent

# Agent log file
tail -f /home/jenkins/agent/remoting/logs/remoting.log
```

### Best Practices

```
✅ Use TLS (protocol 4)
✅ Run as service
✅ Use WebSocket through proxies
✅ Monitor agent health
✅ Secure agent secret
✅ Regular agent updates
✅ Document connection details
```

