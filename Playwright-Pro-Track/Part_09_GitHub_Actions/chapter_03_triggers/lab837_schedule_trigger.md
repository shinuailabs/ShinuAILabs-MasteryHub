# Lab 837: Schedule Trigger

## LEARNING CONCEPT

Triggering workflows on a schedule using cron.

## EXERCISE

1. Configure scheduled workflows
2. Understand cron syntax
3. Handle scheduled runs

## SOLUTION

### Basic Schedule

```yaml
name: Scheduled Job

on:
  schedule:
    - cron: '0 0 * * *'  # Daily at midnight UTC

jobs:
  daily-task:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Running daily task"
```

### Cron Syntax

```
┌───────────── minute (0 - 59)
│ ┌───────────── hour (0 - 23)
│ │ ┌───────────── day of month (1 - 31)
│ │ │ ┌───────────── month (1 - 12)
│ │ │ │ ┌───────────── day of week (0 - 6, Sunday = 0)
│ │ │ │ │
* * * * *
```

### Common Schedules

```yaml
on:
  schedule:
    # Every hour
    - cron: '0 * * * *'
    
    # Every 6 hours
    - cron: '0 */6 * * *'
    
    # Daily at midnight UTC
    - cron: '0 0 * * *'
    
    # Daily at 9 AM UTC
    - cron: '0 9 * * *'
    
    # Weekly on Monday at 9 AM UTC
    - cron: '0 9 * * 1'
    
    # Monthly on 1st at midnight
    - cron: '0 0 1 * *'
```

### Multiple Schedules

```yaml
on:
  schedule:
    # Weekdays at 9 AM UTC
    - cron: '0 9 * * 1-5'
    # Weekends at noon UTC
    - cron: '0 12 * * 0,6'
```

### Schedule with Other Triggers

```yaml
on:
  schedule:
    - cron: '0 0 * * *'
  workflow_dispatch:  # Allow manual trigger
  push:
    branches: [main]
```

### Checking Trigger Type

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Check trigger
        run: |
          if [ "${{ github.event_name }}" == "schedule" ]; then
            echo "Running on schedule"
          else
            echo "Running from ${{ github.event_name }}"
          fi
```

### Scheduled Maintenance

```yaml
name: Maintenance

on:
  schedule:
    - cron: '0 3 * * 0'  # Sunday at 3 AM UTC

jobs:
  cleanup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Clean old artifacts
        run: ./scripts/cleanup-artifacts.sh
        
      - name: Update dependencies
        run: npm update
        
      - name: Run security scan
        run: npm audit
```

### Scheduled Tests

```yaml
name: Nightly Tests

on:
  schedule:
    - cron: '0 2 * * *'  # 2 AM UTC daily

jobs:
  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run test:e2e
      
      - name: Notify on failure
        if: failure()
        run: ./notify-team.sh "Nightly tests failed"
```

### Scheduled Reports

```yaml
name: Weekly Report

on:
  schedule:
    - cron: '0 9 * * 1'  # Monday 9 AM UTC

jobs:
  report:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Generate report
        run: ./scripts/generate-report.sh
        
      - name: Send report
        env:
          EMAIL: ${{ secrets.REPORT_EMAIL }}
        run: ./scripts/send-report.sh
```

### Timezone Considerations

```yaml
# GitHub Actions uses UTC
# Convert your local time to UTC

# Example: 9 AM EST = 2 PM UTC (during standard time)
on:
  schedule:
    - cron: '0 14 * * *'  # 9 AM EST
```

### Handling Delays

```
Note: Scheduled workflows may be delayed during
high load periods. Don't rely on exact timing.

- Minimum interval: 5 minutes
- May be delayed up to 1 hour during peak times
- Runs on default branch only
```

### Complete Example

```yaml
name: Scheduled Tasks

on:
  schedule:
    - cron: '0 0 * * *'  # Daily
    - cron: '0 9 * * 1'  # Weekly Monday
  workflow_dispatch:

jobs:
  daily:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Daily health check
        run: ./scripts/health-check.sh
        
      - name: Update cache
        run: ./scripts/update-cache.sh
        
  weekly:
    runs-on: ubuntu-latest
    if: github.event.schedule == '0 9 * * 1'
    steps:
      - uses: actions/checkout@v4
      
      - name: Weekly report
        run: ./scripts/weekly-report.sh
```

### Best Practices

```
✅ Use UTC for all schedules
✅ Add workflow_dispatch for testing
✅ Don't rely on exact timing
✅ Handle failures gracefully
✅ Document schedule purpose
```

