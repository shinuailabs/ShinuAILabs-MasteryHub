# Lab 780: Plugin Best Practices

## LEARNING CONCEPT

Best practices for Jenkins plugin management.

## EXERCISE

1. Review plugin management
2. Implement best practices
3. Maintain plugin health

## SOLUTION

### Plugin Selection Criteria

```
Before installing:
□ Is it actively maintained?
□ Does it have good ratings?
□ Is it from a trusted source?
□ Does it have security issues?
□ Is it compatible with Jenkins version?
□ Do we really need it?
```

### Minimal Plugin Set

```
Core plugins only:
- Pipeline (workflow-aggregator)
- Git
- Credentials Binding
- Docker Pipeline (if using Docker)

Add as needed:
- JUnit (for test results)
- HTML Publisher (for reports)
- Slack/Email (for notifications)
```

### Plugin Documentation

```markdown
# Jenkins Plugin Inventory

## Required Plugins
| Plugin | Version | Purpose |
|--------|---------|---------|
| git | 5.0.0 | Git integration |
| workflow-aggregator | 596.v | Pipeline support |
| docker-workflow | 572.v | Docker in pipelines |

## Optional Plugins
| Plugin | Version | Purpose |
|--------|---------|---------|
| slack | 631.v | Slack notifications |
| junit | 1202.v | Test reporting |

Last updated: 2024-01-15
```

### Plugin Version Pinning

```dockerfile
# Dockerfile with pinned versions
FROM jenkins/jenkins:lts

# plugins.txt with specific versions
COPY plugins.txt /usr/share/jenkins/ref/plugins.txt
RUN jenkins-plugin-cli --plugin-file /usr/share/jenkins/ref/plugins.txt
```

```
# plugins.txt
git:5.0.0
workflow-aggregator:596.v8c21c963d92d
docker-workflow:572.v950f58993843
credentials-binding:631.v861c6e9c7a_a_
junit:1202.v79a_986785076
```

### Update Strategy

```
Recommended approach:
1. Test updates in staging
2. Review changelogs
3. Check for breaking changes
4. Update in maintenance window
5. Verify functionality
6. Document changes
```

### Staging Environment

```yaml
# docker-compose.staging.yml
version: '3.8'
services:
  jenkins-staging:
    image: jenkins/jenkins:lts
    ports:
      - "8081:8080"
    volumes:
      - jenkins_staging:/var/jenkins_home
      - ./plugins.txt:/usr/share/jenkins/ref/plugins.txt

volumes:
  jenkins_staging:
```

### Plugin Health Monitoring

```groovy
// Check plugin health
pipeline {
    agent any
    
    triggers {
        cron('H 6 * * 1')  // Weekly Monday
    }
    
    stages {
        stage('Plugin Health') {
            steps {
                script {
                    def plugins = jenkins.model.Jenkins.instance.pluginManager.plugins
                    def issues = []
                    
                    plugins.each { plugin ->
                        if (plugin.hasUpdate()) {
                            issues << "Update: ${plugin.shortName}"
                        }
                        if (!plugin.isActive()) {
                            issues << "Inactive: ${plugin.shortName}"
                        }
                    }
                    
                    if (issues) {
                        echo "Plugin issues found:"
                        issues.each { echo it }
                    }
                }
            }
        }
    }
}
```

### Backup Before Updates

```bash
#!/bin/bash
# backup-plugins.sh

JENKINS_HOME=/var/lib/jenkins
BACKUP_DIR=/backup/jenkins/plugins
DATE=$(date +%Y%m%d)

# Backup plugins
tar -czvf $BACKUP_DIR/plugins-$DATE.tar.gz \
    -C $JENKINS_HOME plugins

# Keep last 5 backups
ls -t $BACKUP_DIR/plugins-*.tar.gz | tail -n +6 | xargs rm -f
```

### Rollback Procedure

```bash
#!/bin/bash
# rollback-plugins.sh

JENKINS_HOME=/var/lib/jenkins
BACKUP_FILE=$1

if [ -z "$BACKUP_FILE" ]; then
    echo "Usage: rollback-plugins.sh <backup-file>"
    exit 1
fi

# Stop Jenkins
systemctl stop jenkins

# Restore plugins
rm -rf $JENKINS_HOME/plugins
tar -xzvf $BACKUP_FILE -C $JENKINS_HOME

# Start Jenkins
systemctl start jenkins
```

### Plugin Removal

```
Before removing:
1. Check dependencies
2. Verify no jobs use it
3. Document removal reason

Remove:
1. Manage Jenkins → Plugins → Installed
2. Click "Uninstall"
3. Restart Jenkins
4. Verify functionality
```

### Maintenance Schedule

```
Weekly:
- Check for security advisories
- Review plugin warnings

Monthly:
- Update plugins in staging
- Test and deploy updates
- Review plugin usage

Quarterly:
- Audit installed plugins
- Remove unused plugins
- Update documentation
```

### Checklist

```
Installation:
□ Verify plugin source
□ Check compatibility
□ Test in staging
□ Document installation

Maintenance:
□ Regular updates
□ Security monitoring
□ Health checks
□ Backup before changes

Removal:
□ Check dependencies
□ Verify no usage
□ Document removal
□ Test after removal
```

### Best Practices Summary

```
✅ Install only needed plugins
✅ Pin plugin versions
✅ Test updates in staging
✅ Keep plugins updated
✅ Monitor security advisories
✅ Document plugin inventory
✅ Backup before updates
✅ Remove unused plugins
✅ Regular health checks
```

