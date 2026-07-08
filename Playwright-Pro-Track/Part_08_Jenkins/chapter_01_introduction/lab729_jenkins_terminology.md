# Lab 729: Jenkins Terminology

## LEARNING CONCEPT

Understanding key Jenkins terms and concepts.

## EXERCISE

1. Learn core terminology
2. Understand relationships
3. Apply in context

## SOLUTION

### Core Terms

```
Job/Project
- A task or set of tasks to execute
- Can be freestyle, pipeline, or multibranch

Build
- Single execution of a job
- Has a build number
- Produces artifacts and logs

Pipeline
- Series of automated steps
- Defined in Jenkinsfile
- Supports stages and parallel execution

Stage
- Logical grouping of steps
- Visualized in pipeline view
- Examples: Build, Test, Deploy

Step
- Single task within a stage
- Smallest unit of work
- Examples: sh, echo, checkout
```

### Infrastructure Terms

```
Controller (Master)
- Central Jenkins server
- Manages configuration
- Schedules builds

Agent (Slave/Node)
- Machine that runs builds
- Connected to controller
- Can be permanent or ephemeral

Executor
- Thread that runs builds
- Each agent has multiple executors
- Configurable per agent

Workspace
- Directory for build files
- Unique per job per agent
- Cleaned between builds (optional)
```

### Pipeline Terms

```
Declarative Pipeline
- Structured syntax
- Easier to read
- Limited flexibility

Scripted Pipeline
- Groovy-based
- More flexible
- Steeper learning curve

Shared Library
- Reusable pipeline code
- Centralized functions
- Version controlled
```

### Build Terms

```
Artifact
- Files produced by build
- Stored for later use
- Examples: JAR, Docker image

Fingerprint
- Hash of artifact
- Tracks usage across builds
- Enables traceability

Archive
- Store artifacts
- Available for download
- Configurable retention
```

### Trigger Terms

```
SCM Polling
- Check for changes periodically
- Triggers build on change

Webhook
- Push notification from SCM
- Immediate trigger

Cron
- Time-based scheduling
- Uses cron syntax

Upstream/Downstream
- Build triggered by another build
- Creates build chains
```

### Status Terms

```
Build Status:
- Success (blue/green)
- Unstable (yellow)
- Failure (red)
- Aborted (gray)
- Not Built (gray)

Weather Icons:
☀️ Sunny - All recent builds passed
🌤️ Cloudy - Some builds failed
🌧️ Rainy - Most builds failed
⛈️ Stormy - All recent builds failed
```

### Quick Reference

```
| Term       | Description                    |
|------------|--------------------------------|
| Job        | Task to execute                |
| Build      | Single job execution           |
| Pipeline   | Series of stages               |
| Stage      | Group of steps                 |
| Step       | Single task                    |
| Agent      | Build machine                  |
| Executor   | Build thread                   |
| Workspace  | Build directory                |
| Artifact   | Build output                   |
| Trigger    | What starts a build            |
```

