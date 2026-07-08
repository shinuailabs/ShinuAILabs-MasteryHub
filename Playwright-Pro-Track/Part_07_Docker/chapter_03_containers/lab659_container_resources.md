# Lab 659: Container Resource Management

## LEARNING CONCEPT

Limiting and managing container resources.

### Resource Types:
- CPU
- Memory
- I/O
- PIDs

## EXERCISE

1. Set resource limits
2. Monitor resource usage
3. Optimize allocation

## SOLUTION

### Memory Limits

```bash
# Set memory limit
docker run -d --memory=512m nginx

# Memory with swap
docker run -d --memory=512m --memory-swap=1g nginx

# Disable swap
docker run -d --memory=512m --memory-swap=512m nginx

# Memory reservation (soft limit)
docker run -d --memory=1g --memory-reservation=512m nginx
```

### CPU Limits

```bash
# Limit CPU cores
docker run -d --cpus=1.5 nginx

# CPU shares (relative weight)
docker run -d --cpu-shares=512 nginx  # Default is 1024

# Pin to specific CPUs
docker run -d --cpuset-cpus="0,1" nginx

# CPU period and quota
docker run -d --cpu-period=100000 --cpu-quota=50000 nginx
```

### Combined Resource Limits

```bash
# Production container with limits
docker run -d \
    --name my-app \
    --memory=1g \
    --memory-swap=1g \
    --cpus=2 \
    --restart=unless-stopped \
    my-app:latest
```

### Monitor Resource Usage

```bash
# Real-time stats
docker stats

# Stats for specific container
docker stats my-container

# One-time stats
docker stats --no-stream

# Format output
docker stats --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"
```

### PID Limits

```bash
# Limit number of processes
docker run -d --pids-limit=100 nginx

# Prevent fork bombs
```

### I/O Limits

```bash
# Block I/O weight
docker run -d --blkio-weight=500 nginx

# Device read limit
docker run -d \
    --device-read-bps=/dev/sda:1mb \
    nginx

# Device write limit
docker run -d \
    --device-write-bps=/dev/sda:1mb \
    nginx

# IOPS limits
docker run -d \
    --device-read-iops=/dev/sda:1000 \
    --device-write-iops=/dev/sda:1000 \
    nginx
```

### Out of Memory (OOM)

```bash
# Disable OOM killer
docker run -d --oom-kill-disable nginx

# Set OOM score adjustment
docker run -d --oom-score-adj=-500 nginx

# Check if container was OOM killed
docker inspect --format='{{.State.OOMKilled}}' my-container
```

### Resource Inspection

```bash
# View container resource config
docker inspect --format='{{.HostConfig.Memory}}' my-container
docker inspect --format='{{.HostConfig.NanoCpus}}' my-container

# View all resource limits
docker inspect my-container | jq '.[0].HostConfig | {Memory, NanoCpus, CpuShares}'
```

### Update Running Container

```bash
# Update memory limit
docker update --memory=1g my-container

# Update CPU limit
docker update --cpus=2 my-container

# Update multiple settings
docker update \
    --memory=1g \
    --cpus=2 \
    --restart=always \
    my-container
```

### Resource Recommendations

```
Application Type    Memory    CPU
---------------------------------
Web Server          256MB     0.5
API Service         512MB     1.0
Database            1GB       2.0
Worker Process      256MB     0.5
Cache               512MB     0.5
```

### Best Practices

```
✅ Always set memory limits
✅ Set CPU limits for predictability
✅ Monitor resource usage
✅ Use memory reservation for flexibility
✅ Disable swap for consistent performance
✅ Set restart policies
✅ Use health checks
```

