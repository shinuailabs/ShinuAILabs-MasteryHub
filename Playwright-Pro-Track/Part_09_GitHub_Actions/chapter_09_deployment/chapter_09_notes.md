# Part 09: Deployment

## 📚 Overview
GitHub Actions enables automated deployments with environment protection and approval workflows.

---

## 🎯 Key Concepts

### 1. Basic Deployment

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
      - run: npm ci
      - run: npm run build
      - name: Deploy
        run: ./deploy.sh
```

### 2. Environment Protection

```yaml
jobs:
  deploy-staging:
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/checkout@v4
      - run: ./deploy.sh staging

  deploy-production:
    runs-on: ubuntu-latest
    environment: production  # Requires approval
    needs: deploy-staging
    steps:
      - uses: actions/checkout@v4
      - run: ./deploy.sh production
```

### 3. Environment URLs

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://example.com
    steps:
      - uses: actions/checkout@v4
      - run: ./deploy.sh
```

### 4. Deploy After Tests

```yaml
name: CI/CD

on:
  push:
    branches: [main]

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
      - run: npx playwright test
      - uses: actions/upload-artifact@v4
        with:
          name: build
          path: dist/

  deploy:
    needs: test
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: build
          path: dist/
      - run: ./deploy.sh
```

### 5. Multi-Environment Pipeline

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm test

  deploy-dev:
    needs: test
    runs-on: ubuntu-latest
    environment: development
    steps:
      - uses: actions/checkout@v4
      - run: ./deploy.sh dev

  e2e-dev:
    needs: deploy-dev
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npx playwright install --with-deps
      - env:
          BASE_URL: https://dev.example.com
        run: npx playwright test

  deploy-staging:
    needs: e2e-dev
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/checkout@v4
      - run: ./deploy.sh staging

  deploy-production:
    needs: deploy-staging
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
      - run: ./deploy.sh production
```

### 6. Rollback Strategy

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy
        id: deploy
        run: ./deploy.sh
        
      - name: Smoke test
        id: smoke
        run: curl -f https://example.com/health
        
      - name: Rollback on failure
        if: failure() && steps.deploy.outcome == 'success'
        run: ./rollback.sh
```

### 7. Blue-Green Deployment

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to blue
        run: ./deploy.sh blue
        
      - name: Test blue
        run: |
          npx playwright test --config=smoke.config.ts
        env:
          BASE_URL: https://blue.example.com
          
      - name: Switch traffic
        run: ./switch-traffic.sh blue
        
      - name: Cleanup green
        run: ./cleanup.sh green
```

### 8. Vercel Deployment

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### 9. AWS Deployment

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
      
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
          
      - name: Deploy to S3
        run: aws s3 sync dist/ s3://my-bucket/
        
      - name: Invalidate CloudFront
        run: |
          aws cloudfront create-invalidation \
            --distribution-id ${{ secrets.CF_DISTRIBUTION_ID }} \
            --paths "/*"
```

---

## 💻 Practice Exercises

1. Set up environment protection
2. Create multi-stage pipeline
3. Implement rollback
4. Deploy to cloud provider
5. Add smoke tests

---

## ✅ Best Practices

- ✅ Use environment protection
- ✅ Run tests before deploy
- ✅ Implement rollback
- ✅ Add smoke tests
- ❌ Don't skip approvals
- ❌ Avoid direct production deploys

---

## 📝 Quick Reference

```yaml
# Environment
environment:
  name: production
  url: https://example.com

# Needs (dependencies)
needs: [test, build]

# Conditional
if: github.ref == 'refs/heads/main'

# After failure
if: failure()

# Environment secrets
${{ secrets.DEPLOY_KEY }}
```

