# Lab 891: Deployment History

## LEARNING CONCEPT

Tracking and managing deployment history.

## EXERCISE

1. View deployment history
2. Track deployment status
3. Implement rollback strategies

## SOLUTION

### Viewing Deployment History

```
Access deployment history:

1. Go to repository
2. Click "Deployments" (right sidebar)
3. Or: Code > Environments > [env]
4. View all deployments
```

### Deployment Information

```
Each deployment shows:
- Status (success, failure, pending)
- Environment name
- Commit SHA
- Timestamp
- Actor (who triggered)
- Workflow run link
```

### Deployment Status API

```yaml
- name: Get deployments
  uses: actions/github-script@v7
  with:
    script: |
      const deployments = await github.rest.repos.listDeployments({
        owner: context.repo.owner,
        repo: context.repo.repo,
        environment: 'production',
        per_page: 10
      });
      
      for (const d of deployments.data) {
        console.log(`${d.sha.substring(0, 7)} - ${d.created_at}`);
      }
```

### Create Deployment

```yaml
- name: Create deployment
  uses: actions/github-script@v7
  id: deployment
  with:
    script: |
      const deployment = await github.rest.repos.createDeployment({
        owner: context.repo.owner,
        repo: context.repo.repo,
        ref: context.sha,
        environment: 'production',
        auto_merge: false,
        required_contexts: []
      });
      return deployment.data.id;
```

### Update Deployment Status

```yaml
- name: Set deployment status
  uses: actions/github-script@v7
  with:
    script: |
      await github.rest.repos.createDeploymentStatus({
        owner: context.repo.owner,
        repo: context.repo.repo,
        deployment_id: ${{ steps.deployment.outputs.result }},
        state: 'success',
        environment_url: 'https://myapp.com',
        log_url: '${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}'
      });
```

### Deployment States

```
Available states:
- pending
- in_progress
- queued
- success
- failure
- error
- inactive
```

### Track Active Deployment

```yaml
- name: Get active deployment
  uses: actions/github-script@v7
  with:
    script: |
      const deployments = await github.rest.repos.listDeployments({
        owner: context.repo.owner,
        repo: context.repo.repo,
        environment: 'production'
      });
      
      for (const d of deployments.data) {
        const statuses = await github.rest.repos.listDeploymentStatuses({
          owner: context.repo.owner,
          repo: context.repo.repo,
          deployment_id: d.id
        });
        
        const latest = statuses.data[0];
        if (latest && latest.state === 'success') {
          console.log(`Active: ${d.sha}`);
          return d.sha;
        }
      }
```

### Rollback Strategy

```yaml
name: Rollback

on:
  workflow_dispatch:
    inputs:
      commit:
        description: 'Commit SHA to rollback to'
        required: true

jobs:
  rollback:
    runs-on: ubuntu-latest
    environment: production
    
    steps:
      - uses: actions/checkout@v4
        with:
          ref: ${{ github.event.inputs.commit }}
          
      - run: npm run build
      - run: ./deploy.sh
```

### Automatic Rollback

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    
    steps:
      - uses: actions/checkout@v4
      - run: npm run build
      
      - name: Deploy
        id: deploy
        run: ./deploy.sh
        continue-on-error: true
        
      - name: Health check
        id: health
        run: |
          for i in {1..5}; do
            if curl -sf https://myapp.com/health; then
              echo "healthy=true" >> $GITHUB_OUTPUT
              exit 0
            fi
            sleep 10
          done
          echo "healthy=false" >> $GITHUB_OUTPUT
          
      - name: Rollback
        if: steps.health.outputs.healthy == 'false'
        run: |
          echo "Deployment unhealthy, rolling back..."
          ./rollback.sh
```

### Deployment Summary

```yaml
- name: Deployment summary
  run: |
    echo "## Deployment Complete" >> $GITHUB_STEP_SUMMARY
    echo "" >> $GITHUB_STEP_SUMMARY
    echo "| Property | Value |" >> $GITHUB_STEP_SUMMARY
    echo "|----------|-------|" >> $GITHUB_STEP_SUMMARY
    echo "| Environment | production |" >> $GITHUB_STEP_SUMMARY
    echo "| Commit | ${{ github.sha }} |" >> $GITHUB_STEP_SUMMARY
    echo "| URL | https://myapp.com |" >> $GITHUB_STEP_SUMMARY
    echo "| Time | $(date) |" >> $GITHUB_STEP_SUMMARY
```

### Complete Example

```yaml
name: Deploy with History

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://myapp.com
      
    steps:
      - uses: actions/checkout@v4
      
      - name: Get previous deployment
        id: previous
        uses: actions/github-script@v7
        with:
          script: |
            const deployments = await github.rest.repos.listDeployments({
              owner: context.repo.owner,
              repo: context.repo.repo,
              environment: 'production',
              per_page: 1
            });
            if (deployments.data.length > 0) {
              return deployments.data[0].sha;
            }
            return '';
            
      - run: npm run build
      
      - name: Deploy
        run: ./deploy.sh
        
      - name: Health check
        id: health
        run: curl -sf https://myapp.com/health
        continue-on-error: true
        
      - name: Rollback if unhealthy
        if: steps.health.outcome == 'failure' && steps.previous.outputs.result != ''
        run: |
          git checkout ${{ steps.previous.outputs.result }}
          npm run build
          ./deploy.sh
```

### Best Practices

```
✅ Track all deployments
✅ Implement health checks
✅ Plan rollback strategy
✅ Keep deployment history
✅ Document deployment process
```

