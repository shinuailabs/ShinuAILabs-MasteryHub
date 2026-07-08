# Lab 739: Plugin Management

## LEARNING CONCEPT

Managing Jenkins plugins effectively.

## EXERCISE

1. Install plugins
2. Update plugins
3. Manage dependencies

## SOLUTION

### Install Plugins via UI

```
Manage Jenkins → Plugins → Available plugins

1. Search for plugin
2. Check checkbox
3. Click "Install"
4. Restart if required
```

### Essential Plugins

```
Pipeline & Build:
- Pipeline (workflow-aggregator)
- Pipeline: Stage View
- Blue Ocean
- Build Timeout

Source Control:
- Git
- GitHub
- GitLab
- Bitbucket

Credentials:
- Credentials
- Credentials Binding
- SSH Credentials

Docker:
- Docker
- Docker Pipeline
- Docker Compose Build Step

Testing:
- JUnit
- HTML Publisher
- Allure

Notifications:
- Email Extension
- Slack Notification
- Microsoft Teams
```

### Install via CLI

```bash
# Using jenkins-cli.jar
java -jar jenkins-cli.jar -s http://localhost:8080/ \
    install-plugin git pipeline-stage-view blue-ocean

# Restart Jenkins
java -jar jenkins-cli.jar -s http://localhost:8080/ safe-restart
```

### Install via Docker

```dockerfile
FROM jenkins/jenkins:lts

# Install plugins
RUN jenkins-plugin-cli --plugins \
    git \
    workflow-aggregator \
    docker-workflow \
    blueocean \
    credentials-binding
```

### plugins.txt Method

```
# plugins.txt
git:latest
workflow-aggregator:latest
docker-workflow:latest
blueocean:latest
credentials-binding:latest
junit:latest
htmlpublisher:latest
```

```dockerfile
FROM jenkins/jenkins:lts

COPY plugins.txt /usr/share/jenkins/ref/plugins.txt
RUN jenkins-plugin-cli --plugin-file /usr/share/jenkins/ref/plugins.txt
```

### Update Plugins

```
Manage Jenkins → Plugins → Updates

1. Select plugins to update
2. Click "Download now and install after restart"
3. Check "Restart Jenkins when installation is complete"
```

### Plugin Dependencies

```
Plugins may have dependencies:
- Required dependencies auto-install
- Optional dependencies may need manual install
- Check compatibility before updating
```

### Disable/Uninstall Plugins

```
Manage Jenkins → Plugins → Installed plugins

Disable:
1. Find plugin
2. Click disable toggle
3. Restart Jenkins

Uninstall:
1. Find plugin
2. Click uninstall
3. Restart Jenkins
```

### Plugin Security

```
Best Practices:
✅ Only install trusted plugins
✅ Keep plugins updated
✅ Review security advisories
✅ Remove unused plugins
✅ Check plugin ratings
```

### Troubleshooting

```bash
# Check plugin status
Manage Jenkins → System Information → Plugins

# Plugin logs
/var/lib/jenkins/logs/

# Failed plugins
Manage Jenkins → Plugins → Installed
# Look for "Failed to load" messages

# Safe mode (disable all plugins)
# Add to JAVA_OPTS: -Djenkins.install.runSetupWizard=true
```

### Backup Plugins

```bash
# Backup plugins directory
cp -r /var/lib/jenkins/plugins ./plugins-backup

# List installed plugins
ls /var/lib/jenkins/plugins/*.jpi
```

### Plugin Configuration as Code

```yaml
# jenkins.yaml (JCasC)
jenkins:
  systemMessage: "Jenkins configured by JCasC"

unclassified:
  location:
    url: http://jenkins.example.com/
```

### Plugin Checklist

```
□ Install essential plugins
□ Configure plugin settings
□ Set up update schedule
□ Review security advisories
□ Remove unused plugins
□ Document installed plugins
```

