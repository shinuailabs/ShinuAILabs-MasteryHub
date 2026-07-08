# Lab 728: Jenkins Architecture

## LEARNING CONCEPT

Understanding Jenkins controller-agent architecture.

## EXERCISE

1. Learn controller responsibilities
2. Understand agent roles
3. Explore communication methods

## SOLUTION

### Controller (Master)

```
Responsibilities:
- Scheduling build jobs
- Dispatching builds to agents
- Monitoring agents
- Recording build results
- Serving web UI
- Managing plugins
```

### Agents (Slaves)

```
Responsibilities:
- Execute build jobs
- Report status to controller
- Provide build environment
- Can be specialized (OS, tools)
```

### Architecture Diagram

```
                    ┌─────────────────────┐
                    │  Jenkins Controller │
                    │  ┌───────────────┐  │
                    │  │   Web UI      │  │
                    │  │   REST API    │  │
                    │  │   Scheduler   │  │
                    │  │   Plugins     │  │
                    │  └───────────────┘  │
                    └─────────┬───────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│  Linux Agent  │   │ Windows Agent │   │  Docker Agent │
│  ┌─────────┐  │   │  ┌─────────┐  │   │  ┌─────────┐  │
│  │Workspace│  │   │  │Workspace│  │   │  │Workspace│  │
│  │ Tools   │  │   │  │ Tools   │  │   │  │ Tools   │  │
│  └─────────┘  │   │  └─────────┘  │   │  └─────────┘  │
└───────────────┘   └───────────────┘   └───────────────┘
```

### Communication Methods

```groovy
// SSH Agent
agent {
    label 'linux'
}

// JNLP Agent (Java Web Start)
agent {
    label 'windows'
}

// Docker Agent
agent {
    docker {
        image 'node:18'
    }
}

// Kubernetes Agent
agent {
    kubernetes {
        yaml '''
        spec:
          containers:
          - name: node
            image: node:18
        '''
    }
}
```

### Agent Labels

```groovy
// Single label
agent { label 'linux' }

// Multiple labels (AND)
agent { label 'linux && docker' }

// Multiple labels (OR)
agent { label 'linux || windows' }

// Negation
agent { label '!windows' }
```

### Workspace

```
/var/jenkins_home/workspace/
├── job-name/
│   ├── src/
│   ├── build/
│   └── test-results/
└── another-job/
    └── ...
```

### Distributed Builds

```
Benefits:
✅ Parallel execution
✅ Platform-specific builds
✅ Load distribution
✅ Isolation
✅ Scalability
```

### Best Practices

```
✅ Don't run builds on controller
✅ Use dedicated agents
✅ Label agents appropriately
✅ Use ephemeral agents when possible
✅ Monitor agent health
✅ Secure agent communication
```

