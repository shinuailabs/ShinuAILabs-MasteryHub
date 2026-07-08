# Lab 737: Native Installation

## LEARNING CONCEPT

Installing Jenkins natively on various operating systems.

## EXERCISE

1. Install on Linux
2. Install on macOS
3. Install on Windows

## SOLUTION

### Prerequisites

```
- Java 11 or 17 (LTS versions)
- 256MB+ RAM (1GB+ recommended)
- 1GB+ disk space
```

### Ubuntu/Debian Installation

```bash
# Add Jenkins repository key
curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key | sudo tee \
    /usr/share/keyrings/jenkins-keyring.asc > /dev/null

# Add repository
echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \
    https://pkg.jenkins.io/debian-stable binary/ | sudo tee \
    /etc/apt/sources.list.d/jenkins.list > /dev/null

# Install Jenkins
sudo apt-get update
sudo apt-get install jenkins

# Start Jenkins
sudo systemctl start jenkins
sudo systemctl enable jenkins

# Check status
sudo systemctl status jenkins
```

### CentOS/RHEL Installation

```bash
# Add repository
sudo wget -O /etc/yum.repos.d/jenkins.repo \
    https://pkg.jenkins.io/redhat-stable/jenkins.repo

# Import key
sudo rpm --import https://pkg.jenkins.io/redhat-stable/jenkins.io-2023.key

# Install Jenkins
sudo yum install jenkins

# Start Jenkins
sudo systemctl start jenkins
sudo systemctl enable jenkins
```

### macOS Installation

```bash
# Using Homebrew
brew install jenkins-lts

# Start Jenkins
brew services start jenkins-lts

# Or run manually
jenkins-lts
```

### Windows Installation

```
1. Download installer from jenkins.io
2. Run jenkins.msi
3. Follow installation wizard
4. Choose installation directory
5. Configure service account
6. Select port (default 8080)
7. Complete installation
```

### Post-Installation

```bash
# Get initial admin password
# Linux
sudo cat /var/lib/jenkins/secrets/initialAdminPassword

# macOS
cat ~/.jenkins/secrets/initialAdminPassword

# Windows
type C:\ProgramData\Jenkins\.jenkins\secrets\initialAdminPassword
```

### Configure Java

```bash
# Check Java version
java -version

# Set JAVA_HOME (Linux)
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk
echo "JAVA_HOME=/usr/lib/jvm/java-17-openjdk" >> /etc/environment

# Configure Jenkins Java (Linux)
sudo vim /etc/default/jenkins
# Add: JAVA=/usr/lib/jvm/java-17-openjdk/bin/java
```

### Service Management

```bash
# Linux (systemd)
sudo systemctl start jenkins
sudo systemctl stop jenkins
sudo systemctl restart jenkins
sudo systemctl status jenkins

# macOS (Homebrew)
brew services start jenkins-lts
brew services stop jenkins-lts
brew services restart jenkins-lts

# Windows
net start jenkins
net stop jenkins
```

### Configuration Files

```
Linux:
- Config: /etc/default/jenkins
- Home: /var/lib/jenkins
- Logs: /var/log/jenkins

macOS:
- Home: ~/.jenkins
- Logs: ~/Library/Logs/jenkins

Windows:
- Home: C:\ProgramData\Jenkins\.jenkins
- Logs: C:\ProgramData\Jenkins\.jenkins\logs
```

### Firewall Configuration

```bash
# Ubuntu/Debian
sudo ufw allow 8080

# CentOS/RHEL
sudo firewall-cmd --permanent --add-port=8080/tcp
sudo firewall-cmd --reload
```

### Verify Installation

```bash
# Check if Jenkins is running
curl -I http://localhost:8080

# Check service status
sudo systemctl status jenkins
```

