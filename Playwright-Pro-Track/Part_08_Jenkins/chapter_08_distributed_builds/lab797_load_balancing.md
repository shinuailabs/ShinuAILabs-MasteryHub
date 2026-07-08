# Lab 797: Load Balancing

## LEARNING CONCEPT

Balancing build load across Jenkins agents.

## EXERCISE

1. Configure load balancing
2. Implement queue management
3. Optimize resource utilization

## SOLUTION

### Default Load Balancing

```
Jenkins default behavior:
- Assigns builds to available executors
- Considers label matching
- First available executor wins
```

### Label-Based Distribution

```groovy
// Distribute by capability
pipeline {
    agent {
        label 'linux && docker && high-memory'
    }
    
    stages {
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
    }
}
```

### Least Load Strategy

```
Install: Least Load Plugin

Configure:
Manage Jenkins → Nodes → Configure

Load balancing:
- Prefer nodes with fewer running builds
- Consider node capacity
```

### Node Weights

```
Node → Configure → Node Properties

Custom weight:
- Higher weight = more builds
- Lower weight = fewer builds

Use for:
- Powerful machines: higher weight
- Shared machines: lower weight
```

### Queue Management

```
Build Queue:
- Pending builds wait in queue
- Assigned when executor available
- Priority based on configuration

View queue:
- Jenkins dashboard
- /queue/api/json
```

### Priority Sorter Plugin

```
Install: Priority Sorter Plugin

Configure:
Manage Jenkins → Configure System → Priority Sorter

Job Groups:
- Priority 1: Production deployments
- Priority 2: Main branch builds
- Priority 3: Feature branch builds
- Priority 4: PR builds
```

### Job Priority in Pipeline

```groovy
pipeline {
    agent any
    
    options {
        // Higher priority (lower number = higher priority)
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }
    
    stages {
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
    }
}
```

### Throttle Concurrent Builds

```
Install: Throttle Concurrent Builds Plugin

Configure categories:
Manage Jenkins → Configure System → Throttle Concurrent Builds

Category: heavy-builds
Max concurrent per node: 1
Max concurrent total: 3
```

### Use Throttle in Pipeline

```groovy
pipeline {
    agent any
    
    options {
        throttleJobProperty(
            categories: ['heavy-builds'],
            throttleEnabled: true,
            throttleOption: 'category'
        )
    }
    
    stages {
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
    }
}
```

### Executor Starvation Prevention

```
Prevent one job type from consuming all executors:

1. Use throttle categories
2. Reserve executors for critical jobs
3. Use dedicated agents for specific jobs
```

### Node Availability

```
Node → Configure → Availability

Options:
- Keep online as much as possible
- Schedule-based availability
- On-demand (cloud agents)

Schedule example:
Startup: 0 8 * * 1-5
Shutdown: 0 20 * * 1-5
```

### Monitor Load

```groovy
// Script to check node load
import hudson.model.*

Jenkins.instance.computers.each { computer ->
    def node = computer.node
    def executors = computer.executors.size()
    def busy = computer.countBusy()
    def idle = executors - busy
    
    println "${node.name}: ${busy}/${executors} busy, ${idle} idle"
}
```

### Load Metrics

```
Monitor:
- Queue length
- Wait time
- Executor utilization
- Build duration

Tools:
- Jenkins Metrics Plugin
- Prometheus Plugin
- Grafana dashboards
```

### Auto-Scaling

```
Cloud agents auto-scale based on:
- Queue length
- Wait time
- Time of day

Configure:
- Minimum instances: 0
- Maximum instances: 10
- Scale-up threshold: queue > 5
- Scale-down threshold: idle > 10 min
```

### Resource Allocation

```groovy
// Allocate resources based on job type
pipeline {
    agent none
    
    stages {
        stage('Light Build') {
            agent { label 'small' }
            steps {
                sh 'npm run lint'
            }
        }
        
        stage('Heavy Build') {
            agent { label 'large && high-memory' }
            steps {
                sh 'npm run build'
            }
        }
        
        stage('Test') {
            agent { label 'medium' }
            steps {
                sh 'npm test'
            }
        }
    }
}
```

### Best Practices

```
✅ Use labels for job routing
✅ Implement priority queuing
✅ Throttle heavy jobs
✅ Monitor queue and load
✅ Auto-scale cloud agents
✅ Reserve capacity for critical jobs
✅ Regular capacity planning
```

