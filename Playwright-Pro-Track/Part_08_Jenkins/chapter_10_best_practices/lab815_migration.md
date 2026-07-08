# Lab 815: Migration

## LEARNING CONCEPT

Migrating Jenkins to new infrastructure.

## EXERCISE

1. Plan migration
2. Execute migration
3. Validate migration

## SOLUTION

### Migration Scenarios

```
Common migrations:
1. Server to server
2. On-premise to cloud
3. Standalone to Kubernetes
4. Version upgrade
5. Controller consolidation
```

### Migration Planning

```
1. Assessment
   - Current configuration
   - Jobs and pipelines
   - Plugins and versions
   - Integrations
   - Agent setup

2. Planning
   - Timeline
   - Rollback plan
   - Communication
   - Testing strategy

3. Execution
   - Backup
   - Setup new environment
   - Migrate data
   - Test
   - Cutover

4. Validation
   - Verify functionality
   - Test builds
   - Check integrations
```

### Server-to-Server Migration

```bash
#!/bin/bash
# migrate-jenkins.sh

OLD_SERVER="old-jenkins.example.com"
NEW_SERVER="new-jenkins.example.com"
JENKINS_HOME="/var/lib/jenkins"

# 1. Stop Jenkins on old server
ssh ${OLD_SERVER} "systemctl stop jenkins"

# 2. Create backup
ssh ${OLD_SERVER} "tar -czf /tmp/jenkins-backup.tar.gz -C ${JENKINS_HOME} ."

# 3. Transfer backup
scp ${OLD_SERVER}:/tmp/jenkins-backup.tar.gz ${NEW_SERVER}:/tmp/

# 4. Restore on new server
ssh ${NEW_SERVER} "
    systemctl stop jenkins
    rm -rf ${JENKINS_HOME}/*
    tar -xzf /tmp/jenkins-backup.tar.gz -C ${JENKINS_HOME}
    chown -R jenkins:jenkins ${JENKINS_HOME}
    systemctl start jenkins
"

# 5. Update DNS
echo "Update DNS to point to ${NEW_SERVER}"
```

### Configuration as Code Migration

```yaml
# jenkins.yaml - Export configuration
jenkins:
  systemMessage: "Migrated Jenkins"
  numExecutors: 0
  
  securityRealm:
    ldap:
      configurations:
        - server: "ldap.example.com"
          
  authorizationStrategy:
    roleBased:
      roles:
        global:
          - name: "admin"
            permissions:
              - "Overall/Administer"

jobs:
  - script: >
      folder('migrated-jobs')
```

### Plugin Migration

```bash
#!/bin/bash
# Export plugins list
curl -s "http://old-jenkins:8080/pluginManager/api/json?depth=1" | \
    jq -r '.plugins[] | "\(.shortName):\(.version)"' > plugins.txt

# Install plugins on new server
while read plugin; do
    name=$(echo $plugin | cut -d: -f1)
    version=$(echo $plugin | cut -d: -f2)
    
    curl -X POST "http://new-jenkins:8080/pluginManager/installNecessaryPlugins" \
        -d "<install plugin='${name}@${version}' />"
done < plugins.txt
```

### Job Migration

```groovy
// Export job configurations
import hudson.model.*

Jenkins.instance.allItems(Job).each { job ->
    def config = job.configFile.asString()
    def path = "jobs/${job.fullName.replace('/', '_')}.xml"
    
    new File(path).text = config
    println "Exported: ${job.fullName}"
}
```

### Agent Migration

```bash
# Update agent configurations
for agent in agent1 agent2 agent3; do
    # Update Jenkins URL in agent config
    ssh $agent "
        sed -i 's/old-jenkins.example.com/new-jenkins.example.com/g' \
            /home/jenkins/agent/jenkins-agent.cfg
        systemctl restart jenkins-agent
    "
done
```

### Kubernetes Migration

```yaml
# jenkins-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: jenkins
spec:
  replicas: 1
  selector:
    matchLabels:
      app: jenkins
  template:
    spec:
      containers:
        - name: jenkins
          image: jenkins/jenkins:lts
          volumeMounts:
            - name: jenkins-home
              mountPath: /var/jenkins_home
      volumes:
        - name: jenkins-home
          persistentVolumeClaim:
            claimName: jenkins-pvc
```

### Validation Checklist

```
□ Jenkins starts successfully
□ All plugins loaded
□ Jobs visible and configured
□ Credentials accessible
□ Agents connect
□ Builds run successfully
□ Integrations work
□ Users can authenticate
□ Webhooks trigger builds
□ Notifications sent
```

### Rollback Plan

```bash
#!/bin/bash
# rollback.sh

# 1. Stop new Jenkins
ssh new-jenkins "systemctl stop jenkins"

# 2. Update DNS back to old server
# (manual step)

# 3. Start old Jenkins
ssh old-jenkins "systemctl start jenkins"

# 4. Verify
curl -s http://old-jenkins:8080/api/json | jq .
```

### Post-Migration Tasks

```
1. Update documentation
2. Notify users
3. Monitor for issues
4. Decommission old server
5. Update integrations
6. Verify backups work
```

### Best Practices

```
✅ Plan thoroughly
✅ Test in staging
✅ Have rollback plan
✅ Communicate timeline
✅ Validate everything
✅ Keep old server running
✅ Document changes
```

