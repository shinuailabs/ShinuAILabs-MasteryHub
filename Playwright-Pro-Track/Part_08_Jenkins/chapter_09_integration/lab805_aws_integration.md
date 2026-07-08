# Lab 805: AWS Integration

## LEARNING CONCEPT

Integrating Jenkins with AWS services.

## EXERCISE

1. Configure AWS credentials
2. Deploy to AWS
3. Use AWS services

## SOLUTION

### Install AWS Plugins

```
Manage Jenkins → Plugins → Available
Install:
- AWS Credentials Plugin
- Pipeline: AWS Steps
- Amazon ECR Plugin
```

### Configure AWS Credentials

```
Manage Jenkins → Credentials → System → Global credentials

Kind: AWS Credentials
ID: aws-credentials
Access Key ID: AKIA...
Secret Access Key: ****
```

### Use AWS Credentials

```groovy
pipeline {
    agent any
    
    environment {
        AWS_DEFAULT_REGION = 'us-east-1'
    }
    
    stages {
        stage('Deploy to S3') {
            steps {
                withAWS(credentials: 'aws-credentials', region: 'us-east-1') {
                    sh 'aws s3 sync dist/ s3://my-bucket/'
                }
            }
        }
    }
}
```

### Deploy to S3

```groovy
pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
                sh 'npm ci'
                sh 'npm run build'
            }
        }
        
        stage('Deploy to S3') {
            steps {
                withAWS(credentials: 'aws-credentials', region: 'us-east-1') {
                    s3Upload(
                        bucket: 'my-website-bucket',
                        path: '',
                        includePathPattern: 'dist/**/*',
                        workingDir: 'dist'
                    )
                }
            }
        }
        
        stage('Invalidate CloudFront') {
            steps {
                withAWS(credentials: 'aws-credentials', region: 'us-east-1') {
                    cfInvalidate(
                        distribution: 'E1234567890ABC',
                        paths: ['/*']
                    )
                }
            }
        }
    }
}
```

### Push to ECR

```groovy
pipeline {
    agent any
    
    environment {
        AWS_ACCOUNT_ID = '123456789012'
        AWS_REGION = 'us-east-1'
        ECR_REPO = 'my-app'
        IMAGE_TAG = "${env.BUILD_NUMBER}"
    }
    
    stages {
        stage('Build Image') {
            steps {
                sh "docker build -t ${ECR_REPO}:${IMAGE_TAG} ."
            }
        }
        
        stage('Push to ECR') {
            steps {
                withAWS(credentials: 'aws-credentials', region: AWS_REGION) {
                    sh '''
                        aws ecr get-login-password --region ${AWS_REGION} | \
                            docker login --username AWS --password-stdin \
                            ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
                        
                        docker tag ${ECR_REPO}:${IMAGE_TAG} \
                            ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO}:${IMAGE_TAG}
                        
                        docker push \
                            ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO}:${IMAGE_TAG}
                    '''
                }
            }
        }
    }
}
```

### Deploy to ECS

```groovy
stage('Deploy to ECS') {
    steps {
        withAWS(credentials: 'aws-credentials', region: 'us-east-1') {
            sh '''
                aws ecs update-service \
                    --cluster my-cluster \
                    --service my-service \
                    --force-new-deployment
            '''
        }
    }
}
```

### Deploy to Lambda

```groovy
stage('Deploy Lambda') {
    steps {
        withAWS(credentials: 'aws-credentials', region: 'us-east-1') {
            sh '''
                zip -r function.zip .
                
                aws lambda update-function-code \
                    --function-name my-function \
                    --zip-file fileb://function.zip
            '''
        }
    }
}
```

### Use AWS Secrets Manager

```groovy
stage('Get Secrets') {
    steps {
        withAWS(credentials: 'aws-credentials', region: 'us-east-1') {
            script {
                def secret = sh(
                    script: '''
                        aws secretsmanager get-secret-value \
                            --secret-id my-secret \
                            --query SecretString \
                            --output text
                    ''',
                    returnStdout: true
                ).trim()
                
                // Use secret (be careful not to log it)
            }
        }
    }
}
```

### Deploy with CloudFormation

```groovy
stage('Deploy Stack') {
    steps {
        withAWS(credentials: 'aws-credentials', region: 'us-east-1') {
            cfnUpdate(
                stack: 'my-stack',
                file: 'cloudformation/template.yaml',
                params: ['Environment=production'],
                timeoutInMinutes: 30
            )
        }
    }
}
```

### IAM Role for Jenkins

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::my-bucket",
                "arn:aws:s3:::my-bucket/*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "ecr:GetAuthorizationToken",
                "ecr:BatchCheckLayerAvailability",
                "ecr:PutImage",
                "ecr:InitiateLayerUpload",
                "ecr:UploadLayerPart",
                "ecr:CompleteLayerUpload"
            ],
            "Resource": "*"
        }
    ]
}
```

### Best Practices

```
✅ Use IAM roles with least privilege
✅ Rotate credentials regularly
✅ Use AWS Secrets Manager
✅ Tag resources for tracking
✅ Monitor AWS costs
✅ Use CloudFormation for infrastructure
```

