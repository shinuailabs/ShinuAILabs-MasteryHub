# Lab 789: Security Best Practices

## LEARNING CONCEPT

Comprehensive security best practices for Jenkins.

## EXERCISE

1. Review security checklist
2. Implement hardening measures
3. Establish security processes

## SOLUTION

### Security Checklist

```
Authentication:
□ Disable anonymous access
□ Use SSO/LDAP/AD
□ Enable 2FA for admins
□ Strong password policy
□ Account lockout policy

Authorization:
□ Role-based access control
□ Least privilege principle
□ Folder-based permissions
□ Regular permission audits

Network:
□ HTTPS only
□ Reverse proxy
□ Firewall configured
□ VPN for remote access
□ Network segmentation
```

### Controller Security

```
Manage Jenkins → Security

Essential settings:
✓ Enable security
✓ Disable CLI over Remoting
✓ Enable CSRF protection
✓ Enable agent → controller access control
✓ Disable deprecated protocols
```

### Disable Dangerous Features

```
Manage Jenkins → Security

Disable:
- CLI over Remoting
- JNLP protocols 1-3
- Remember me (optional)

Enable:
- CSRF protection
- Agent to controller security
```

### Secure Jenkins Home

```bash
# File permissions
chmod 700 $JENKINS_HOME
chown -R jenkins:jenkins $JENKINS_HOME

# Protect secrets
chmod 600 $JENKINS_HOME/secrets/*
chmod 600 $JENKINS_HOME/credentials.xml

# Backup encryption
gpg --encrypt --recipient admin@example.com jenkins-backup.tar
```

### Plugin Security

```
Plugin management:
□ Install only needed plugins
□ Keep plugins updated
□ Monitor security advisories
□ Remove unused plugins
□ Test updates in staging
```

### Credential Management

```
Credential security:
□ Use folder-scoped credentials
□ Rotate credentials regularly
□ Use external secret managers
□ Audit credential usage
□ Mask in logs
```

### Pipeline Security

```groovy
// Secure pipeline practices
pipeline {
    agent {
        label 'secure-agent'  // Use dedicated agents
    }
    
    options {
        timeout(time: 30, unit: 'MINUTES')  // Prevent runaway builds
        disableConcurrentBuilds()  // Prevent race conditions
    }
    
    stages {
        stage('Build') {
            steps {
                // Use credentials binding
                withCredentials([string(credentialsId: 'token', variable: 'TOKEN')]) {
                    sh '''
                        set +x  # Don't echo commands
                        # Use credential
                    '''
                }
            }
        }
    }
    
    post {
        always {
            cleanWs()  // Clean workspace
        }
    }
}
```

### Agent Security

```
Agent hardening:
□ Use SSH or JNLP with TLS
□ Dedicated service account
□ No sudo access
□ Ephemeral agents preferred
□ Clean workspaces
□ Network isolation
```

### Monitoring and Alerting

```
Monitor:
- Failed login attempts
- Configuration changes
- Plugin installations
- Credential access
- Build failures

Alert on:
- Multiple failed logins
- Unauthorized access attempts
- Security scan failures
- Agent disconnections
```

### Incident Response

```
Incident response plan:
1. Detection
   - Monitor logs
   - Security alerts
   
2. Containment
   - Disable compromised accounts
   - Isolate affected systems
   
3. Investigation
   - Review audit logs
   - Identify scope
   
4. Recovery
   - Restore from backup
   - Rotate credentials
   
5. Post-incident
   - Document findings
   - Update procedures
```

### Regular Security Tasks

```
Daily:
- Review failed logins
- Check build failures

Weekly:
- Review security advisories
- Check plugin updates

Monthly:
- Rotate credentials
- Review permissions
- Update plugins

Quarterly:
- Security audit
- Penetration testing
- Update documentation
```

### Compliance

```
SOC 2:
- Access controls
- Audit logging
- Change management
- Incident response

GDPR:
- Data protection
- Access logging
- Data retention

PCI DSS:
- Network segmentation
- Access controls
- Encryption
- Logging
```

### Security Hardening Script

```bash
#!/bin/bash
# jenkins-security-check.sh

echo "Jenkins Security Check"
echo "====================="

# Check HTTPS
if curl -s -o /dev/null -w "%{http_code}" http://jenkins:8080 | grep -q "301\|302"; then
    echo "✓ HTTP redirects to HTTPS"
else
    echo "✗ HTTP not redirecting to HTTPS"
fi

# Check anonymous access
if curl -s http://jenkins:8080/api/json | grep -q "Authentication required"; then
    echo "✓ Anonymous access disabled"
else
    echo "✗ Anonymous access may be enabled"
fi

# Check for security warnings
echo "Checking for security warnings..."
```

### Documentation

```
Document:
- Security architecture
- Access control matrix
- Credential inventory
- Incident response plan
- Recovery procedures
- Compliance requirements
```

### Best Practices Summary

```
✅ Enable all security features
✅ Use SSO and 2FA
✅ Implement RBAC
✅ Use HTTPS only
✅ Keep everything updated
✅ Monitor and audit
✅ Regular security reviews
✅ Document everything
✅ Train team members
✅ Have incident response plan
```

