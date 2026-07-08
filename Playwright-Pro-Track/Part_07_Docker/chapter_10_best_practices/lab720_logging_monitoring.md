# Lab 720: Logging and Monitoring

## LEARNING CONCEPT

Implementing logging and monitoring for Docker containers.

## EXERCISE

1. Configure container logging
2. Set up monitoring
3. Implement health checks

## SOLUTION

### Logging Drivers

```bash
# JSON file (default)
docker run --log-driver json-file myapp

# Syslog
docker run --log-driver syslog myapp

# Fluentd
docker run --log-driver fluentd myapp

# AWS CloudWatch
docker run --log-driver awslogs \
    --log-opt awslogs-region=us-east-1 \
    --log-opt awslogs-group=myapp \
    myapp
```

### Log Options

```bash
docker run \
    --log-driver json-file \
    --log-opt max-size=10m \
    --log-opt max-file=3 \
    myapp
```

```yaml
# Docker Compose
services:
  app:
    image: myapp
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"
```

### View Logs

```bash
# View logs
docker logs mycontainer

# Follow logs
docker logs -f mycontainer

# Last N lines
docker logs --tail 100 mycontainer

# With timestamps
docker logs -t mycontainer

# Since time
docker logs --since 1h mycontainer
```

### Application Logging

```javascript
// Log to stdout/stderr
console.log('Info message');
console.error('Error message');

// Structured logging
console.log(JSON.stringify({
  level: 'info',
  message: 'Request received',
  timestamp: new Date().toISOString(),
  requestId: '123'
}));
```

### Health Checks

```dockerfile
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1
```

```yaml
services:
  app:
    image: myapp
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

### Monitoring with Prometheus

```yaml
version: '3.8'
services:
  app:
    image: myapp
    ports:
      - "3000:3000"

  prometheus:
    image: prom/prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"

  grafana:
    image: grafana/grafana
    ports:
      - "3001:3000"
    volumes:
      - grafana-data:/var/lib/grafana

volumes:
  grafana-data:
```

### Prometheus Config

```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'app'
    static_configs:
      - targets: ['app:3000']
```

### Container Metrics

```bash
# View resource usage
docker stats

# Specific container
docker stats mycontainer

# Format output
docker stats --format "{{.Name}}: {{.CPUPerc}} {{.MemUsage}}"
```

### cAdvisor

```yaml
services:
  cadvisor:
    image: gcr.io/cadvisor/cadvisor
    volumes:
      - /:/rootfs:ro
      - /var/run:/var/run:ro
      - /sys:/sys:ro
      - /var/lib/docker/:/var/lib/docker:ro
    ports:
      - "8080:8080"
```

### ELK Stack

```yaml
version: '3.8'
services:
  app:
    image: myapp
    logging:
      driver: fluentd
      options:
        fluentd-address: localhost:24224

  fluentd:
    image: fluent/fluentd
    volumes:
      - ./fluent.conf:/fluentd/etc/fluent.conf
    ports:
      - "24224:24224"

  elasticsearch:
    image: elasticsearch:8.11.0
    environment:
      - discovery.type=single-node

  kibana:
    image: kibana:8.11.0
    ports:
      - "5601:5601"
```

### Alerting

```yaml
# alertmanager.yml
route:
  receiver: 'slack'

receivers:
  - name: 'slack'
    slack_configs:
      - api_url: 'https://hooks.slack.com/services/...'
        channel: '#alerts'
```

### Best Practices

```
✅ Use structured logging
✅ Log to stdout/stderr
✅ Set log rotation
✅ Implement health checks
✅ Monitor resource usage
✅ Set up alerting
✅ Use centralized logging
```

