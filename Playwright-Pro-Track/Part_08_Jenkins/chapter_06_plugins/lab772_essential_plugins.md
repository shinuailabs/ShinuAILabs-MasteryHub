# Lab 772: Essential Plugins

## LEARNING CONCEPT

Understanding essential Jenkins plugins for CI/CD.

## EXERCISE

1. Identify essential plugins
2. Install and configure
3. Use in pipelines

## SOLUTION

### Pipeline Plugins

```
workflow-aggregator (Pipeline)
- Core pipeline functionality
- Declarative and scripted pipelines

pipeline-stage-view
- Visual stage view
- Build history

blueocean
- Modern UI
- Pipeline editor
- Visual pipeline execution
```

### Source Control Plugins

```
git
- Git integration
- Branch discovery
- Webhook support

github
- GitHub integration
- PR status updates
- Webhook handling

gitlab-plugin
- GitLab integration
- Merge request support

bitbucket
- Bitbucket integration
```

### Credentials Plugins

```
credentials
- Credential storage
- Multiple credential types

credentials-binding
- Use credentials in builds
- Environment variable binding

ssh-credentials
- SSH key management
```

### Docker Plugins

```
docker-plugin
- Docker cloud agents
- Container management

docker-workflow
- Docker in pipelines
- docker.build(), docker.image()

docker-compose-build-step
- Docker Compose support
```

### Testing Plugins

```
junit
- JUnit test results
- Test trends

htmlpublisher
- HTML report publishing
- Coverage reports

allure-jenkins-plugin
- Allure reports
- Test analytics
```

### Notification Plugins

```
email-ext
- Extended email notifications
- Customizable templates

slack
- Slack notifications
- Channel integration

office-365-connector
- Microsoft Teams notifications
```

### Install via UI

```
Manage Jenkins → Plugins → Available plugins

1. Search for plugin
2. Check checkbox
3. Click "Install"
4. Restart if required
```

### Install via CLI

```bash
java -jar jenkins-cli.jar -s http://jenkins:8080/ \
    -auth admin:token \
    install-plugin git workflow-aggregator docker-workflow

# Restart Jenkins
java -jar jenkins-cli.jar -s http://jenkins:8080/ \
    -auth admin:token \
    safe-restart
```

### Install via Docker

```dockerfile
FROM jenkins/jenkins:lts

RUN jenkins-plugin-cli --plugins \
    git \
    workflow-aggregator \
    docker-workflow \
    blueocean \
    credentials-binding \
    junit \
    htmlpublisher \
    slack
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
slack:latest
email-ext:latest
```

```dockerfile
FROM jenkins/jenkins:lts

COPY plugins.txt /usr/share/jenkins/ref/plugins.txt
RUN jenkins-plugin-cli --plugin-file /usr/share/jenkins/ref/plugins.txt
```

### Recommended Plugin Sets

```
Minimal CI:
- git
- workflow-aggregator
- credentials-binding
- junit

Full CI/CD:
- git, github
- workflow-aggregator, blueocean
- docker-workflow
- credentials-binding
- junit, htmlpublisher
- slack, email-ext

Test Automation:
- git
- workflow-aggregator
- docker-workflow
- junit
- htmlpublisher
- allure-jenkins-plugin
```

### Plugin Dependencies

```
Plugins may have dependencies:
- Required dependencies auto-install
- Check compatibility matrix
- Update dependencies together
```

### Best Practices

```
✅ Install only needed plugins
✅ Keep plugins updated
✅ Review security advisories
✅ Test updates in staging
✅ Document installed plugins
✅ Use plugin manager CLI
```

