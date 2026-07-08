# Lab 817: GitHub Actions Overview

## LEARNING CONCEPT

Understanding GitHub Actions and its core concepts.

## EXERCISE

1. Understand what GitHub Actions is
2. Learn key terminology
3. Explore use cases

## SOLUTION

### What is GitHub Actions?

```
GitHub Actions is a CI/CD platform that allows you to:
- Automate build, test, and deployment pipelines
- Run workflows based on repository events
- Use pre-built actions from the marketplace
- Create custom automation workflows
```

### Key Concepts

```
Workflow:
- Automated process defined in YAML
- Stored in .github/workflows/
- Triggered by events

Job:
- Set of steps that run on same runner
- Jobs run in parallel by default
- Can have dependencies

Step:
- Individual task in a job
- Runs commands or actions
- Sequential execution

Action:
- Reusable unit of code
- Can be from marketplace or custom
- Simplifies common tasks

Runner:
- Server that runs workflows
- GitHub-hosted or self-hosted
- Linux, Windows, macOS
```

### Workflow Structure

```yaml
# .github/workflows/example.yml
name: Example Workflow

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Run a command
        run: echo "Hello, World!"
```

### GitHub-Hosted Runners

```
Available runners:
- ubuntu-latest (Ubuntu 22.04)
- ubuntu-22.04
- ubuntu-20.04
- windows-latest (Windows Server 2022)
- windows-2022
- windows-2019
- macos-latest (macOS 14)
- macos-14
- macos-13
- macos-12
```

### Use Cases

```
CI/CD:
- Build and test code
- Deploy applications
- Release management

Automation:
- Issue management
- PR automation
- Scheduled tasks

DevOps:
- Infrastructure as code
- Container builds
- Security scanning
```

### Pricing

```
GitHub Free:
- 2,000 minutes/month (public repos unlimited)
- 500 MB storage

GitHub Pro:
- 3,000 minutes/month
- 1 GB storage

GitHub Team:
- 3,000 minutes/month
- 2 GB storage

GitHub Enterprise:
- 50,000 minutes/month
- 50 GB storage

Note: Minutes multiplied by OS factor
- Linux: 1x
- Windows: 2x
- macOS: 10x
```

### Workflow File Location

```
Repository structure:
my-repo/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       ├── deploy.yml
│       └── release.yml
├── src/
└── package.json
```

### First Workflow

```yaml
# .github/workflows/hello.yml
name: Hello World

on:
  push:
    branches: [main]
  workflow_dispatch:  # Manual trigger

jobs:
  greet:
    runs-on: ubuntu-latest
    
    steps:
      - name: Say Hello
        run: echo "Hello from GitHub Actions!"
        
      - name: Show date
        run: date
        
      - name: Show environment
        run: |
          echo "Runner OS: $RUNNER_OS"
          echo "GitHub Actor: $GITHUB_ACTOR"
          echo "Repository: $GITHUB_REPOSITORY"
```

### Viewing Workflow Runs

```
GitHub UI:
1. Go to repository
2. Click "Actions" tab
3. Select workflow
4. View run details

Each run shows:
- Status (success/failure)
- Duration
- Trigger event
- Job logs
```

### Best Practices

```
✅ Use meaningful workflow names
✅ Keep workflows focused
✅ Use secrets for sensitive data
✅ Pin action versions
✅ Add workflow documentation
✅ Test workflows in branches
```

