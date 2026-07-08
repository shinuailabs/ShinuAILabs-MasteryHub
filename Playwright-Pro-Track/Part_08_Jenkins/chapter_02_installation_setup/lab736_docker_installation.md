# Lab 736: Docker Installation

## LEARNING CONCEPT

Installing Jenkins using Docker for quick setup.

## EXERCISE

1. Run Jenkins in Docker
2. Configure persistence
3. Access Jenkins UI

## SOLUTION

### Quick Start

```bash
# Run Jenkins with Docker
docker run -d \
    --name jenkins \
    -p 8080:8080 \
    -p 50000:50000 \
    -v jenkins_home:/var/jenkins_home \
    jenkins/jenkins:lts
```

### Get Initial Password

```bash
# View initial admin password
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword

# Or view logs
docker logs jenkins
```

### Docker Compose Setup

```yaml
# docker-compose.yml
version: '3.8'
services:
  jenkins:
    image: jenkins/jenkins:lts
    container_name: jenkins
    restart: unless-stopped
    ports:
      - "8080:8080"
      - "50000:50000"
    volumes:
      - jenkins_home:/var/jenkins_home
      - /var/run/docker.sock:/var/run/docker.sock
    environment:
      - JAVA_OPTS=-Djenkins.install.runSetupWizard=false

volumes:
  jenkins_home:
```

### Jenkins with Docker-in-Docker

```yaml
version: '3.8'
services:
  jenkins:
    image: jenkins/jenkins:lts
    container_name: jenkins
    user: root
    ports:
      - "8080:8080"
      - "50000:50000"
    volumes:
      - jenkins_home:/var/jenkins_home
      - /var/run/docker.sock:/var/run/docker.sock
    environment:
      - DOCKER_HOST=unix:///var/run/docker.sock

volumes:
  jenkins_home:
```

### Custom Dockerfile

```dockerfile
FROM jenkins/jenkins:lts

USER root

# Install Docker CLI
RUN apt-get update && \
    apt-get install -y docker.io && \
    rm -rf /var/lib/apt/lists/*

# Add jenkins user to docker group
RUN usermod -aG docker jenkins

USER jenkins

# Install plugins
COPY plugins.txt /usr/share/jenkins/ref/plugins.txt
RUN jenkins-plugin-cli --plugin-file /usr/share/jenkins/ref/plugins.txt
```

### plugins.txt

```
git
workflow-aggregator
docker-workflow
blueocean
credentials
credentials-binding
```

### Build and Run Custom Image

```bash
# Build custom image
docker build -t my-jenkins .

# Run custom image
docker run -d \
    --name jenkins \
    -p 8080:8080 \
    -p 50000:50000 \
    -v jenkins_home:/var/jenkins_home \
    -v /var/run/docker.sock:/var/run/docker.sock \
    my-jenkins
```

### Access Jenkins

```
1. Open browser: http://localhost:8080
2. Enter initial admin password
3. Install suggested plugins
4. Create admin user
5. Configure Jenkins URL
```

### Useful Commands

```bash
# Start Jenkins
docker start jenkins

# Stop Jenkins
docker stop jenkins

# View logs
docker logs -f jenkins

# Execute shell
docker exec -it jenkins bash

# Backup
docker cp jenkins:/var/jenkins_home ./backup
```

### Best Practices

```
✅ Use named volumes for persistence
✅ Use LTS image for stability
✅ Mount Docker socket for Docker builds
✅ Pre-install required plugins
✅ Configure proper memory limits
✅ Set up regular backups
```

