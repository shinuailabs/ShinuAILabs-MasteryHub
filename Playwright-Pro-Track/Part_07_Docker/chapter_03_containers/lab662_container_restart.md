# Lab 662: Container Restart Policies

## LEARNING CONCEPT

Configuring automatic container restart behavior.

### Restart Policies:
- no (default)
- always
- unless-stopped
- on-failure

## EXERCISE

1. Configure restart policies
2. Test restart behavior
3. Choose appropriate policy

## SOLUTION

### Restart Policy Options

```bash
# No restart (default)
docker run -d --restart=no nginx

# Always restart
docker run -d --restart=always nginx

# Restart unless manually stopped
docker run -d --restart=unless-stopped nginx

# Restart on failure (with max retries)
docker run -d --restart=on-failure:5 nginx
```

### Policy Comparison

```
Policy          Behavior
--------------------------------------------------------------
no              Never restart automatically
always          Always restart, even after daemon restart
unless-stopped  Restart unless manually stopped
on-failure      Restart only on non-zero exit code
on-failure:N    Restart on failure, max N attempts
```

### Always vs Unless-Stopped

```bash
# always: Restarts even after Docker daemon restart
docker run -d --restart=always --name always-container nginx

# unless-stopped: Won't restart after daemon restart if stopped
docker run -d --restart=unless-stopped --name unless-container nginx

# Stop containers
docker stop always-container unless-container

# Restart Docker daemon
sudo systemctl restart docker

# Check status
docker ps -a
# always-container: Running (restarted)
# unless-container: Exited (stayed stopped)
```

### On-Failure Policy

```bash
# Restart on failure, max 5 attempts
docker run -d --restart=on-failure:5 my-app

# Check restart count
docker inspect --format='{{.RestartCount}}' my-container

# View restart history
docker inspect --format='{{.State.StartedAt}}' my-container
```

### Update Restart Policy

```bash
# Update running container
docker update --restart=always my-container

# Update multiple containers
docker update --restart=unless-stopped container1 container2
```

### Inspect Restart Policy

```bash
# View restart policy
docker inspect --format='{{.HostConfig.RestartPolicy}}' my-container

# View restart count
docker inspect --format='{{.RestartCount}}' my-container
```

### Production Configuration

```bash
# Recommended production setup
docker run -d \
    --name my-app \
    --restart=unless-stopped \
    --memory=1g \
    --cpus=2 \
    --health-cmd="curl -f http://localhost:3000/health || exit 1" \
    --health-interval=30s \
    my-app:latest
```

### Docker Compose Restart

```yaml
version: '3'
services:
  web:
    image: nginx
    restart: unless-stopped
    
  app:
    image: my-app
    restart: on-failure:5
    
  db:
    image: postgres
    restart: always
```

### Handling Restart Loops

```bash
# Check if container is in restart loop
docker inspect --format='{{.RestartCount}}' my-container

# View logs to diagnose
docker logs my-container

# Stop restart loop
docker update --restart=no my-container
docker stop my-container
```

### Exit Codes

```
Exit Code   Meaning
---------------------------------
0           Success (no restart with on-failure)
1           Application error
137         SIGKILL (docker kill or OOM)
143         SIGTERM (docker stop)
```

### Best Practices

```
✅ Use unless-stopped for most services
✅ Use on-failure for batch jobs
✅ Set max retries to prevent infinite loops
✅ Combine with health checks
✅ Monitor restart counts
✅ Investigate frequent restarts
✅ Use always for critical services
```

### Choosing Restart Policy

```
Use Case                    Recommended Policy
------------------------------------------------
Web servers                 unless-stopped
Databases                   always
Background workers          unless-stopped
One-time jobs               no
Batch processing            on-failure:3
Development                 no
```

