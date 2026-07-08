# Part 01: Jenkins Basics

## 📚 Overview
Jenkins is an open-source automation server for building, testing, and deploying software.

---

## 🎯 Key Concepts

### 1. What is Jenkins?

```
Jenkins = Continuous Integration/Continuous Delivery Server
- Automates build, test, and deployment
- Extensible with plugins
- Supports distributed builds
- Pipeline as code
- Open source and free
```

### 2. Installation

```bash
# macOS with Homebrew
brew install jenkins-lts
brew services start jenkins-lts

# Docker
docker run -d -p 8080:8080 -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  jenkins/jenkins:lts

# Access Jenkins
# http://localhost:8080
# Get initial password: cat /var/jenkins_home/secrets/initialAdminPassword
```

### 3. Jenkins Architecture

```
┌─────────────────────────────────────┐
│         Jenkins Controller          │
│    (Manages jobs, UI, scheduling)   │
└─────────────────┬───────────────────┘
                  │
    ┌─────────────┼─────────────┐
    │             │             │
┌───▼───┐    ┌───▼───┐    ┌───▼───┐
│ Agent │    │ Agent │    │ Agent │
│  (1)  │    │  (2)  │    │  (3)  │
└───────┘    └───────┘    └───────┘
```

### 4. Key Concepts

```
Job/Project: A task Jenkins executes
Build: Single execution of a job
Pipeline: Series of steps for CI/CD
Stage: Logical grouping of steps
Step: Single task in a pipeline
Agent: Machine that runs builds
Workspace: Directory for build files
Artifact: Files produced by build
```

### 5. Creating a Freestyle Job

```
1. Click "New Item"
2. Enter job name
3. Select "Freestyle project"
4. Configure:
   - Source Code Management (Git)
   - Build Triggers
   - Build Steps
   - Post-build Actions
5. Save and Build
```

### 6. Build Triggers

```
# Poll SCM - Check for changes periodically
H/5 * * * *  # Every 5 minutes

# Build periodically
H 0 * * *    # Daily at midnight

# GitHub webhook
# Triggered on push events

# Upstream job
# Triggered when another job completes
```

### 7. Build Steps

```bash
# Execute shell
#!/bin/bash
npm install
npm test

# Windows batch command
npm install
npm test

# Invoke Gradle/Maven
# Use built-in build tools
```

### 8. Environment Variables

```bash
# Built-in variables
echo "Build Number: $BUILD_NUMBER"
echo "Job Name: $JOB_NAME"
echo "Workspace: $WORKSPACE"
echo "Build URL: $BUILD_URL"

# Custom variables
# Set in job configuration
echo "Custom: $MY_VARIABLE"
```

### 9. Post-Build Actions

```
# Archive artifacts
**/test-results/*.xml
**/playwright-report/**

# Publish test results
**/junit.xml

# Email notification
# Send on failure/success

# Trigger other jobs
# Build downstream projects
```

---

## 💻 Practice Exercises

1. Install Jenkins
2. Create freestyle job
3. Configure build triggers
4. Add build steps
5. Set up post-build actions

---

## ✅ Best Practices

- ✅ Use descriptive job names
- ✅ Configure build triggers
- ✅ Archive important artifacts
- ✅ Set up notifications
- ❌ Don't store secrets in jobs
- ❌ Avoid long-running builds

---

## 📝 Quick Reference

```
# Jenkins URLs
Dashboard: http://localhost:8080
Job: http://localhost:8080/job/name
Build: http://localhost:8080/job/name/123
Console: http://localhost:8080/job/name/123/console

# Environment Variables
$BUILD_NUMBER - Build number
$JOB_NAME - Job name
$WORKSPACE - Workspace path
$GIT_COMMIT - Git commit hash
```

