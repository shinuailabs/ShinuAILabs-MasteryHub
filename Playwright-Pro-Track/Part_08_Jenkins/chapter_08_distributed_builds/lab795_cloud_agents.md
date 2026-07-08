# Lab 795: Cloud Agents

## LEARNING CONCEPT

Using cloud providers for on-demand Jenkins agents.

## EXERCISE

1. Configure AWS EC2 agents
2. Set up Azure agents
3. Use GCP agents

## SOLUTION

### AWS EC2 Plugin

```
Install: Amazon EC2 Plugin

Configure:
Manage Jenkins → Clouds → New cloud → Amazon EC2

AWS Credentials: aws-credentials
Region: us-east-1
EC2 Key Pair's Private Key: ec2-key
```

### EC2 AMI Template

```
AMI Templates → Add

Description: Linux Build Agent
AMI ID: ami-0123456789abcdef0
Instance Type: t3.medium
Security Groups: sg-jenkins-agent
Remote FS Root: /home/jenkins
Remote User: ec2-user
Labels: ec2 linux
Init Script:
  #!/bin/bash
  yum install -y java-17-amazon-corretto
  mkdir -p /home/jenkins
  chown ec2-user:ec2-user /home/jenkins
```

### EC2 Spot Instances

```
AMI Templates:
  Use Spot Instance: ✓
  Spot Max Bid Price: 0.05
  Fallback to On-Demand: ✓
  
Benefits:
- Cost savings up to 90%
- Good for non-critical builds
```

### Azure VM Agents

```
Install: Azure VM Agents Plugin

Configure:
Manage Jenkins → Clouds → New cloud → Azure VM Agents

Azure Credentials: azure-service-principal
Resource Group: jenkins-agents
```

### Azure VM Template

```
VM Templates → Add

Name: azure-linux-agent
Labels: azure linux
Virtual Machine Size: Standard_D2s_v3
Image Reference:
  Publisher: Canonical
  Offer: UbuntuServer
  SKU: 20.04-LTS
Admin Credentials: azure-vm-creds
Init Script:
  #!/bin/bash
  apt-get update
  apt-get install -y openjdk-17-jdk
```

### GCP Compute Engine

```
Install: Google Compute Engine Plugin

Configure:
Manage Jenkins → Clouds → New cloud → Google Compute Engine

Project ID: my-gcp-project
Credentials: gcp-service-account
```

### GCP Instance Template

```
Instance Configurations → Add

Name Prefix: jenkins-agent
Region: us-central1
Zone: us-central1-a
Machine Type: n1-standard-2
Boot Disk:
  Image: ubuntu-2004-focal-v20231101
  Size: 50 GB
Labels: gcp linux
Startup Script:
  #!/bin/bash
  apt-get update
  apt-get install -y openjdk-17-jdk
```

### Auto-Scaling Configuration

```
Common settings for all clouds:

Instance Cap: 10
Idle Termination Time: 30 minutes
Minimum Instances: 0
Launch Timeout: 300 seconds
```

### Cost Optimization

```
Strategies:
1. Use spot/preemptible instances
2. Right-size instance types
3. Set idle termination
4. Use instance caps
5. Schedule availability
```

### Pipeline with Cloud Agent

```groovy
pipeline {
    agent {
        label 'ec2 && linux'
    }
    
    stages {
        stage('Build') {
            steps {
                sh 'echo "Running on EC2 instance"'
                sh 'java -version'
            }
        }
    }
}
```

### Multi-Cloud Setup

```groovy
pipeline {
    agent none
    
    stages {
        stage('Build') {
            parallel {
                stage('AWS') {
                    agent { label 'ec2' }
                    steps {
                        sh 'npm run build'
                    }
                }
                stage('Azure') {
                    agent { label 'azure' }
                    steps {
                        sh 'npm run build'
                    }
                }
                stage('GCP') {
                    agent { label 'gcp' }
                    steps {
                        sh 'npm run build'
                    }
                }
            }
        }
    }
}
```

### Cloud Agent Init Script

```bash
#!/bin/bash
# Common init script for cloud agents

# Update system
apt-get update
apt-get upgrade -y

# Install Java
apt-get install -y openjdk-17-jdk

# Install Docker
curl -fsSL https://get.docker.com | sh
usermod -aG docker jenkins

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Create workspace
mkdir -p /home/jenkins/agent
chown -R jenkins:jenkins /home/jenkins
```

### Monitoring Cloud Costs

```
Track costs:
- AWS Cost Explorer
- Azure Cost Management
- GCP Billing

Set budgets and alerts:
- Daily/monthly limits
- Alert on threshold
- Auto-shutdown on budget
```

### Best Practices

```
✅ Use spot/preemptible instances
✅ Set instance caps
✅ Configure idle termination
✅ Use appropriate instance sizes
✅ Monitor costs
✅ Use init scripts for setup
✅ Tag instances for tracking
```

