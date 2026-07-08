# Lab 813: Backup and Recovery

## LEARNING CONCEPT

Implementing backup and disaster recovery for Jenkins.

## EXERCISE

1. Create backup strategy
2. Implement automated backups
3. Test recovery procedures

## SOLUTION

### Backup Strategy

```
Backup Types:
1. Full backup - Everything
2. Incremental - Changes only
3. Configuration only - Jobs and settings

Frequency:
- Full: Weekly
- Incremental: Daily
- Configuration: After changes
```

### What to Backup

```
Critical (must backup):
├── config.xml              # Main configuration
├── jobs/*/config.xml       # Job configurations
├── users/                  # User accounts
├── secrets/                # Credentials
├── nodes/                  # Agent configurations
└── plugins/                # Installed plugins

Optional:
├── builds/                 # Build history
├── workspace/              # Can be rebuilt
└── logs/                   # Can be regenerated
```

### Backup Script

```bash
#!/bin/bash
# backup-jenkins.sh

set -e

JENKINS_HOME="${JENKINS_HOME:-/var/lib/jenkins}"
BACKUP_DIR="${BACKUP_DIR:-/backup/jenkins}"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/jenkins-backup-${DATE}.tar.gz"

# Create backup directory
mkdir -p "${BACKUP_DIR}"

# Stop Jenkins for consistent backup (optional)
# systemctl stop jenkins

# Create backup
tar -czf "${BACKUP_FILE}" \
    --exclude='workspace' \
    --exclude='builds/*/archive' \
    --exclude='caches' \
    --exclude='logs' \
    -C "$(dirname ${JENKINS_HOME})" \
    "$(basename ${JENKINS_HOME})"

# Start Jenkins
# systemctl start jenkins

# Verify backup
tar -tzf "${BACKUP_FILE}" > /dev/null

echo "Backup created: ${BACKUP_FILE}"
echo "Size: $(du -h ${BACKUP_FILE} | cut -f1)"

# Cleanup old backups (keep last 7)
find "${BACKUP_DIR}" -name "jenkins-backup-*.tar.gz" -mtime +7 -delete
```

### Configuration-Only Backup

```bash
#!/bin/bash
# backup-config.sh

JENKINS_HOME=/var/lib/jenkins
BACKUP_DIR=/backup/jenkins/config
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p "${BACKUP_DIR}"

# Backup configuration files only
tar -czf "${BACKUP_DIR}/jenkins-config-${DATE}.tar.gz" \
    -C "${JENKINS_HOME}" \
    config.xml \
    jobs/*/config.xml \
    users/ \
    secrets/ \
    nodes/ \
    credentials.xml \
    hudson.plugins.git.GitTool.xml \
    jenkins.model.JenkinsLocationConfiguration.xml
```

### Automated Backup Job

```groovy
pipeline {
    agent any
    
    triggers {
        cron('0 2 * * *')  // Daily at 2 AM
    }
    
    environment {
        BACKUP_DIR = '/backup/jenkins'
    }
    
    stages {
        stage('Backup') {
            steps {
                sh '''
                    DATE=$(date +%Y%m%d)
                    BACKUP_FILE="${BACKUP_DIR}/jenkins-${DATE}.tar.gz"
                    
                    tar -czf "${BACKUP_FILE}" \
                        --exclude='workspace' \
                        -C /var/lib jenkins
                    
                    echo "Backup created: ${BACKUP_FILE}"
                '''
            }
        }
        
        stage('Upload to S3') {
            steps {
                withAWS(credentials: 'aws-credentials') {
                    sh '''
                        DATE=$(date +%Y%m%d)
                        aws s3 cp "${BACKUP_DIR}/jenkins-${DATE}.tar.gz" \
                            s3://my-backups/jenkins/
                    '''
                }
            }
        }
        
        stage('Cleanup') {
            steps {
                sh 'find ${BACKUP_DIR} -name "*.tar.gz" -mtime +7 -delete'
            }
        }
    }
    
    post {
        failure {
            slackSend(
                channel: '#ops',
                color: 'danger',
                message: '❌ Jenkins backup failed!'
            )
        }
    }
}
```

### Restore Procedure

```bash
#!/bin/bash
# restore-jenkins.sh

set -e

BACKUP_FILE=$1
JENKINS_HOME=/var/lib/jenkins

if [ -z "$BACKUP_FILE" ]; then
    echo "Usage: $0 <backup-file>"
    exit 1
fi

# Stop Jenkins
echo "Stopping Jenkins..."
systemctl stop jenkins

# Backup current state
echo "Backing up current state..."
mv "${JENKINS_HOME}" "${JENKINS_HOME}.old"

# Restore from backup
echo "Restoring from backup..."
mkdir -p "${JENKINS_HOME}"
tar -xzf "${BACKUP_FILE}" -C "$(dirname ${JENKINS_HOME})"

# Fix permissions
echo "Fixing permissions..."
chown -R jenkins:jenkins "${JENKINS_HOME}"

# Start Jenkins
echo "Starting Jenkins..."
systemctl start jenkins

echo "Restore complete!"
echo "Old installation saved to ${JENKINS_HOME}.old"
```

### Disaster Recovery Plan

```
1. Detection
   - Monitor alerts
   - Health checks fail
   - User reports

2. Assessment
   - Identify scope
   - Determine cause
   - Estimate recovery time

3. Recovery
   - Provision new server
   - Restore from backup
   - Verify functionality
   - Reconnect agents

4. Post-Recovery
   - Root cause analysis
   - Update procedures
   - Document lessons learned
```

### Recovery Testing

```bash
#!/bin/bash
# test-restore.sh

# Create test environment
docker run -d --name jenkins-test \
    -p 8081:8080 \
    jenkins/jenkins:lts

# Wait for startup
sleep 60

# Stop and restore
docker stop jenkins-test
docker cp backup.tar.gz jenkins-test:/tmp/
docker start jenkins-test
docker exec jenkins-test tar -xzf /tmp/backup.tar.gz -C /var/jenkins_home

# Verify
curl -s http://localhost:8081/api/json | jq .

# Cleanup
docker rm -f jenkins-test
```

### Best Practices

```
✅ Automate backups
✅ Test restores regularly
✅ Store backups offsite
✅ Encrypt sensitive data
✅ Document procedures
✅ Monitor backup jobs
✅ Version control configs
```

