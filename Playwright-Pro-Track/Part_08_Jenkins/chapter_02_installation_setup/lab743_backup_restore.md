# Lab 743: Backup and Restore

## LEARNING CONCEPT

Implementing backup and restore strategies for Jenkins.

## EXERCISE

1. Create backup strategy
2. Perform backup
3. Restore from backup

## SOLUTION

### What to Backup

```
Essential:
- config.xml (main configuration)
- jobs/ (job configurations)
- users/ (user accounts)
- secrets/ (encryption keys)
- credentials.xml

Optional:
- plugins/ (can reinstall)
- builds/ (build history)
- workspace/ (can rebuild)
- logs/ (for debugging)
```

### Manual Backup

```bash
#!/bin/bash
# backup-jenkins.sh

JENKINS_HOME=/var/lib/jenkins
BACKUP_DIR=/backup/jenkins
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup essential files
tar -czvf $BACKUP_DIR/jenkins-backup-$DATE.tar.gz \
    -C $JENKINS_HOME \
    config.xml \
    jobs \
    users \
    secrets \
    credentials.xml \
    nodes \
    plugins

# Keep only last 7 backups
find $BACKUP_DIR -name "jenkins-backup-*.tar.gz" -mtime +7 -delete

echo "Backup completed: jenkins-backup-$DATE.tar.gz"
```

### Scheduled Backup (Cron)

```bash
# Add to crontab
# crontab -e

# Daily backup at 2 AM
0 2 * * * /opt/scripts/backup-jenkins.sh >> /var/log/jenkins-backup.log 2>&1
```

### ThinBackup Plugin

```
1. Install ThinBackup plugin
2. Manage Jenkins → ThinBackup

Configuration:
- Backup directory: /backup/jenkins
- Backup schedule: H 2 * * *
- Max number of backup sets: 7
- Files excluded: builds, workspace
- Backup build results: No
```

### Docker Backup

```bash
#!/bin/bash
# docker-backup-jenkins.sh

CONTAINER=jenkins
BACKUP_DIR=/backup/jenkins
DATE=$(date +%Y%m%d_%H%M%S)

# Stop Jenkins (optional, for consistency)
# docker stop $CONTAINER

# Backup volume
docker run --rm \
    -v jenkins_home:/jenkins \
    -v $BACKUP_DIR:/backup \
    alpine tar -czvf /backup/jenkins-$DATE.tar.gz \
    -C /jenkins \
    config.xml jobs users secrets credentials.xml nodes plugins

# Start Jenkins
# docker start $CONTAINER

echo "Backup completed: jenkins-$DATE.tar.gz"
```

### Restore from Backup

```bash
#!/bin/bash
# restore-jenkins.sh

JENKINS_HOME=/var/lib/jenkins
BACKUP_FILE=$1

if [ -z "$BACKUP_FILE" ]; then
    echo "Usage: restore-jenkins.sh <backup-file>"
    exit 1
fi

# Stop Jenkins
sudo systemctl stop jenkins

# Restore backup
sudo tar -xzvf $BACKUP_FILE -C $JENKINS_HOME

# Fix permissions
sudo chown -R jenkins:jenkins $JENKINS_HOME

# Start Jenkins
sudo systemctl start jenkins

echo "Restore completed"
```

### Docker Restore

```bash
#!/bin/bash
# docker-restore-jenkins.sh

BACKUP_FILE=$1

# Stop container
docker stop jenkins

# Restore volume
docker run --rm \
    -v jenkins_home:/jenkins \
    -v $(pwd):/backup \
    alpine sh -c "rm -rf /jenkins/* && tar -xzvf /backup/$BACKUP_FILE -C /jenkins"

# Start container
docker start jenkins
```

### S3 Backup

```bash
#!/bin/bash
# s3-backup-jenkins.sh

JENKINS_HOME=/var/lib/jenkins
S3_BUCKET=s3://my-jenkins-backups
DATE=$(date +%Y%m%d_%H%M%S)

# Create local backup
tar -czvf /tmp/jenkins-$DATE.tar.gz \
    -C $JENKINS_HOME \
    config.xml jobs users secrets credentials.xml

# Upload to S3
aws s3 cp /tmp/jenkins-$DATE.tar.gz $S3_BUCKET/

# Cleanup local file
rm /tmp/jenkins-$DATE.tar.gz

# Remove old backups from S3 (keep 30 days)
aws s3 ls $S3_BUCKET/ | while read -r line; do
    createDate=$(echo $line | awk '{print $1" "$2}')
    createDate=$(date -d "$createDate" +%s)
    olderThan=$(date -d "30 days ago" +%s)
    if [[ $createDate -lt $olderThan ]]; then
        fileName=$(echo $line | awk '{print $4}')
        aws s3 rm $S3_BUCKET/$fileName
    fi
done
```

### Backup Best Practices

```
✅ Automate backups
✅ Test restore regularly
✅ Store backups off-site
✅ Encrypt sensitive backups
✅ Document restore procedure
✅ Monitor backup success
✅ Keep multiple backup generations
```

