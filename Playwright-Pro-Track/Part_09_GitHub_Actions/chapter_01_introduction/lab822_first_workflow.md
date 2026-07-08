# Lab 822: First Workflow

## LEARNING CONCEPT

Creating your first GitHub Actions workflow.

## EXERCISE

1. Create a basic workflow
2. Trigger the workflow
3. View results

## SOLUTION

### Create Workflow File

```yaml
# .github/workflows/first-workflow.yml
name: My First Workflow

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  workflow_dispatch:  # Manual trigger

jobs:
  hello:
    name: Say Hello
    runs-on: ubuntu-latest
    
    steps:
      - name: Hello World
        run: echo "Hello, GitHub Actions!"
        
      - name: Show date and time
        run: date
        
      - name: Show runner info
        run: |
          echo "Runner OS: $RUNNER_OS"
          echo "Runner Arch: $RUNNER_ARCH"
```

### Workflow with Checkout

```yaml
name: Build Project

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: List files
        run: ls -la
        
      - name: Show git info
        run: |
          git log -1 --format="%H %s"
          git branch -a
```

### Node.js Workflow

```yaml
name: Node.js CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run linter
        run: npm run lint
        
      - name: Run tests
        run: npm test
        
      - name: Build
        run: npm run build
```

### Python Workflow

```yaml
name: Python CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
          cache: 'pip'
          
      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt
          
      - name: Run tests
        run: pytest
```

### Multi-Job Workflow

```yaml
name: CI Pipeline

on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run lint
      
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm test
      
  build:
    needs: [lint, test]  # Wait for lint and test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run build
```

### Workflow with Environment Variables

```yaml
name: Environment Variables

on: workflow_dispatch

env:
  GREETING: Hello
  
jobs:
  demo:
    runs-on: ubuntu-latest
    env:
      TARGET: World
      
    steps:
      - name: Use env vars
        env:
          PUNCTUATION: "!"
        run: echo "$GREETING, $TARGET$PUNCTUATION"
```

### Workflow with Secrets

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy
        env:
          API_KEY: ${{ secrets.API_KEY }}
          DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN }}
        run: ./deploy.sh
```

### Manual Trigger with Inputs

```yaml
name: Manual Workflow

on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Deployment environment'
        required: true
        default: 'staging'
        type: choice
        options:
          - staging
          - production
      debug:
        description: 'Enable debug mode'
        required: false
        type: boolean
        default: false

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy
        run: |
          echo "Deploying to ${{ inputs.environment }}"
          echo "Debug: ${{ inputs.debug }}"
```

### Viewing Results

```
1. Go to repository on GitHub
2. Click "Actions" tab
3. Select your workflow
4. Click on a run to see details
5. Expand steps to see logs
```

### Best Practices

```
✅ Start simple, add complexity
✅ Use meaningful names
✅ Test in feature branches
✅ Check workflow syntax
✅ Review run logs
✅ Use workflow_dispatch for testing
```

