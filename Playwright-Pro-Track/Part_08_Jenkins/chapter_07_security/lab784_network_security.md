# Lab 784: Network Security

## LEARNING CONCEPT

Securing Jenkins network configuration.

## EXERCISE

1. Configure HTTPS
2. Set up reverse proxy
3. Implement network isolation

## SOLUTION

### Enable HTTPS

```bash
# Generate self-signed certificate
keytool -genkey -keyalg RSA -alias jenkins \
    -keystore jenkins.jks -storepass changeit \
    -keysize 2048 -validity 365

# Start Jenkins with HTTPS
java -jar jenkins.war \
    --httpsPort=8443 \
    --httpsKeyStore=/path/to/jenkins.jks \
    --httpsKeyStorePassword=changeit \
    --httpPort=-1
```

### Let's Encrypt Certificate

```bash
# Install certbot
apt-get install certbot

# Get certificate
certbot certonly --standalone -d jenkins.example.com

# Convert to PKCS12
openssl pkcs12 -export \
    -in /etc/letsencrypt/live/jenkins.example.com/fullchain.pem \
    -inkey /etc/letsencrypt/live/jenkins.example.com/privkey.pem \
    -out jenkins.p12 \
    -name jenkins \
    -password pass:changeit

# Convert to JKS
keytool -importkeystore \
    -srckeystore jenkins.p12 \
    -srcstoretype PKCS12 \
    -srcstorepass changeit \
    -destkeystore jenkins.jks \
    -deststorepass changeit
```

### Nginx Reverse Proxy

```nginx
# /etc/nginx/sites-available/jenkins
upstream jenkins {
    server 127.0.0.1:8080 fail_timeout=0;
    keepalive 32;
}

server {
    listen 80;
    server_name jenkins.example.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name jenkins.example.com;
    
    ssl_certificate /etc/letsencrypt/live/jenkins.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/jenkins.example.com/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers off;
    
    location / {
        proxy_pass http://jenkins;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        proxy_connect_timeout 150;
        proxy_send_timeout 100;
        proxy_read_timeout 100;
        
        proxy_http_version 1.1;
        proxy_request_buffering off;
    }
}
```

### Configure Jenkins for Proxy

```
Manage Jenkins → System → Jenkins Location

Jenkins URL: https://jenkins.example.com/

Or via startup:
java -jar jenkins.war \
    --prefix=/jenkins \
    -Djenkins.model.Jenkins.crumbIssuerProxyCompatibility=true
```

### Firewall Configuration

```bash
# UFW (Ubuntu)
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 443/tcp
ufw enable

# iptables
iptables -A INPUT -p tcp --dport 443 -j ACCEPT
iptables -A INPUT -p tcp --dport 8080 -j DROP  # Block direct access
```

### Network Isolation

```yaml
# docker-compose.yml with network isolation
version: '3.8'

services:
  jenkins:
    image: jenkins/jenkins:lts
    networks:
      - frontend
      - backend
    
  nginx:
    image: nginx
    ports:
      - "443:443"
    networks:
      - frontend
    
  agents:
    image: jenkins/inbound-agent
    networks:
      - backend

networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge
    internal: true  # No external access
```

### Agent Security

```
Agent → Configure → Launch method

Security options:
- Use SSH for agent connection
- Use JNLP with TLS
- Restrict agent protocols

Manage Jenkins → Security → Agent → TCP port for inbound agents
- Fixed: 50000
- Or: Random
- Disable if not needed
```

### CSRF Protection

```
Manage Jenkins → Security

CSRF Protection:
✓ Prevent Cross Site Request Forgery exploits

Crumb Issuer:
- Default Crumb Issuer
- Proxy compatibility mode (if behind proxy)
```

### Security Headers

```nginx
# Add security headers in Nginx
add_header X-Content-Type-Options nosniff;
add_header X-Frame-Options DENY;
add_header X-XSS-Protection "1; mode=block";
add_header Content-Security-Policy "default-src 'self'";
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
```

### IP Whitelisting

```nginx
# Nginx IP whitelist
location / {
    allow 10.0.0.0/8;
    allow 192.168.1.0/24;
    deny all;
    
    proxy_pass http://jenkins;
}
```

### VPN Access

```
Recommended setup:
1. Jenkins behind VPN
2. No public internet access
3. VPN for remote access
4. Separate network for agents
```

### Best Practices

```
✅ Always use HTTPS
✅ Use reverse proxy
✅ Configure firewall
✅ Enable CSRF protection
✅ Isolate networks
✅ Secure agent connections
✅ Regular security audits
```

