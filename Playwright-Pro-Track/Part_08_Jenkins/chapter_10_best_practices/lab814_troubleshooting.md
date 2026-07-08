# Lab 814: Troubleshooting

## LEARNING CONCEPT

Troubleshooting common Jenkins issues.

## EXERCISE

1. Diagnose common problems
2. Use debugging tools
3. Resolve issues

## SOLUTION

### Common Issues

```
1. Build stuck in queue
2. Agent offline
3. Out of memory
4. Slow performance
5. Plugin conflicts
6. Authentication failures
7. Disk space full
8. Pipeline failures
```

### Build Stuck in Queue

```
Symptoms:
- Builds waiting indefinitely
- "Waiting for next available executor"

Diagnosis:
1. Check agent availability
2. Verify label matching
3. Check executor count
4. Review throttle settings

Solutions:
- Bring agents online
- Fix label expressions
- Increase executors
- Clear stuck builds
```

```groovy
// Script to clear stuck builds
import hudson.model.*

Jenkins.instance.queue.items.each { item ->
    println "Queued: ${item.task.name}"
    println "Why: ${item.getWhy()}"
    
    // Cancel if stuck too long
    if (item.getInQueueSince() < System.currentTimeMillis() - 3600000) {
        Jenkins.instance.queue.cancel(item.task)
        println "Cancelled: ${item.task.name}"
    }
}
```

### Agent Offline

```
Symptoms:
- Agent shows offline
- Builds fail to start

Diagnosis:
1. Check network connectivity
2. Verify credentials
3. Check agent logs
4. Verify Java version

Solutions:
- Restart agent
- Update credentials
- Fix network issues
- Reinstall agent
```

```bash
# Check agent connectivity
ping agent-host
ssh jenkins@agent-host "java -version"

# Check agent logs
tail -f /var/log/jenkins/agent.log
```

### Out of Memory

```
Symptoms:
- Jenkins crashes
- OutOfMemoryError in logs
- Slow response

Diagnosis:
1. Check heap usage
2. Review memory settings
3. Check for memory leaks

Solutions:
- Increase heap size
- Reduce build history
- Restart Jenkins
- Upgrade hardware
```

```bash
# Check memory usage
jmap -heap $(pgrep -f jenkins)

# Increase heap size
# /etc/default/jenkins
JAVA_OPTS="-Xms2g -Xmx4g"
```

### Slow Performance

```
Symptoms:
- Slow UI response
- Long build times
- High CPU usage

Diagnosis:
1. Check system resources
2. Review plugin count
3. Check build history
4. Monitor queue length

Solutions:
- Optimize JVM settings
- Remove unused plugins
- Clean old builds
- Add more agents
```

### Plugin Conflicts

```
Symptoms:
- Errors after plugin update
- Features not working
- Stack traces in logs

Diagnosis:
1. Check plugin compatibility
2. Review recent changes
3. Check dependency versions

Solutions:
- Rollback plugin
- Update dependencies
- Check compatibility matrix
```

```bash
# List installed plugins
curl -s "http://jenkins:8080/pluginManager/api/json?depth=1" | \
    jq '.plugins[] | {name: .shortName, version: .version}'
```

### Pipeline Debugging

```groovy
// Add debugging to pipeline
pipeline {
    agent any
    
    options {
        timestamps()
    }
    
    stages {
        stage('Debug') {
            steps {
                // Print environment
                sh 'env | sort'
                
                // Print workspace
                sh 'pwd && ls -la'
                
                // Print Jenkins info
                echo "Build: ${env.BUILD_NUMBER}"
                echo "Node: ${env.NODE_NAME}"
                echo "Workspace: ${env.WORKSPACE}"
            }
        }
    }
}
```

### Log Analysis

```bash
# Search for errors
grep -i "error\|exception\|failed" /var/log/jenkins/jenkins.log

# Recent errors
tail -1000 /var/log/jenkins/jenkins.log | grep -i error

# Plugin errors
grep "plugin" /var/log/jenkins/jenkins.log | grep -i error
```

### Script Console Debugging

```groovy
// Check system info
println "Jenkins Version: ${Jenkins.instance.version}"
println "Java Version: ${System.getProperty('java.version')}"
println "OS: ${System.getProperty('os.name')}"

// Check plugins
Jenkins.instance.pluginManager.plugins.each { plugin ->
    if (plugin.hasUpdate()) {
        println "${plugin.shortName}: ${plugin.version} -> ${plugin.updateInfo.version}"
    }
}

// Check agents
Jenkins.instance.nodes.each { node ->
    def computer = node.toComputer()
    println "${node.name}: ${computer?.isOnline() ? 'online' : 'offline'}"
}
```

### Thread Dump

```bash
# Get thread dump
jstack $(pgrep -f jenkins) > thread-dump.txt

# Analyze for deadlocks
grep -A 20 "deadlock" thread-dump.txt
```

### Disk Space Issues

```bash
# Check disk usage
df -h /var/lib/jenkins

# Find large files
du -sh /var/lib/jenkins/* | sort -h

# Clean workspaces
find /var/lib/jenkins/workspace -type d -mtime +7 -exec rm -rf {} \;

# Clean old builds
find /var/lib/jenkins/jobs/*/builds -type d -mtime +30 -exec rm -rf {} \;
```

### Troubleshooting Checklist

```
□ Check logs for errors
□ Verify agent connectivity
□ Check disk space
□ Review memory usage
□ Check plugin compatibility
□ Verify credentials
□ Test network connectivity
□ Review recent changes
```

### Best Practices

```
✅ Monitor proactively
✅ Keep logs accessible
✅ Document solutions
✅ Test changes in staging
✅ Maintain runbooks
✅ Regular health checks
```

