# Lab 811: Maintenance

## LEARNING CONCEPT

Regular Jenkins maintenance tasks.

## EXERCISE

1. Plan maintenance schedule
2. Implement maintenance tasks
3. Automate maintenance

## SOLUTION

### Maintenance Schedule

```
Daily:
- Monitor build queue
- Check agent health
- Review failed builds

Weekly:
- Clean old builds
- Review disk usage
- Check plugin updates

Monthly:
- Full backup
- Security audit
- Performance review

Quarterly:
- Major upgrades
- Capacity planning
- Documentation review
```

### Build Cleanup

```groovy
// Jenkinsfile option
options {
    buildDiscarder(logRotator(
        numToKeepStr: '10',
        artifactNumToKeepStr: '5',
        daysToKeepStr: '30'
    ))
}
```

### Workspace Cleanup Script

```groovy
// Script Console: Manage Jenkins → Script Console
import hudson.model.*

Jenkins.instance.nodes.each { node ->
    def workspaceRoot = node.workspaceRoot
    
    workspaceRoot.listDirectories().each { workspace ->
        def lastModified = workspace.lastModified()
        def daysOld = (System.currentTimeMillis() - lastModified) / (1000 * 60 * 60 * 24)
        
        if (daysOld > 7) {
            println "Deleting old workspace: ${workspace.name}"
            workspace.deleteRecursive()
        }
    }
}
```

### Plugin Management

```
Update plugins:
1. Manage Jenkins → Plugins → Updates
2. Review changelog
3. Test in staging
4. Update in production

Best practices:
- Update regularly
- Test before production
- Keep backup before update
- Document versions
```

### Backup Strategy

```bash
#!/bin/bash
# backup-jenkins.sh

JENKINS_HOME=/var/lib/jenkins
BACKUP_DIR=/backup/jenkins
DATE=$(date +%Y%m%d)

# Create backup
tar -czf ${BACKUP_DIR}/jenkins-${DATE}.tar.gz \
    --exclude='workspace' \
    --exclude='builds/*/archive' \
    ${JENKINS_HOME}

# Keep only last 7 backups
find ${BACKUP_DIR} -name "jenkins-*.tar.gz" -mtime +7 -delete
```

### What to Backup

```
Essential:
- config.xml (main config)
- jobs/*/config.xml (job configs)
- users/ (user data)
- secrets/ (credentials)
- plugins/ (installed plugins)

Optional:
- builds/ (build history)
- workspace/ (can be rebuilt)
- logs/ (can be regenerated)
```

### Restore Procedure

```bash
#!/bin/bash
# restore-jenkins.sh

JENKINS_HOME=/var/lib/jenkins
BACKUP_FILE=$1

# Stop Jenkins
systemctl stop jenkins

# Restore backup
tar -xzf ${BACKUP_FILE} -C /

# Fix permissions
chown -R jenkins:jenkins ${JENKINS_HOME}

# Start Jenkins
systemctl start jenkins
```

### Health Monitoring

```groovy
// Health check script
import hudson.model.*

def health = [:]

// Check disk space
def diskSpace = new File('/var/lib/jenkins').usableSpace / (1024 * 1024 * 1024)
health['diskSpaceGB'] = diskSpace
health['diskSpaceOK'] = diskSpace > 10

// Check agents
def totalAgents = Jenkins.instance.nodes.size()
def onlineAgents = Jenkins.instance.nodes.count { it.toComputer()?.isOnline() }
health['agentsOnline'] = "${onlineAgents}/${totalAgents}"
health['agentsOK'] = onlineAgents == totalAgents

// Check queue
def queueLength = Jenkins.instance.queue.items.length
health['queueLength'] = queueLength
health['queueOK'] = queueLength < 10

println health
```

### Log Management

```bash
# Rotate Jenkins logs
# /etc/logrotate.d/jenkins
/var/log/jenkins/jenkins.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
    copytruncate
}
```

### Database Maintenance

```sql
-- For external database
-- Clean old build records
DELETE FROM builds WHERE timestamp < NOW() - INTERVAL '90 days';

-- Vacuum database
VACUUM ANALYZE;
```

### Security Maintenance

```
Regular tasks:
- Review user access
- Rotate credentials
- Update security plugins
- Check for vulnerabilities
- Review audit logs
```

### Automated Maintenance Job

```groovy
// Maintenance pipeline
pipeline {
    agent any
    
    triggers {
        cron('0 2 * * 0')  // Weekly at 2 AM Sunday
    }
    
    stages {
        stage('Cleanup') {
            steps {
                script {
                    // Clean old workspaces
                    cleanWs()
                    
                    // Clean Docker
                    sh 'docker system prune -af --volumes'
                }
            }
        }
        
        stage('Backup') {
            steps {
                sh '/opt/scripts/backup-jenkins.sh'
            }
        }
        
        stage('Health Check') {
            steps {
                script {
                    // Run health checks
                    def health = checkJenkinsHealth()
                    
                    if (!health.allOK) {
                        slackSend(
                            channel: '#ops',
                            message: "Jenkins health issues: ${health}"
                        )
                    }
                }
            }
        }
    }
}
```

### Maintenance Checklist

```
□ Clean old builds
□ Clean workspaces
□ Update plugins
□ Backup configuration
□ Review disk usage
□ Check agent health
□ Review security
□ Update documentation
```

### Best Practices

```
✅ Schedule regular maintenance
✅ Automate cleanup tasks
✅ Backup before changes
✅ Monitor health metrics
✅ Document procedures
✅ Test restore process
✅ Keep audit trail
```

