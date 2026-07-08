# Lab 639: Docker Installation

## LEARNING CONCEPT

Installing Docker on different operating systems.

### Installation Options:
- Docker Desktop (Windows/Mac)
- Docker Engine (Linux)
- Docker in WSL2 (Windows)

## EXERCISE

1. Install Docker for your OS
2. Configure Docker
3. Verify installation

## SOLUTION

### macOS Installation

```bash
# Using Homebrew
brew install --cask docker

# Or download Docker Desktop from:
# https://www.docker.com/products/docker-desktop

# Start Docker Desktop from Applications

# Verify installation
docker --version
docker run hello-world
```

### Windows Installation

```powershell
# Prerequisites:
# - Windows 10/11 Pro, Enterprise, or Education
# - WSL2 enabled

# Enable WSL2
wsl --install

# Download Docker Desktop from:
# https://www.docker.com/products/docker-desktop

# Install and restart

# Verify in PowerShell
docker --version
docker run hello-world
```

### Linux (Ubuntu) Installation

```bash
# Update package index
sudo apt-get update

# Install prerequisites
sudo apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# Add Docker's official GPG key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
    sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Set up repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io

# Add user to docker group (avoid sudo)
sudo usermod -aG docker $USER
newgrp docker

# Verify installation
docker --version
docker run hello-world
```

### Post-Installation Configuration

```bash
# Configure Docker to start on boot (Linux)
sudo systemctl enable docker

# Configure Docker daemon
# Create/edit /etc/docker/daemon.json
{
  "storage-driver": "overlay2",
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}

# Restart Docker
sudo systemctl restart docker
```

### Verify Installation

```bash
# Check version
docker --version
docker compose version

# Run test container
docker run hello-world

# Check system info
docker info

# Run interactive container
docker run -it ubuntu bash
```

