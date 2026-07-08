# Part 04: Secrets and Variables

## 📚 Overview
GitHub Actions secrets and variables securely manage sensitive data and configuration.

---

## 🎯 Key Concepts

### 1. Repository Secrets

```yaml
# Settings > Secrets and variables > Actions > New repository secret

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run tests
        env:
          API_KEY: ${{ secrets.API_KEY }}
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
        run: npm test
```

### 2. Environment Secrets

```yaml
# Settings > Environments > New environment > Add secret

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
      - name: Deploy
        env:
          DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}
        run: ./deploy.sh
```

### 3. Organization Secrets

```yaml
# Organization Settings > Secrets > New organization secret

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Use org secret
        env:
          ORG_API_KEY: ${{ secrets.ORG_API_KEY }}
        run: echo "Using organization secret"
```

### 4. Repository Variables

```yaml
# Settings > Secrets and variables > Actions > Variables

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Use variable
        env:
          APP_NAME: ${{ vars.APP_NAME }}
          BASE_URL: ${{ vars.BASE_URL }}
        run: |
          echo "App: $APP_NAME"
          echo "URL: $BASE_URL"
```

### 5. Environment Variables

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - name: Use environment variables
        env:
          # Environment-specific variable
          API_URL: ${{ vars.API_URL }}
          # Environment-specific secret
          API_KEY: ${{ secrets.API_KEY }}
        run: npm test
```

### 6. Default Environment Variables

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Show default variables
        run: |
          echo "Repository: $GITHUB_REPOSITORY"
          echo "Branch: $GITHUB_REF_NAME"
          echo "SHA: $GITHUB_SHA"
          echo "Actor: $GITHUB_ACTOR"
          echo "Run ID: $GITHUB_RUN_ID"
          echo "Run Number: $GITHUB_RUN_NUMBER"
```

### 7. Setting Output Variables

```yaml
jobs:
  setup:
    runs-on: ubuntu-latest
    outputs:
      version: ${{ steps.get-version.outputs.version }}
    steps:
      - id: get-version
        run: echo "version=1.0.0" >> $GITHUB_OUTPUT

  build:
    needs: setup
    runs-on: ubuntu-latest
    steps:
      - run: echo "Building version ${{ needs.setup.outputs.version }}"
```

### 8. Playwright Test Credentials

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - run: npm ci
      - run: npx playwright install --with-deps
      
      - name: Run Playwright tests
        env:
          CI: true
          BASE_URL: ${{ vars.BASE_URL }}
          TEST_USER_EMAIL: ${{ secrets.TEST_USER_EMAIL }}
          TEST_USER_PASSWORD: ${{ secrets.TEST_USER_PASSWORD }}
        run: npx playwright test
```

### 9. Masking Secrets

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Generate and mask secret
        run: |
          TOKEN=$(generate-token)
          echo "::add-mask::$TOKEN"
          echo "TOKEN=$TOKEN" >> $GITHUB_ENV
          
      - name: Use masked secret
        run: echo "Token is masked: $TOKEN"
```

### 10. Conditional on Secrets

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    if: ${{ secrets.DEPLOY_KEY != '' }}
    steps:
      - name: Deploy
        env:
          DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}
        run: ./deploy.sh
```

---

## 💻 Practice Exercises

1. Create repository secrets
2. Set up environment secrets
3. Use repository variables
4. Access default variables
5. Pass outputs between jobs

---

## ✅ Best Practices

- ✅ Use secrets for sensitive data
- ✅ Use variables for configuration
- ✅ Use environments for deployment
- ✅ Limit secret access
- ❌ Never log secrets
- ❌ Don't hardcode credentials

---

## 📝 Quick Reference

```yaml
# Secrets
${{ secrets.SECRET_NAME }}

# Variables
${{ vars.VARIABLE_NAME }}

# Default variables
$GITHUB_REPOSITORY
$GITHUB_REF_NAME
$GITHUB_SHA

# Output
echo "key=value" >> $GITHUB_OUTPUT

# Access output
${{ needs.job.outputs.key }}

# Mask value
echo "::add-mask::$VALUE"
```

