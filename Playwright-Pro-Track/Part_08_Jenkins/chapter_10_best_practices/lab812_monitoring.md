# Lab 812: Monitoring

## LEARNING CONCEPT

Monitoring Jenkins health and performance.

## EXERCISE

1. Set up monitoring
2. Create dashboards
3. Configure alerts

## SOLUTION

### Key Metrics

```
System Metrics:
- CPU usage
- Memory usage
- Disk space
- Network I/O

Jenkins Metrics:
- Build queue length
- Build duration
- Success/failure rate
- Executor utilization
- Agent availability
```

### Prometheus Plugin

```
Install: Prometheus Metrics Plugin

Access metrics:
https://jenkins.example.com/prometheus/

Metrics exposed:
- jenkins_builds_total
- jenkins_builds_duration_milliseconds
- jenkins_queue_size
- jenkins_executors_available
- jenkins_executors_busy
```

### Prometheus Configuration

```yaml
# prometheus.yml
scrape_configs:
  - job_name: 'jenkins'
    metrics_path: '/prometheus/'
    static_configs:
      - targets: ['jenkins.example.com:8080']
    basic_auth:
      username: 'prometheus'
      password: 'password'
```

### Grafana Dashboard

```json
{
  "dashboard": {
    "title": "Jenkins Monitoring",
    "panels": [
      {
        "title": "Build Queue",
        "type": "graph",
        "targets": [
          {
            "expr": "jenkins_queue_size_value"
          }
        ]
      },
      {
        "title": "Executor Utilization",
        "type": "gauge",
        "targets": [
          {
            "expr": "jenkins_executors_busy / jenkins_executors_available * 100"
          }
        ]
      },
      {
        "title": "Build Success Rate",
        "type": "stat",
        "targets": [
          {
            "expr": "sum(jenkins_builds_success_total) / sum(jenkins_builds_total) * 100"
          }
        ]
      }
    ]
  }
}
```

### Alert Rules

```yaml
# prometheus-alerts.yml
groups:
  - name: jenkins
    rules:
      - alert: JenkinsQueueTooLong
        expr: jenkins_queue_size_value > 10
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Jenkins queue is too long"
          
      - alert: JenkinsAgentOffline
        expr: jenkins_node_offline_value == 1
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Jenkins agent {{ $labels.node }} is offline"
          
      - alert: JenkinsDiskSpaceLow
        expr: jenkins_disk_space_bytes < 10737418240
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Jenkins disk space is low"
```

### Health Check Endpoint

```groovy
// Create health check job
pipeline {
    agent any
    
    triggers {
        cron('*/5 * * * *')  // Every 5 minutes
    }
    
    stages {
        stage('Health Check') {
            steps {
                script {
                    def health = [
                        timestamp: new Date().toString(),
                        queueLength: Jenkins.instance.queue.items.length,
                        onlineAgents: Jenkins.instance.nodes.count { 
                            it.toComputer()?.isOnline() 
                        },
                        totalAgents: Jenkins.instance.nodes.size()
                    ]
                    
                    writeJSON file: 'health.json', json: health
                    archiveArtifacts 'health.json'
                }
            }
        }
    }
}
```

### Build Metrics Collection

```groovy
// Collect build metrics
post {
    always {
        script {
            def metrics = [
                job: env.JOB_NAME,
                build: env.BUILD_NUMBER,
                result: currentBuild.result,
                duration: currentBuild.duration,
                timestamp: currentBuild.startTimeInMillis
            ]
            
            // Send to metrics system
            httpRequest(
                url: 'https://metrics.example.com/jenkins',
                httpMode: 'POST',
                contentType: 'APPLICATION_JSON',
                requestBody: groovy.json.JsonOutput.toJson(metrics)
            )
        }
    }
}
```

### Log Monitoring

```bash
# Monitor Jenkins logs
tail -f /var/log/jenkins/jenkins.log | grep -E "(ERROR|WARN|Exception)"

# Send to log aggregator
# /etc/filebeat/filebeat.yml
filebeat.inputs:
  - type: log
    paths:
      - /var/log/jenkins/jenkins.log
    
output.elasticsearch:
  hosts: ["elasticsearch:9200"]
```

### Slack Alerts

```groovy
// Alert on issues
def checkAndAlert() {
    def queueLength = Jenkins.instance.queue.items.length
    
    if (queueLength > 10) {
        slackSend(
            channel: '#ops',
            color: 'warning',
            message: "⚠️ Jenkins queue is long: ${queueLength} items"
        )
    }
    
    def offlineAgents = Jenkins.instance.nodes.findAll { 
        !it.toComputer()?.isOnline() 
    }
    
    if (offlineAgents) {
        slackSend(
            channel: '#ops',
            color: 'danger',
            message: "🔴 Agents offline: ${offlineAgents*.name.join(', ')}"
        )
    }
}
```

### Dashboard Metrics

```
Essential dashboard panels:
1. Build queue length (line chart)
2. Executor utilization (gauge)
3. Build success rate (stat)
4. Build duration trend (line chart)
5. Agent status (table)
6. Recent failures (table)
7. Disk usage (gauge)
8. Memory usage (gauge)
```

### Monitoring Checklist

```
□ Prometheus metrics enabled
□ Grafana dashboards created
□ Alert rules configured
□ Log aggregation set up
□ Health checks running
□ Notification channels configured
□ Regular review scheduled
```

### Best Practices

```
✅ Monitor key metrics
✅ Set up alerts
✅ Create dashboards
✅ Aggregate logs
✅ Regular health checks
✅ Review trends
✅ Document thresholds
```

