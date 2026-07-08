# Lab 675: Volume Backup and Restore

## LEARNING CONCEPT

Backing up and restoring Docker volumes.

## EXERCISE

1. Backup volume data
2. Restore from backup
3. Automate backups

## SOLUTION

### Backup Volume to Tar

```bash
# Backup volume to tar file
docker run --rm \
    -v my-volume:/data \
    -v $(pwd):/backup \
    alpine tar czf /backup/backup.tar.gz -C /data .

# Backup with timestamp
docker run --rm \
    -v my-volume:/data \
    -v $(pwd):/backup \
    alpine tar czf /backup/backup-$(date +%Y%m%d).tar.gz -C /data .
```

### Restore Volume from Tar

```bash
# Create new volume
docker volume create restored-volume

# Restore from backup
docker run --rm \
    -v restored-volume:/data \
    -v $(pwd):/backup \
    alpine tar xzf /backup/backup.tar.gz -C /data
```

### Backup Running Container Volume

```bash
# Stop container first (recommended)
docker stop my-container

# Backup
docker run --rm \
    --volumes-from my-container \
    -v $(pwd):/backup \
    alpine tar czf /backup/backup.tar.gz -C /data .

# Start container
docker start my-container
```

### Backup Script

```bash
#!/bin/bash
# backup-volume.sh

VOLUME_NAME=$1
BACKUP_DIR=${2:-./backups}
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/${VOLUME_NAME}_${TIMESTAMP}.tar.gz"

mkdir -p $BACKUP_DIR

docker run --rm \
    -v ${VOLUME_NAME}:/data \
    -v ${BACKUP_DIR}:/backup \
    alpine tar czf /backup/${VOLUME_NAME}_${TIMESTAMP}.tar.gz -C /data .

echo "Backup created: $BACKUP_FILE"
```

### Restore Script

```bash
#!/bin/bash
# restore-volume.sh

BACKUP_FILE=$1
VOLUME_NAME=$2

if [ -z "$BACKUP_FILE" ] || [ -z "$VOLUME_NAME" ]; then
    echo "Usage: restore-volume.sh <backup-file> <volume-name>"
    exit 1
fi

# Create volume if not exists
docker volume create $VOLUME_NAME

# Restore
docker run --rm \
    -v ${VOLUME_NAME}:/data \
    -v $(pwd):/backup \
    alpine tar xzf /backup/$(basename $BACKUP_FILE) -C /data

echo "Restored to volume: $VOLUME_NAME"
```

### Database Backup

```bash
# PostgreSQL backup
docker exec my-postgres pg_dump -U postgres mydb > backup.sql

# PostgreSQL restore
docker exec -i my-postgres psql -U postgres mydb < backup.sql

# MySQL backup
docker exec my-mysql mysqldump -u root -p mydb > backup.sql

# MySQL restore
docker exec -i my-mysql mysql -u root -p mydb < backup.sql
```

### Automated Backup with Cron

```bash
# Add to crontab
# Backup daily at 2 AM
0 2 * * * /path/to/backup-volume.sh my-volume /backups

# Backup with retention (keep 7 days)
0 2 * * * /path/to/backup-volume.sh my-volume /backups && \
    find /backups -name "*.tar.gz" -mtime +7 -delete
```

### Docker Compose Backup

```yaml
# docker-compose.backup.yml
version: '3'
services:
  backup:
    image: alpine
    volumes:
      - my-volume:/data:ro
      - ./backups:/backup
    command: tar czf /backup/backup-$(date +%Y%m%d).tar.gz -C /data .

volumes:
  my-volume:
    external: true
```

```bash
# Run backup
docker-compose -f docker-compose.backup.yml run --rm backup
```

### Cloud Backup

```bash
# Backup to S3
docker run --rm \
    -v my-volume:/data \
    -e AWS_ACCESS_KEY_ID \
    -e AWS_SECRET_ACCESS_KEY \
    amazon/aws-cli \
    s3 sync /data s3://my-bucket/backups/

# Restore from S3
docker run --rm \
    -v my-volume:/data \
    -e AWS_ACCESS_KEY_ID \
    -e AWS_SECRET_ACCESS_KEY \
    amazon/aws-cli \
    s3 sync s3://my-bucket/backups/ /data
```

### Best Practices

```
✅ Backup regularly
✅ Test restores
✅ Store backups off-site
✅ Encrypt sensitive backups
✅ Implement retention policy
✅ Document backup procedures
✅ Monitor backup success
```

