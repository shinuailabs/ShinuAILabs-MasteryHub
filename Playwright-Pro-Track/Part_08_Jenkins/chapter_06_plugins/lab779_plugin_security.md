# Lab 779: Plugin Security

## LEARNING CONCEPT

Managing plugin security in Jenkins.

## EXERCISE

1. Review security advisories
2. Update vulnerable plugins
3. Implement security practices

## SOLUTION

### Security Advisories

```
Check advisories:
1. Manage Jenkins → Security
2. View security warnings
3. Check jenkins.io/security/advisories

Sources:
- Jenkins Security Team
- Plugin maintainers
- Community reports
```

### View Plugin Warnings

```
Manage Jenkins → Plugins → Installed

Warning indicators:
⚠️ Security vulnerability
⚠️ Deprecated plugin
⚠️ Incompatible version
```

### Update Vulnerable Plugins

```
Manage Jenkins → Plugins → Updates

1. Review available updates
2. Check security fixes
3. Select plugins to update
4. Click "Download now and install after restart"
5. Restart Jenkins
```

### Automatic Security Updates

```
Configure automatic updates:
Manage Jenkins → Plugins → Advanced

Options:
- Check for updates periodically
- Download but don't install
- Install automatically (not recommended)
```

### Plugin Installation Security

```
Best practices:
✅ Only install from official update center
✅ Verify plugin source
✅ Check plugin ratings and reviews
✅ Review plugin permissions
✅ Test in staging first
```

### Disable Vulnerable Plugins

```
If update not available:
1. Manage Jenkins → Plugins → Installed
2. Find vulnerable plugin
3. Click "Disable"
4. Restart Jenkins

Or remove:
1. Click "Uninstall"
2. Restart Jenkins
```

### Plugin Permissions

```
Some plugins require:
- Script approval
- Agent access
- Credential access
- System configuration

Review permissions:
Manage Jenkins → In-process Script Approval
```

### Script Security

```
Script Security Plugin:
- Sandboxes Groovy scripts
- Requires approval for unsafe methods
- Protects against malicious code

Approve scripts:
Manage Jenkins → In-process Script Approval
```

### Credential Security

```
Protect credentials:
✅ Use credential scopes appropriately
✅ Limit credential access
✅ Audit credential usage
✅ Rotate credentials regularly
```

### Plugin Audit

```bash
# List installed plugins
java -jar jenkins-cli.jar -s http://jenkins:8080/ \
    -auth admin:token \
    list-plugins

# Check for updates
java -jar jenkins-cli.jar -s http://jenkins:8080/ \
    -auth admin:token \
    list-plugins | grep -v "^$" | awk '{print $1}' | \
    while read plugin; do
        echo "Checking $plugin..."
    done
```

### Security Scanning

```groovy
// Jenkinsfile for plugin security scan
pipeline {
    agent any
    
    triggers {
        cron('H 2 * * 1')  // Weekly
    }
    
    stages {
        stage('Check Plugins') {
            steps {
                script {
                    def plugins = jenkins.model.Jenkins.instance.pluginManager.plugins
                    
                    plugins.each { plugin ->
                        if (plugin.hasUpdate()) {
                            echo "Update available: ${plugin.shortName}"
                        }
                    }
                }
            }
        }
    }
}
```

### Security Checklist

```
Regular tasks:
□ Check security advisories weekly
□ Update plugins monthly
□ Review installed plugins quarterly
□ Audit plugin permissions
□ Remove unused plugins

Before installing:
□ Check plugin source
□ Review security history
□ Test in staging
□ Document installation
```

### Incident Response

```
If vulnerability discovered:
1. Assess impact
2. Check if exploited
3. Update or disable plugin
4. Review logs
5. Notify stakeholders
6. Document incident
```

### Security Resources

```
Jenkins Security:
- jenkins.io/security
- jenkins.io/security/advisories
- jenkins.io/security/plugins

Mailing lists:
- jenkinsci-advisories@googlegroups.com

Report vulnerabilities:
- security@jenkins.io
```

### Best Practices

```
✅ Subscribe to security advisories
✅ Update plugins regularly
✅ Remove unused plugins
✅ Test updates in staging
✅ Use minimal plugin set
✅ Audit plugin access
✅ Document plugin inventory
```

