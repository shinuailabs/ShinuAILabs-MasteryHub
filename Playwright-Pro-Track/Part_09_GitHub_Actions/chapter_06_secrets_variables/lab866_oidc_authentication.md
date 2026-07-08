# Lab 866: OIDC Authentication

## LEARNING CONCEPT

Using OpenID Connect for secure cloud authentication.

## EXERCISE

1. Configure OIDC provider
2. Authenticate with cloud providers
3. Implement secure workflows

## SOLUTION

### What is OIDC?

```
OpenID Connect (OIDC) allows workflows to:
- Authenticate with cloud providers
- Without storing long-lived credentials
- Using short-lived tokens
- With fine-grained permissions
```

### AWS OIDC Setup

```yaml
# 1. Create IAM Identity Provider in AWS
# Provider URL: https://token.actions.githubusercontent.com
# Audience: sts.amazonaws.com

# 2. Create IAM Role with trust policy
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:owner/repo:*"
        }
      }
    }
  ]
}
```

### AWS Workflow

```yaml
name: AWS Deploy

on: push

permissions:
  id-token: write
  contents: read

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789:role/GitHubActionsRole
          aws-region: us-east-1
          
      - name: Deploy
        run: aws s3 sync ./dist s3://my-bucket
```

### Azure OIDC Setup

```yaml
# 1. Create Azure AD Application
# 2. Add federated credential
# Subject: repo:owner/repo:ref:refs/heads/main

# Workflow
name: Azure Deploy

on: push

permissions:
  id-token: write
  contents: read

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Azure Login
        uses: azure/login@v1
        with:
          client-id: ${{ secrets.AZURE_CLIENT_ID }}
          tenant-id: ${{ secrets.AZURE_TENANT_ID }}
          subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}
          
      - name: Deploy
        run: az webapp deploy --name myapp --src-path ./dist
```

### GCP OIDC Setup

```yaml
# 1. Create Workload Identity Pool
# 2. Create Provider with GitHub issuer
# 3. Grant service account access

name: GCP Deploy

on: push

permissions:
  id-token: write
  contents: read

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Authenticate to GCP
        uses: google-github-actions/auth@v2
        with:
          workload_identity_provider: projects/123/locations/global/workloadIdentityPools/pool/providers/github
          service_account: sa@project.iam.gserviceaccount.com
          
      - name: Deploy to Cloud Run
        uses: google-github-actions/deploy-cloudrun@v2
        with:
          service: my-service
          image: gcr.io/project/image:latest
```

### Required Permissions

```yaml
# Must include id-token permission
permissions:
  id-token: write    # Required for OIDC
  contents: read     # For checkout
```

### Subject Claims

```
Subject claim formats:
- repo:owner/repo:ref:refs/heads/main
- repo:owner/repo:environment:production
- repo:owner/repo:pull_request
- repo:owner/repo:ref:refs/tags/v1.0.0
```

### Environment-Specific OIDC

```yaml
jobs:
  deploy-staging:
    runs-on: ubuntu-latest
    environment: staging
    permissions:
      id-token: write
      contents: read
    steps:
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123:role/StagingRole
          aws-region: us-east-1
          
  deploy-production:
    runs-on: ubuntu-latest
    environment: production
    permissions:
      id-token: write
      contents: read
    steps:
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123:role/ProductionRole
          aws-region: us-east-1
```

### Token Claims

```yaml
# Access token claims in workflow
steps:
  - name: Get OIDC token
    run: |
      TOKEN=$(curl -H "Authorization: bearer $ACTIONS_ID_TOKEN_REQUEST_TOKEN" \
        "$ACTIONS_ID_TOKEN_REQUEST_URL&audience=my-audience" | jq -r '.value')
      echo "Token: $TOKEN"
```

### Security Benefits

```
OIDC advantages:
✅ No long-lived credentials
✅ Automatic token rotation
✅ Fine-grained access control
✅ Audit trail
✅ Reduced secret management
```

### Best Practices

```
✅ Use OIDC over static credentials
✅ Restrict subject claims
✅ Use environment protection
✅ Limit role permissions
✅ Audit access regularly
```

