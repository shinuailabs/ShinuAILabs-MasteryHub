# Lab 660: Container Logging

## LEARNING CONCEPT

Managing and configuring container logs.

### Logging Drivers:
- json-file (default)
- syslog
- journald
- fluentd
- awslogs
- splunk

## EXERCISE

1. View container logs
2. Configure logging
3. Implement log rotation

## SOLUTION

### View Logs

```bash
# View all logs
docker logs my-container

# Follow logs (tail -f)
docker logs -f my-container

# Last N lines
docker logs --tail 100 my-container

# Since timestamp
docker logs --since 2024-01-01T00:00:00 my-container

# Until timestamp
docker logs --until 2024-01-01T12:00:00 my-container

# With timestamps
docker logs -t my-container

# Combine options
docker logs -f --tail 100 -t my-container
```

### Logging Drivers

```bash
# Use specific logging driver
docker run -d \
    --log-driver=json-file \
    nginx

# Available drivers
# json-file, syslog, journald, gelf, fluentd, awslogs, splunk, none
```

### JSON File Driver (Default)

```bash
# Configure json-file driver
docker run -d \
    --log-driver=json-file \
    --log-opt max-size=10m \
    --log-opt max-file=3 \
    nginx

# Log location
# /var/lib/docker/containers/<container-id>/<container-id>-json.log
```

### Syslog Driver

```bash
# Send logs to syslog
docker run -d \
    --log-driver=syslog \
    --log-opt syslog-address=udp://localhost:514 \
    --log-opt tag="my-app" \
    nginx
```

### Fluentd Driver

```bash
# Send logs to Fluentd
docker run -d \
    --log-driver=fluentd \
    --log-opt fluentd-address=localhost:24224 \
    --log-opt tag="docker.{{.Name}}" \
    nginx
```

### AWS CloudWatch Logs

```bash
# Send logs to CloudWatch
docker run -d \
    --log-driver=awslogs \
    --log-opt awslogs-region=us-east-1 \
    --log-opt awslogs-group=my-log-group \
    --log-opt awslogs-stream=my-container \
    nginx
```

### Disable Logging

```bash
# No logging
docker run -d --log-driver=none nginx
```

### Default Logging Configuration

```json
// /etc/docker/daemon.json
{
    "log-driver": "json-file",
    "log-opts": {
        "max-size": "10m",
        "max-file": "3",
        "labels": "production_status",
        "env": "os,customer"
    }
}
```

### Application Logging Best Practices

```dockerfile
# Log to stdout/stderr
FROM node:18-alpine
WORKDIR /app
COPY . .

# Application should log to stdout
CMD ["node", "app.js"]
```

```javascript
// app.js - Log to stdout
console.log('Info message');
console.error('Error message');

// Don't log to files inside container
```

### Log Aggregation Setup

```yaml
# docker-compose.yml with ELK stack
version: '3'
services:
  app:
    image: my-app
    logging:
      driver: fluentd
      options:
        fluentd-address: localhost:24224
        tag: app.logs

  fluentd:
    image: fluent/fluentd
    ports:
      - "24224:24224"
    volumes:
      - ./fluentd.conf:/fluentd/etc/fluent.conf
```

### Inspect Logging Config

```bash
# View container logging config
docker inspect --format='{{.HostConfig.LogConfig}}' my-container
```

### Best Practices

```
✅ Always set log rotation (max-size, max-file)
✅ Log to stdout/stderr in containers
✅ Use structured logging (JSON)
✅ Include timestamps
✅ Use log aggregation in production
✅ Don't log sensitive data
✅ Set appropriate log levels
```

