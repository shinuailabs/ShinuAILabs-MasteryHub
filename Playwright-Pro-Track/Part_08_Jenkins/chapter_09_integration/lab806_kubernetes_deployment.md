# Lab 806: Kubernetes Deployment

## LEARNING CONCEPT

Deploying applications to Kubernetes from Jenkins.

## EXERCISE

1. Configure kubectl
2. Deploy to Kubernetes
3. Implement rolling updates

## SOLUTION

### Configure Kubernetes Credentials

```
Manage Jenkins → Credentials → System → Global credentials

Kind: Secret file
ID: kubeconfig
File: Upload kubeconfig file
```

### Basic Deployment

```groovy
pipeline {
    agent any
    
    environment {
        KUBECONFIG = credentials('kubeconfig')
    }
    
    stages {
        stage('Deploy') {
            steps {
                sh 'kubectl apply -f k8s/deployment.yaml'
                sh 'kubectl rollout status deployment/my-app'
            }
        }
    }
}
```

### Deploy with Image Tag

```groovy
pipeline {
    agent any
    
    environment {
        KUBECONFIG = credentials('kubeconfig')
        IMAGE_TAG = "${env.BUILD_NUMBER}"
    }
    
    stages {
        stage('Build Image') {
            steps {
                sh "docker build -t my-registry/my-app:${IMAGE_TAG} ."
                sh "docker push my-registry/my-app:${IMAGE_TAG}"
            }
        }
        
        stage('Deploy') {
            steps {
                sh """
                    kubectl set image deployment/my-app \
                        my-app=my-registry/my-app:${IMAGE_TAG}
                    
                    kubectl rollout status deployment/my-app
                """
            }
        }
    }
}
```

### Deploy with Kustomize

```groovy
pipeline {
    agent any
    
    environment {
        KUBECONFIG = credentials('kubeconfig')
    }
    
    stages {
        stage('Deploy Staging') {
            when { branch 'develop' }
            steps {
                sh 'kubectl apply -k k8s/overlays/staging'
            }
        }
        
        stage('Deploy Production') {
            when { branch 'main' }
            steps {
                sh 'kubectl apply -k k8s/overlays/production'
            }
        }
    }
}
```

### Deploy with Helm

```groovy
pipeline {
    agent any
    
    environment {
        KUBECONFIG = credentials('kubeconfig')
    }
    
    stages {
        stage('Deploy') {
            steps {
                sh '''
                    helm upgrade --install my-app ./helm/my-app \
                        --namespace production \
                        --set image.tag=${BUILD_NUMBER} \
                        --set replicas=3 \
                        --wait
                '''
            }
        }
    }
}
```

### Blue-Green Deployment

```groovy
pipeline {
    agent any
    
    environment {
        KUBECONFIG = credentials('kubeconfig')
    }
    
    stages {
        stage('Deploy Green') {
            steps {
                sh '''
                    kubectl apply -f k8s/deployment-green.yaml
                    kubectl rollout status deployment/my-app-green
                '''
            }
        }
        
        stage('Test Green') {
            steps {
                sh 'kubectl run test --image=curlimages/curl --rm -it --restart=Never -- curl http://my-app-green:8080/health'
            }
        }
        
        stage('Switch Traffic') {
            steps {
                sh '''
                    kubectl patch service my-app \
                        -p '{"spec":{"selector":{"version":"green"}}}'
                '''
            }
        }
        
        stage('Cleanup Blue') {
            steps {
                sh 'kubectl delete deployment my-app-blue || true'
            }
        }
    }
}
```

### Canary Deployment

```groovy
pipeline {
    agent any
    
    environment {
        KUBECONFIG = credentials('kubeconfig')
    }
    
    stages {
        stage('Deploy Canary') {
            steps {
                sh '''
                    kubectl apply -f k8s/deployment-canary.yaml
                    kubectl scale deployment my-app-canary --replicas=1
                '''
            }
        }
        
        stage('Monitor Canary') {
            steps {
                sleep(time: 5, unit: 'MINUTES')
                // Check metrics, errors, etc.
            }
        }
        
        stage('Promote Canary') {
            input {
                message 'Promote canary to production?'
            }
            steps {
                sh '''
                    kubectl set image deployment/my-app \
                        my-app=my-registry/my-app:${BUILD_NUMBER}
                    kubectl delete deployment my-app-canary
                '''
            }
        }
    }
}
```

### Rollback

```groovy
stage('Rollback') {
    when {
        expression { currentBuild.result == 'FAILURE' }
    }
    steps {
        sh 'kubectl rollout undo deployment/my-app'
    }
}
```

### Namespace Management

```groovy
pipeline {
    agent any
    
    environment {
        KUBECONFIG = credentials('kubeconfig')
        NAMESPACE = "${env.BRANCH_NAME == 'main' ? 'production' : 'staging'}"
    }
    
    stages {
        stage('Deploy') {
            steps {
                sh """
                    kubectl create namespace ${NAMESPACE} --dry-run=client -o yaml | kubectl apply -f -
                    kubectl apply -f k8s/ -n ${NAMESPACE}
                """
            }
        }
    }
}
```

### Health Check

```groovy
stage('Health Check') {
    steps {
        timeout(time: 5, unit: 'MINUTES') {
            sh '''
                until kubectl get pods -l app=my-app -o jsonpath='{.items[*].status.phase}' | grep -q Running; do
                    echo "Waiting for pods..."
                    sleep 10
                done
            '''
        }
    }
}
```

### Best Practices

```
✅ Use namespaces for isolation
✅ Implement health checks
✅ Use rolling updates
✅ Have rollback strategy
✅ Monitor deployments
✅ Use GitOps when possible
```

