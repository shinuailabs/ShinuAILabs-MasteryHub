# Lab 682: Port Mapping

## LEARNING CONCEPT

Exposing container ports to the host.

## EXERCISE

1. Map container ports
2. Configure port options
3. Understand port binding

## SOLUTION

### Basic Port Mapping

```bash
# Map host port to container port
docker run -d -p 8080:80 nginx

# Access at http://localhost:8080
```

### Port Mapping Options

```bash
# Map to specific interface
docker run -d -p 127.0.0.1:8080:80 nginx

# Map to all interfaces
docker run -d -p 0.0.0.0:8080:80 nginx

# Random host port
docker run -d -p 80 nginx
docker run -d -P nginx  # All exposed ports

# Multiple ports
docker run -d -p 8080:80 -p 8443:443 nginx

# Port range
docker run -d -p 8080-8090:80-90 my-app

# UDP port
docker run -d -p 53:53/udp dns-server

# Both TCP and UDP
docker run -d -p 53:53/tcp -p 53:53/udp dns-server
```

### View Port Mappings

```bash
# List port mappings
docker port my-container

# Specific port
docker port my-container 80

# In docker ps
docker ps --format "{{.Names}}: {{.Ports}}"
```

### EXPOSE vs -p

```dockerfile
# EXPOSE documents the port (doesn't publish)
EXPOSE 3000

# -p actually publishes the port
docker run -p 3000:3000 my-app

# -P publishes all EXPOSE ports to random ports
docker run -P my-app
```

### Port Binding Security

```bash
# ❌ Binds to all interfaces (accessible externally)
docker run -d -p 8080:80 nginx

# ✅ Binds to localhost only
docker run -d -p 127.0.0.1:8080:80 nginx

# ✅ Use reverse proxy for external access
```

### Docker Compose Ports

```yaml
version: '3'
services:
  web:
    image: nginx
    ports:
      - "8080:80"
      - "127.0.0.1:8443:443"
      
  app:
    image: my-app
    ports:
      - "3000"  # Random host port
      
  dns:
    image: dns-server
    ports:
      - "53:53/udp"
      - "53:53/tcp"
```

### Port Conflicts

```bash
# Check if port is in use
lsof -i :8080
netstat -tlnp | grep 8080

# Error: port already allocated
# Solution: Use different port or stop conflicting service
```

### Dynamic Port Discovery

```bash
# Get assigned port
docker port my-container 80

# In scripts
PORT=$(docker port my-container 80 | cut -d: -f2)
echo "Application running on port $PORT"
```

### Best Practices

```
✅ Bind to localhost for local services
✅ Use reverse proxy for production
✅ Document exposed ports
✅ Avoid port conflicts
✅ Use consistent port mappings
✅ Don't expose unnecessary ports
```

