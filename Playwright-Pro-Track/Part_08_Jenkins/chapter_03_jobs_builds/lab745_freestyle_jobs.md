# Lab 745: Freestyle Jobs

## LEARNING CONCEPT

Creating and configuring freestyle jobs in Jenkins.

## EXERCISE

1. Create freestyle job
2. Configure build steps
3. Set up post-build actions

## SOLUTION

### Create Freestyle Job

```
1. Dashboard → New Item
2. Enter job name: my-freestyle-job
3. Select "Freestyle project"
4. Click OK
```

### General Configuration

```
General:
□ Discard old builds
  - Days to keep builds: 30
  - Max # of builds to keep: 10

□ GitHub project
  - Project url: https://github.com/user/repo

□ This project is parameterized
  - Add parameters as needed
```

### Source Code Management

```
Git:
  Repository URL: https://github.com/user/repo.git
  Credentials: github-credentials
  Branches to build: */main
  
Additional Behaviors:
  - Clean before checkout
  - Checkout to a sub-directory
```

### Build Triggers

```
□ Build periodically
  Schedule: H 2 * * *  (Daily at 2 AM)

□ Poll SCM
  Schedule: H/5 * * * *  (Every 5 minutes)

□ GitHub hook trigger for GITScm polling
  (Requires webhook configuration)

□ Build after other projects are built
  Projects to watch: upstream-job
```

### Build Environment

```
□ Delete workspace before build starts
□ Add timestamps to the Console Output
□ Use secret text(s) or file(s)
  - Bindings: Add credentials
□ Abort the build if it's stuck
  - Timeout: 30 minutes
```

### Build Steps

```
Execute shell:
#!/bin/bash
set -e

echo "Installing dependencies..."
npm ci

echo "Running build..."
npm run build

echo "Running tests..."
npm test
```

### Windows Build Step

```
Execute Windows batch command:
@echo off

echo Installing dependencies...
call npm ci

echo Running build...
call npm run build

echo Running tests...
call npm test
```

### Multiple Build Steps

```
Build Steps:
1. Execute shell: npm ci
2. Execute shell: npm run build
3. Execute shell: npm test
4. Execute shell: npm run lint
```

### Post-Build Actions

```
□ Archive the artifacts
  Files to archive: dist/**/*

□ Publish JUnit test result report
  Test report XMLs: test-results/*.xml

□ Publish HTML reports
  HTML directory: coverage
  Index page: index.html
  Report title: Coverage Report

□ E-mail Notification
  Recipients: team@example.com
  Send e-mail for every unstable build: ✓

□ Build other projects
  Projects to build: downstream-job
  Trigger only if build is stable: ✓
```

### Parameterized Build

```
Parameters:
1. String Parameter
   Name: ENVIRONMENT
   Default Value: staging
   Description: Target environment

2. Choice Parameter
   Name: BROWSER
   Choices: chrome, firefox, webkit
   Description: Browser for testing

3. Boolean Parameter
   Name: SKIP_TESTS
   Default: false
   Description: Skip test execution
```

### Using Parameters

```bash
#!/bin/bash
echo "Deploying to: $ENVIRONMENT"
echo "Using browser: $BROWSER"

if [ "$SKIP_TESTS" = "false" ]; then
    npm test
fi
```

### Build Triggers via URL

```
# Trigger build
curl -X POST http://jenkins:8080/job/my-job/build \
    --user admin:token

# Trigger with parameters
curl -X POST http://jenkins:8080/job/my-job/buildWithParameters \
    --user admin:token \
    --data "ENVIRONMENT=production&BROWSER=chrome"
```

### Best Practices

```
✅ Use meaningful job names
✅ Configure build retention
✅ Add descriptions
✅ Use credentials for secrets
✅ Archive important artifacts
✅ Set up notifications
✅ Consider migrating to Pipeline
```

