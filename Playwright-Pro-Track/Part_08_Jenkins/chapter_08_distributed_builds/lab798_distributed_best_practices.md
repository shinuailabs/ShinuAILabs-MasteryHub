# Lab 798: Distributed Build Best Practices

## LEARNING CONCEPT

Best practices for Jenkins distributed builds.

## EXERCISE

1. Review architecture patterns
2. Implement best practices
3. Optimize distributed builds

## SOLUTION

### Architecture Patterns

```
Small Team (< 10 developers):
┌─────────────┐
│ Controller  │
└──────┬──────┘
       │
  ┌────┴────┐
  │         │
┌─┴─┐     ┌─┴─┐
│A1 │     │A2 │
└───┘     └───┘

Medium Team (10-50 developers):
┌─────────────┐
│ Controller  │
└──────┬──────┘
       │
  ┌────┼────┬────┐
  │    │    │    │
┌─┴─┐┌─┴─┐┌─┴─┐┌─┴─┐
│A1 ││A2 ││A3 ││A4 │
└───┘└───┘└───┘└───┘
+ Cloud agents for scaling

Large Team (50+ developers):
Multiple controllers with shared agents
or Kubernetes-based dynamic agents
```

### Don't Build on Controller

```
Manage Jenkins → Nodes → Built-In Node → Configure

# of executors: 0

Reasons:
- Security risk
- Performance impact
- Resource contention
- Single point of failure
```

### Agent Sizing Guidelines

```
Light builds (lint, unit tests):
- 2 CPU cores
- 4 GB RAM
- 20 GB disk

Medium builds (compile, integration tests):
- 4 CPU cores
- 8 GB RAM
- 50 GB disk

Heavy builds (E2E tests, Docker builds):
- 8+ CPU cores
- 16+ GB RAM
- 100+ GB disk
```

### Executor Configuration

```
Executors per agent:
- CPU-bound: 1 per core
- I/O-bound: 2 per core
- Mixed: 1.5 per core

Example (4-core machine):
- Build jobs: 4 executors
- Test jobs: 6-8 executors
```

### Label Strategy

```
Recommended labels:
- OS: linux, windows, macos
- Capability: docker, kubernetes
- Size: small, medium, large
- Purpose: build, test, deploy

Example:
agent { label 'linux && docker && large' }
```

### Workspace Management

```groovy
pipeline {
    agent any
    
    options {
        // Clean workspace before build
        skipDefaultCheckout()
    }
    
    stages {
        stage('Checkout') {
            steps {
                cleanWs()
                checkout scm
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
    }
}
```

### Artifact Management

```groovy
// Use stash/unstash for small artifacts
stage('Build') {
    steps {
        sh 'npm run build'
        stash includes: 'dist/**/*', name: 'build'
    }
}

// Use archiveArtifacts for persistence
post {
    success {
        archiveArtifacts artifacts: 'dist/**/*'
    }
}

// Use external storage for large artifacts
// - S3, GCS, Azure Blob
// - Artifactory, Nexus
```

### Caching Strategy

```groovy
// Cache dependencies
pipeline {
    agent {
        docker {
            image 'node:18'
            args '-v npm-cache:/root/.npm'
        }
    }
    
    stages {
        stage('Install') {
            steps {
                sh 'npm ci --cache /root/.npm'
            }
        }
    }
}
```

### Network Optimization

```
Reduce network traffic:
- Use local artifact caches
- Mirror Docker registries
- Cache npm/Maven repositories
- Use shallow git clones
```

### Monitoring

```
Monitor:
- Agent availability
- Build queue length
- Executor utilization
- Build duration trends
- Failure rates

Tools:
- Jenkins Metrics Plugin
- Prometheus + Grafana
- CloudWatch/Azure Monitor
```

### High Availability

```
Controller HA:
- Active-passive setup
- Shared storage (NFS, EFS)
- Load balancer
- Regular backups

Agent HA:
- Multiple agents per label
- Cloud auto-scaling
- Health checks
```

### Security Checklist

```
□ Use SSH or JNLP with TLS
□ Dedicated service accounts
□ Network segmentation
□ Clean workspaces
□ Ephemeral agents when possible
□ Regular security updates
```

### Troubleshooting

```
Common issues:
1. Agent offline
   - Check network connectivity
   - Verify credentials
   - Check agent logs

2. Builds stuck in queue
   - Check label matching
   - Verify agent availability
   - Check executor count

3. Slow builds
   - Check resource utilization
   - Review network latency
   - Optimize caching
```

### Checklist

```
Architecture:
□ Don't build on controller
□ Right-size agents
□ Use appropriate labels
□ Plan for scaling

Operations:
□ Monitor agent health
□ Clean workspaces
□ Manage artifacts
□ Implement caching

Security:
□ Secure connections
□ Isolate agents
□ Regular updates
□ Audit access
```

### Best Practices Summary

```
✅ Never build on controller
✅ Use labels for routing
✅ Right-size agents
✅ Clean workspaces
✅ Cache dependencies
✅ Monitor everything
✅ Plan for scaling
✅ Secure all connections
✅ Document architecture
✅ Regular maintenance
```

