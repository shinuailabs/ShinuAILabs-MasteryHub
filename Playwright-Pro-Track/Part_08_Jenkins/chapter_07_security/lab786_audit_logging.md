# Lab 786: Audit Logging

## LEARNING CONCEPT

Implementing audit logging in Jenkins.

## EXERCISE

1. Configure audit trail
2. Monitor security events
3. Analyze audit logs

## SOLUTION

### Audit Trail Plugin

```
Install: Audit Trail Plugin

Features:
- Log configuration changes
- Track user actions
- Security event monitoring
```

### Configure Audit Trail

```
Manage Jenkins → System → Audit Trail

Loggers:
1. Add logger
2. Select log destination
3. Configure format
```

### Log to File

```
Logger: Log file

Log Location: /var/log/jenkins/audit.log
Log File Size: 100 MB
Log File Count: 10
```

### Log to Syslog

```
Logger: Syslog server

Syslog Server: syslog.example.com
Syslog Port: 514
Facility: LOCAL0
```

### Log Format

```
Default format:
timestamp user action details

Example:
2024-01-15 10:30:00 admin /job/my-job/config.xml changed
2024-01-15 10:31:00 developer /job/my-job/build started
```

### Events Logged

```
Configuration changes:
- Job configuration
- System configuration
- Plugin changes
- Credential changes

User actions:
- Login/logout
- Build triggers
- Job creation/deletion
- Permission changes
```

### Custom Audit Logging

```groovy
// Log custom events in pipeline
pipeline {
    agent any
    
    stages {
        stage('Audit') {
            steps {
                script {
                    def user = currentBuild.rawBuild.getCause(
                        hudson.model.Cause$UserIdCause
                    )?.userId ?: 'system'
                    
                    echo "AUDIT: ${user} started build ${env.BUILD_NUMBER}"
                    
                    // Write to file
                    writeFile(
                        file: '/var/log/jenkins/custom-audit.log',
                        text: "${new Date()} - ${user} - Build started\n",
                        append: true
                    )
                }
            }
        }
    }
}
```

### Job Config History Plugin

```
Install: Job Configuration History Plugin

Features:
- Track job configuration changes
- Compare versions
- Restore previous configurations

View:
Job → Job Config History
```

### Build User Vars Plugin

```
Install: Build User Vars Plugin

Access build user info:
- BUILD_USER
- BUILD_USER_ID
- BUILD_USER_EMAIL
```

```groovy
pipeline {
    agent any
    
    stages {
        stage('Log User') {
            steps {
                wrap([$class: 'BuildUser']) {
                    echo "Build started by: ${env.BUILD_USER}"
                    echo "User ID: ${env.BUILD_USER_ID}"
                    echo "Email: ${env.BUILD_USER_EMAIL}"
                }
            }
        }
    }
}
```

### Security Events

```
Monitor these events:
- Failed login attempts
- Permission denied
- Configuration changes
- Credential access
- Plugin installations
- Agent connections
```

### Log Analysis

```bash
# Search audit logs
grep "config.xml changed" /var/log/jenkins/audit.log

# Find user actions
grep "admin" /var/log/jenkins/audit.log

# Count events by type
awk '{print $3}' /var/log/jenkins/audit.log | sort | uniq -c

# Recent changes
tail -100 /var/log/jenkins/audit.log
```

### ELK Stack Integration

```yaml
# Filebeat configuration
filebeat.inputs:
  - type: log
    enabled: true
    paths:
      - /var/log/jenkins/audit.log
    fields:
      log_type: jenkins_audit

output.elasticsearch:
  hosts: ["elasticsearch:9200"]
  index: "jenkins-audit-%{+yyyy.MM.dd}"
```

### Splunk Integration

```
# Splunk forwarder configuration
[monitor:///var/log/jenkins/audit.log]
disabled = false
index = jenkins
sourcetype = jenkins_audit
```

### Alert on Security Events

```groovy
// Alert on suspicious activity
pipeline {
    agent any
    
    triggers {
        cron('H/15 * * * *')  // Every 15 minutes
    }
    
    stages {
        stage('Check Audit') {
            steps {
                script {
                    def log = readFile('/var/log/jenkins/audit.log')
                    def failedLogins = log.count('login failed')
                    
                    if (failedLogins > 10) {
                        slackSend(
                            color: 'danger',
                            message: "Alert: ${failedLogins} failed login attempts"
                        )
                    }
                }
            }
        }
    }
}
```

### Compliance Requirements

```
SOC 2:
- Log all access
- Retain logs 1 year
- Monitor for anomalies

GDPR:
- Log data access
- Track user consent
- Enable data deletion

PCI DSS:
- Log all access to cardholder data
- Retain logs 1 year
- Daily log review
```

### Best Practices

```
✅ Enable audit logging
✅ Log to external system
✅ Set appropriate retention
✅ Monitor security events
✅ Regular log review
✅ Alert on anomalies
✅ Protect log integrity
✅ Meet compliance requirements
```

