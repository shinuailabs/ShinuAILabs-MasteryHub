# Lab 905: Monitoring and Observability

## LEARNING CONCEPT

Monitoring GitHub Actions workflows.

## EXERCISE

1. Track workflow metrics
2. Set up alerts
3. Analyze workflow performance

## SOLUTION

### Workflow Status Badge

```markdown
![CI](https://github.com/owner/repo/actions/workflows/ci.yml/badge.svg)
![Deploy](https://github.com/owner/repo/actions/workflows/deploy.yml/badge.svg?branch=main)
```

### Job Summary Metrics

```yaml
steps:
  - name: Record metrics
    run: |
      echo "## Workflow Metrics" >> $GITHUB_STEP_SUMMARY
      echo "" >> $GITHUB_STEP_SUMMARY
      echo "| Metric | Value |" >> $GITHUB_STEP_SUMMARY
      echo "|--------|-------|" >> $GITHUB_STEP_SUMMARY
      echo "| Duration | ${{ job.duration }} |" >> $GITHUB_STEP_SUMMARY
      echo "| Status | ${{ job.status }} |" >> $GITHUB_STEP_SUMMARY
```

### Timing Steps

```yaml
steps:
  - name: Start timer
    id: timer
    run: echo "start=$(date +%s)" >> $GITHUB_OUTPUT
    
  - name: Run tests
    run: npm test
    
  - name: Record duration
    run: |
      END=$(date +%s)
      DURATION=$((END - ${{ steps.timer.outputs.start }}))
      echo "Tests took $DURATION seconds"
      echo "test_duration=$DURATION" >> $GITHUB_ENV
```

### Send Metrics to Datadog

```yaml
steps:
  - name: Send metrics
    run: |
      curl -X POST "https://api.datadoghq.com/api/v1/series" \
        -H "Content-Type: application/json" \
        -H "DD-API-KEY: ${{ secrets.DD_API_KEY }}" \
        -d '{
          "series": [{
            "metric": "github.workflow.duration",
            "points": [['"$(date +%s)"', '"$DURATION"']],
            "tags": ["workflow:ci", "repo:${{ github.repository }}"]
          }]
        }'
```

### Slack Notifications

```yaml
jobs:
  notify:
    if: always()
    needs: [build, test, deploy]
    runs-on: ubuntu-latest
    
    steps:
      - name: Notify Slack
        uses: slackapi/slack-github-action@v1
        with:
          payload: |
            {
              "text": "Workflow ${{ github.workflow }} ${{ job.status }}",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "*${{ github.workflow }}* ${{ job.status == 'success' && '✅' || '❌' }}\n<${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}|View Run>"
                  }
                }
              ]
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

### GitHub API Metrics

```yaml
- name: Get workflow metrics
  uses: actions/github-script@v7
  with:
    script: |
      const runs = await github.rest.actions.listWorkflowRuns({
        owner: context.repo.owner,
        repo: context.repo.repo,
        workflow_id: 'ci.yml',
        per_page: 100
      });
      
      let successCount = 0;
      let totalDuration = 0;
      
      for (const run of runs.data.workflow_runs) {
        if (run.conclusion === 'success') successCount++;
        if (run.run_started_at && run.updated_at) {
          const duration = new Date(run.updated_at) - new Date(run.run_started_at);
          totalDuration += duration;
        }
      }
      
      const successRate = (successCount / runs.data.total_count * 100).toFixed(1);
      const avgDuration = (totalDuration / runs.data.total_count / 1000 / 60).toFixed(1);
      
      console.log(`Success rate: ${successRate}%`);
      console.log(`Average duration: ${avgDuration} minutes`);
```

### Failure Alerts

```yaml
jobs:
  alert:
    if: failure()
    runs-on: ubuntu-latest
    
    steps:
      - name: Create issue
        uses: actions/github-script@v7
        with:
          script: |
            await github.rest.issues.create({
              owner: context.repo.owner,
              repo: context.repo.repo,
              title: `Workflow failed: ${context.workflow}`,
              body: `Workflow run failed.\n\n[View run](${context.serverUrl}/${context.repo.owner}/${context.repo.repo}/actions/runs/${context.runId})`,
              labels: ['ci-failure']
            });
```

### Cost Monitoring

```yaml
- name: Estimate cost
  run: |
    # GitHub Actions pricing (example)
    MINUTES=${{ job.duration }}
    COST=$(echo "scale=4; $MINUTES * 0.008" | bc)
    echo "Estimated cost: \$$COST"
```

### Dashboard Summary

```yaml
- name: Generate dashboard
  run: |
    cat >> $GITHUB_STEP_SUMMARY << 'EOF'
    ## CI Dashboard
    
    ### Recent Runs
    | Run | Status | Duration |
    |-----|--------|----------|
    | #${{ github.run_number }} | ${{ job.status }} | ${{ job.duration }}m |
    
    ### Metrics
    - **Success Rate**: 95%
    - **Avg Duration**: 5.2 min
    - **Total Runs**: 1,234
    EOF
```

### Complete Example

```yaml
name: CI with Monitoring

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    outputs:
      duration: ${{ steps.duration.outputs.value }}
      
    steps:
      - name: Start
        id: start
        run: echo "time=$(date +%s)" >> $GITHUB_OUTPUT
        
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm test
      - run: npm run build
      
      - name: Calculate duration
        id: duration
        run: |
          END=$(date +%s)
          DURATION=$((END - ${{ steps.start.outputs.time }}))
          echo "value=$DURATION" >> $GITHUB_OUTPUT
          
  report:
    needs: build
    if: always()
    runs-on: ubuntu-latest
    
    steps:
      - name: Summary
        run: |
          echo "## Build Report" >> $GITHUB_STEP_SUMMARY
          echo "- Status: ${{ needs.build.result }}" >> $GITHUB_STEP_SUMMARY
          echo "- Duration: ${{ needs.build.outputs.duration }}s" >> $GITHUB_STEP_SUMMARY
          
      - name: Notify on failure
        if: needs.build.result == 'failure'
        run: |
          curl -X POST "$SLACK_WEBHOOK" \
            -d '{"text":"Build failed: ${{ github.repository }}"}'
        env:
          SLACK_WEBHOOK: ${{ secrets.SLACK_WEBHOOK }}
```

### Best Practices

```
✅ Track key metrics
✅ Set up failure alerts
✅ Use job summaries
✅ Monitor costs
✅ Review trends regularly
```

