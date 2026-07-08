# Lab 688: Network Security

## LEARNING CONCEPT

Securing Docker network communications.

## EXERCISE

1. Implement network isolation
2. Configure encryption
3. Apply security best practices

## SOLUTION

### Network Isolation

```bash
# Create isolated networks
docker network create --internal backend

# Backend containers have no external access
docker run -d --name db --network backend postgres:15

# db cannot reach internet
docker exec db ping google.com  # Fails
```

### Encrypted Overlay Networks

```bash
# Create encrypted overlay
docker network create \
    --driver overlay \
    --opt encrypted \
    secure-overlay

# All traffic encrypted with IPsec
```

### Port Binding Security

```bash
# ❌ Binds to all interfaces
docker run -d -p 8080:80 nginx

# ✅ Binds to localhost only
docker run -d -p 127.0.0.1:8080:80 nginx

# ✅ Use reverse proxy for external access
```

### Firewall Configuration

```bash
# Docker manages iptables
# Add custom rules to DOCKER-USER chain

# Block specific traffic
sudo iptables -I DOCKER-USER -s 172.17.0.2 -d 172.17.0.3 -j DROP

# Allow only specific ports
sudo iptables -I DOCKER-USER -p tcp --dport 80 -j ACCEPT
sudo iptables -A DOCKER-USER -j DROP
```

### TLS for Services

```yaml
version: '3'
services:
  nginx:
    image: nginx
    volumes:
      - ./certs:/etc/nginx/certs:ro
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    ports:
      - "443:443"
```

```nginx
# nginx.conf
server {
    listen 443 ssl;
    ssl_certificate /etc/nginx/certs/server.crt;
    ssl_certificate_key /etc/nginx/certs/server.key;
    ssl_protocols TLSv1.2 TLSv1.3;
}
```

### Network Policies (Kubernetes-style)

```yaml
# Docker Compose network segmentation
version: '3'
services:
  frontend:
    image: nginx
    networks:
      - frontend-net
    ports:
      - "80:80"

  api:
    image: my-api
    networks:
      - frontend-net
      - backend-net

  database:
    image: postgres
    networks:
      - backend-net

networks:
  frontend-net:
  backend-net:
    internal: true
```

### Secrets Management

```bash
# Create secret
echo "my-password" | docker secret create db_password -

# Use in service
docker service create \
    --name db \
    --secret db_password \
    postgres:15
```

### Security Scanning

```bash
# Scan for network vulnerabilities
docker run --rm \
    --network host \
    instrumentisto/nmap \
    -sV localhost

# Check open ports
docker run --rm \
    --network container:target \
    nicolaka/netshoot \
    netstat -tlnp
```

### Secure Docker Compose

```yaml
version: '3.8'
services:
  web:
    image: nginx
    networks:
      - frontend
    ports:
      - "127.0.0.1:8080:80"
    read_only: true
    security_opt:
      - no-new-privileges:true

  api:
    image: my-api
    networks:
      - frontend
      - backend
    read_only: true

  db:
    image: postgres
    networks:
      - backend
    # No ports exposed externally

networks:
  frontend:
  backend:
    internal: true
```

### Security Checklist

```
□ Use internal networks for backend
□ Bind ports to localhost when possible
□ Use encrypted overlay networks
□ Implement network segmentation
□ Use TLS for service communication
□ Manage secrets properly
□ Regular security scanning
□ Monitor network traffic
□ Document network architecture
```

### Best Practices

```
✅ Principle of least privilege
✅ Network segmentation
✅ Encrypt sensitive traffic
✅ Don't expose unnecessary ports
✅ Use internal networks
✅ Regular security audits
✅ Monitor for anomalies
```

