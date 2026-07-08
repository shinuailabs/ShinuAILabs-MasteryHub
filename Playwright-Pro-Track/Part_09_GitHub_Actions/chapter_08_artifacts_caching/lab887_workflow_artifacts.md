# Lab 887: Workflow Artifacts

## LEARNING CONCEPT

Sharing artifacts between workflow runs.

## EXERCISE

1. Share artifacts across workflows
2. Access artifacts from other runs
3. Implement artifact-based pipelines

## SOLUTION

### Workflow Run Trigger

```yaml
# Build workflow
name: Build

on: push

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm run build
      
      - uses: actions/upload-artifact@v4
        with:
          name: build
          path: dist/
```

```yaml
# Deploy workflow
name: Deploy

on:
  workflow_run:
    workflows: ["Build"]
    types: [completed]

jobs:
  deploy:
    if: github.event.workflow_run.conclusion == 'success'
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: build
          github-token: ${{ secrets.GITHUB_TOKEN }}
          run-id: ${{ github.event.workflow_run.id }}
          
      - run: ./deploy.sh
```

### Download from Specific Run

```yaml
- uses: actions/download-artifact@v4
  with:
    name: build
    github-token: ${{ secrets.GITHUB_TOKEN }}
    repository: ${{ github.repository }}
    run-id: 12345678  # Specific run ID
```

### Find Latest Successful Run

```yaml
- name: Get latest build
  id: latest
  uses: actions/github-script@v7
  with:
    script: |
      const runs = await github.rest.actions.listWorkflowRuns({
        owner: context.repo.owner,
        repo: context.repo.repo,
        workflow_id: 'build.yml',
        status: 'success',
        per_page: 1
      });
      
      if (runs.data.workflow_runs.length > 0) {
        return runs.data.workflow_runs[0].id;
      }
      throw new Error('No successful runs found');
      
- uses: actions/download-artifact@v4
  with:
    name: build
    github-token: ${{ secrets.GITHUB_TOKEN }}
    run-id: ${{ steps.latest.outputs.result }}
```

### Cross-Repository Artifacts

```yaml
- uses: actions/download-artifact@v4
  with:
    name: shared-lib
    github-token: ${{ secrets.PAT }}  # Need PAT for other repos
    repository: org/shared-library
    run-id: ${{ needs.setup.outputs.lib-run-id }}
```

### Artifact Pipeline

```yaml
# Stage 1: Build
name: Build

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with:
          name: build-${{ github.sha }}
          path: dist/
```

```yaml
# Stage 2: Test
name: Test

on:
  workflow_run:
    workflows: ["Build"]
    types: [completed]

jobs:
  test:
    if: github.event.workflow_run.conclusion == 'success'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/download-artifact@v4
        with:
          name: build-${{ github.event.workflow_run.head_sha }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
          run-id: ${{ github.event.workflow_run.id }}
          path: dist/
          
      - run: npm test
```

### List Artifacts from Run

```yaml
- name: List artifacts
  uses: actions/github-script@v7
  with:
    script: |
      const artifacts = await github.rest.actions.listWorkflowRunArtifacts({
        owner: context.repo.owner,
        repo: context.repo.repo,
        run_id: ${{ github.event.workflow_run.id }}
      });
      
      for (const artifact of artifacts.data.artifacts) {
        console.log(`${artifact.name}: ${artifact.size_in_bytes} bytes`);
      }
```

### Conditional Download

```yaml
- name: Check for artifact
  id: check
  uses: actions/github-script@v7
  with:
    script: |
      try {
        const artifacts = await github.rest.actions.listWorkflowRunArtifacts({
          owner: context.repo.owner,
          repo: context.repo.repo,
          run_id: ${{ github.event.workflow_run.id }}
        });
        
        const found = artifacts.data.artifacts.find(a => a.name === 'build');
        return found ? 'true' : 'false';
      } catch {
        return 'false';
      }
      
- uses: actions/download-artifact@v4
  if: steps.check.outputs.result == 'true'
  with:
    name: build
    run-id: ${{ github.event.workflow_run.id }}
```

### Complete Example

```yaml
name: Deploy on Build Success

on:
  workflow_run:
    workflows: ["CI"]
    branches: [main]
    types: [completed]

jobs:
  deploy:
    if: github.event.workflow_run.conclusion == 'success'
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Download build artifact
        uses: actions/download-artifact@v4
        with:
          name: build
          github-token: ${{ secrets.GITHUB_TOKEN }}
          run-id: ${{ github.event.workflow_run.id }}
          path: dist/
          
      - name: Verify artifact
        run: |
          echo "Downloaded files:"
          ls -la dist/
          
      - name: Deploy
        run: ./deploy.sh
        env:
          DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN }}
```

### Best Practices

```
✅ Use workflow_run for pipelines
✅ Include SHA in artifact names
✅ Verify artifacts before use
✅ Handle missing artifacts
✅ Use appropriate tokens
```

