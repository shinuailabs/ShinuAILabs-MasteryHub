# Lab 738: Initial Configuration

## LEARNING CONCEPT

Configuring Jenkins after installation.

## EXERCISE

1. Complete setup wizard
2. Configure basic settings
3. Set up security

## SOLUTION

### Setup Wizard Steps

```
1. Unlock Jenkins
   - Enter initial admin password
   - Found in secrets/initialAdminPassword

2. Customize Jenkins
   - Install suggested plugins (recommended)
   - Or select plugins to install

3. Create Admin User
   - Username
   - Password
   - Full name
   - Email

4. Instance Configuration
   - Set Jenkins URL
   - Example: http://jenkins.example.com:8080/
```

### System Configuration

```
Manage Jenkins → System

Key Settings:
- System Message: Welcome message
- # of executors: Build threads on controller
- Labels: Controller labels
- Usage: How controller is used
- Quiet period: Delay before builds
- SCM checkout retry count
- Jenkins URL: Base URL
```

### Global Tool Configuration

```
Manage Jenkins → Tools

Configure:
- JDK installations
- Git installations
- Maven installations
- Gradle installations
- Node.js installations
- Docker installations
```

### JDK Configuration

```
JDK:
  Name: JDK17
  JAVA_HOME: /usr/lib/jvm/java-17-openjdk
  
  Or install automatically:
  Name: JDK17
  Install automatically: ✓
  Version: OpenJDK 17
```

### Git Configuration

```
Git:
  Name: Default
  Path to Git executable: git
  
  Or specify path:
  Path to Git executable: /usr/bin/git
```

### Node.js Configuration

```
NodeJS:
  Name: Node18
  Install automatically: ✓
  Version: NodeJS 18.x
  Global npm packages: npm@latest
```

### Maven Configuration

```
Maven:
  Name: Maven3
  Install automatically: ✓
  Version: 3.9.x
```

### Security Configuration

```
Manage Jenkins → Security

Configure:
- Security Realm: Jenkins' own user database
- Authorization: Matrix-based security
- CSRF Protection: Enable
- Agent → Controller Security: Enable
```

### Email Configuration

```
Manage Jenkins → System

E-mail Notification:
  SMTP server: smtp.example.com
  Default user e-mail suffix: @example.com
  
Extended E-mail Notification:
  SMTP server: smtp.example.com
  SMTP Port: 587
  Credentials: email-credentials
  Use SSL: ✓
```

### Environment Variables

```
Manage Jenkins → System

Global properties:
  Environment variables: ✓
  
  Name: DOCKER_HOST
  Value: unix:///var/run/docker.sock
  
  Name: PATH
  Value: /usr/local/bin:$PATH
```

### Plugin Management

```
Manage Jenkins → Plugins

Recommended Plugins:
- Git
- Pipeline
- Blue Ocean
- Docker Pipeline
- Credentials Binding
- JUnit
- HTML Publisher
```

### Backup Configuration

```bash
# Backup Jenkins home
tar -czvf jenkins-backup.tar.gz /var/lib/jenkins

# Key directories to backup:
# - config.xml
# - jobs/
# - users/
# - secrets/
# - plugins/
```

### Configuration Checklist

```
□ Complete setup wizard
□ Create admin user
□ Set Jenkins URL
□ Configure security
□ Install required plugins
□ Configure tools (JDK, Git, etc.)
□ Set up email notifications
□ Configure environment variables
□ Set up backup strategy
```

