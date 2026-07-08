# Lab 790: Controller-Agent Architecture

## LEARNING CONCEPT

Understanding Jenkins distributed build architecture.

## EXERCISE

1. Understand controller-agent model
2. Plan distributed architecture
3. Configure controller settings

## SOLUTION

### Architecture Overview

```
┌─────────────────────────────────────┐
│         Jenkins Controller          │
│  - Job configuration                │
│  - Build scheduling                 │
│  - UI and API                       │
│  - Plugin management                │
└──────────────┬──────────────────────┘
               │
    ┌──────────┼──────────┐
    │          │          │
┌───┴───┐  ┌───┴───┐  ┌───┴───┐
│Agent 1│  │Agent 2│  │Agent 3│
│(Linux)│  │(Windows)│ │(macOS)│
└───────┘  └───────┘  └───────┘
```

### Controller Responsibilities

```
Jenkins Controller:
- Stores configuration
- Schedules builds
- Dispatches builds to agents
- Monitors agents
- Serves UI and API
- Manages plugins
- Stores build results
```

### Agent Responsibilities

```
Jenkins Agents:
- Execute build steps
- Run tests
- Build artifacts
- Report results to controller
- Provide specific environments
```

### Why Distributed Builds?

```
Benefits:
- Scalability: Handle more builds
- Isolation: Separate build environments
- Parallelism: Run builds concurrently
- Specialization: Different OS/tools
- Security: Isolate sensitive builds
```

### Controller Configuration

```
Manage Jenkins → Nodes → Built-In Node → Configure

# of executors: 0 (recommended for production)
Labels: controller
Usage: Only build jobs with label expressions

Note: Don't run builds on controller in production
```

### Agent Types

```
Permanent agents:
- Always connected
- Dedicated machines
- Consistent environment

Cloud agents:
- On-demand provisioning
- Docker containers
- Kubernetes pods
- AWS EC2 instances
```

### Connection Methods

```
SSH:
- Controller connects to agent
- Requires SSH access
- Most secure

JNLP (Inbound):
- Agent connects to controller
- Works through firewalls
- Requires open port on controller

WebSocket:
- Agent connects via WebSocket
- Works through proxies
- Modern approach
```

### Executor Configuration

```
Executors per agent:
- CPU-bound builds: 1 per core
- I/O-bound builds: 2-4 per core
- Memory-intensive: Based on RAM

Example:
- 4-core machine
- 16GB RAM
- 4 executors for typical builds
```

### Labels and Node Selection

```groovy
pipeline {
    agent {
        label 'linux && docker'
    }
    
    stages {
        stage('Build') {
            steps {
                sh 'docker build .'
            }
        }
    }
}
```

### Label Expressions

```
Simple label:
agent { label 'linux' }

AND:
agent { label 'linux && docker' }

OR:
agent { label 'linux || macos' }

NOT:
agent { label '!windows' }

Complex:
agent { label '(linux || macos) && docker && !production' }
```

### Node Properties

```
Node → Configure → Node Properties

Environment variables:
- PATH additions
- Tool locations

Tool locations:
- JDK
- Maven
- Node.js
```

### Availability

```
Node → Configure → Availability

Options:
- Keep this agent online as much as possible
- Bring this agent online according to schedule
- Bring this agent online when in demand
```

### Resource Management

```
Throttle Concurrent Builds Plugin:
- Limit concurrent builds
- Resource-based throttling

Lockable Resources Plugin:
- Lock shared resources
- Prevent conflicts
```

### Monitoring

```
Monitor agents:
- Manage Jenkins → Nodes
- View status, load, disk space

Alerts:
- Agent offline
- Low disk space
- High load
```

### Best Practices

```
✅ Don't build on controller
✅ Use labels for node selection
✅ Right-size executors
✅ Monitor agent health
✅ Use cloud agents for scaling
✅ Separate environments
✅ Regular maintenance
```

