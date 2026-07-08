# Lab 721: Resource Management

## LEARNING CONCEPT

Managing container resources effectively.

## EXERCISE

1. Set resource limits
2. Configure reservations
3. Monitor resource usage

## SOLUTION

### Memory Limits

```bash
# Set memory limit
docker run --memory=512m myapp

# Set memory and swap
docker run --memory=512m --memory-swap=1g myapp

# Disable swap
docker run --memory=512m --memory-swap=512m myapp

# Memory reservation (soft limit)
docker run --memory=512m --memory-reservation=256m myapp
```

### CPU Limits

```bash
# Limit CPU cores
docker run --cpus=2 myapp

# CPU shares (relative weight)
docker run --cpu-shares=512 myapp

# Pin to specific CPUs
docker run --cpuset-cpus="0,1" myapp

# CPU period and quota
docker run --cpu-period=100000 --cpu-quota=50000 myapp
```

### Docker Compose Resources

```yaml
version: '3.8'
services:
  app:
    image: myapp
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 256M
```

### I/O Limits

```bash
# Block I/O weight
docker run --blkio-weight=500 myapp

# Device read limit
docker run --device-read-bps=/dev/sda:10mb myapp

# Device write limit
docker run --device-write-bps=/dev/sda:10mb myapp

# IOPS limits
docker run --device-read-iops=/dev/sda:1000 myapp
```

### Process Limits

```bash
# Limit number of processes
docker run --pids-limit=100 myapp
```

### Network Bandwidth

```bash
# Using tc (traffic control) in container
docker run --cap-add=NET_ADMIN myapp

# Inside container
tc qdisc add dev eth0 root tbf rate 1mbit burst 32kbit latency 400ms
```

### Monitor Resources

```bash
# Real-time stats
docker stats

# Specific container
docker stats mycontainer

# Format output
docker stats --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"

# No stream (single snapshot)
docker stats --no-stream
```

### Resource Events

```bash
# Monitor OOM events
docker events --filter event=oom

# All container events
docker events --filter type=container
```

### Swarm Resource Management

```yaml
version: '3.8'
services:
  app:
    image: myapp
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 128M
      placement:
        constraints:
          - node.role == worker
```

### Resource Quotas

```bash
# Check system resources
docker system df

# Detailed disk usage
docker system df -v

# Prune unused resources
docker system prune

# Prune with volumes
docker system prune --volumes
```

### OOM Handling

```bash
# Disable OOM killer
docker run --oom-kill-disable myapp

# Set OOM score adjustment
docker run --oom-score-adj=-500 myapp
```

### Best Practices

```yaml
services:
  app:
    image: myapp
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 256M
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
    logging:
      options:
        max-size: "10m"
        max-file: "3"
```

### Checklist

```
Memory:
□ Set memory limits
□ Configure swap appropriately
□ Monitor for OOM events

CPU:
□ Set CPU limits
□ Use reservations for guaranteed resources
□ Consider CPU pinning for performance

I/O:
□ Set I/O limits if needed
□ Monitor disk usage

Monitoring:
□ Use docker stats
□ Set up alerting
□ Regular cleanup
```

