# Lab 653: Private Registries

## LEARNING CONCEPT

Using private Docker registries for secure image storage.

### Registry Options:
- Docker Hub (private repos)
- AWS ECR
- Google Container Registry
- Azure Container Registry
- Self-hosted registry

## EXERCISE

1. Set up private registry
2. Push/pull images
3. Configure authentication

## SOLUTION

### Docker Hub Private Repository

```bash
# Login to Docker Hub
docker login

# Tag for private repo
docker tag my-app username/private-app:latest

# Push to private repo
docker push username/private-app:latest

# Pull (requires login)
docker pull username/private-app:latest
```

### AWS ECR

```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | \
    docker login --username AWS --password-stdin \
    123456789.dkr.ecr.us-east-1.amazonaws.com

# Create repository
aws ecr create-repository --repository-name my-app

# Tag image
docker tag my-app:latest \
    123456789.dkr.ecr.us-east-1.amazonaws.com/my-app:latest

# Push
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/my-app:latest

# Pull
docker pull 123456789.dkr.ecr.us-east-1.amazonaws.com/my-app:latest
```

### Google Container Registry

```bash
# Configure Docker for GCR
gcloud auth configure-docker

# Tag image
docker tag my-app gcr.io/my-project/my-app:latest

# Push
docker push gcr.io/my-project/my-app:latest

# Pull
docker pull gcr.io/my-project/my-app:latest
```

### Azure Container Registry

```bash
# Login to ACR
az acr login --name myregistry

# Tag image
docker tag my-app myregistry.azurecr.io/my-app:latest

# Push
docker push myregistry.azurecr.io/my-app:latest

# Pull
docker pull myregistry.azurecr.io/my-app:latest
```

### Self-Hosted Registry

```bash
# Run local registry
docker run -d -p 5000:5000 --name registry registry:2

# Tag for local registry
docker tag my-app localhost:5000/my-app:latest

# Push
docker push localhost:5000/my-app:latest

# Pull
docker pull localhost:5000/my-app:latest
```

### Registry with Authentication

```bash
# Create password file
mkdir -p /auth
docker run --entrypoint htpasswd \
    httpd:2 -Bbn username password > /auth/htpasswd

# Run registry with auth
docker run -d -p 5000:5000 \
    --name registry \
    -v /auth:/auth \
    -e "REGISTRY_AUTH=htpasswd" \
    -e "REGISTRY_AUTH_HTPASSWD_REALM=Registry Realm" \
    -e "REGISTRY_AUTH_HTPASSWD_PATH=/auth/htpasswd" \
    registry:2

# Login
docker login localhost:5000
```

### Registry with TLS

```bash
# Generate certificates
mkdir -p /certs
openssl req -newkey rsa:4096 -nodes -sha256 \
    -keyout /certs/domain.key -x509 -days 365 \
    -out /certs/domain.crt

# Run registry with TLS
docker run -d -p 5000:5000 \
    --name registry \
    -v /certs:/certs \
    -e REGISTRY_HTTP_TLS_CERTIFICATE=/certs/domain.crt \
    -e REGISTRY_HTTP_TLS_KEY=/certs/domain.key \
    registry:2
```

### Docker Compose Registry

```yaml
# docker-compose.yml
version: '3'
services:
  registry:
    image: registry:2
    ports:
      - "5000:5000"
    volumes:
      - registry-data:/var/lib/registry
      - ./auth:/auth
      - ./certs:/certs
    environment:
      REGISTRY_AUTH: htpasswd
      REGISTRY_AUTH_HTPASSWD_PATH: /auth/htpasswd
      REGISTRY_AUTH_HTPASSWD_REALM: Registry Realm
      REGISTRY_HTTP_TLS_CERTIFICATE: /certs/domain.crt
      REGISTRY_HTTP_TLS_KEY: /certs/domain.key

volumes:
  registry-data:
```

