# Lab 749: Build Parameters

## LEARNING CONCEPT

Using parameters to make builds configurable.

## EXERCISE

1. Define parameters
2. Use parameters in pipeline
3. Trigger parameterized builds

## SOLUTION

### Parameter Types

```
- String
- Text (multi-line)
- Boolean
- Choice
- Password
- File
- Credentials
- Run (build selector)
```

### Declarative Pipeline Parameters

```groovy
pipeline {
    agent any
    
    parameters {
        string(
            name: 'ENVIRONMENT',
            defaultValue: 'staging',
            description: 'Target environment'
        )
        
        text(
            name: 'RELEASE_NOTES',
            defaultValue: '',
            description: 'Release notes'
        )
        
        booleanParam(
            name: 'SKIP_TESTS',
            defaultValue: false,
            description: 'Skip test execution'
        )
        
        choice(
            name: 'BROWSER',
            choices: ['chrome', 'firefox', 'webkit'],
            description: 'Browser for testing'
        )
        
        password(
            name: 'API_KEY',
            defaultValue: '',
            description: 'API key (hidden)'
        )
    }
    
    stages {
        stage('Build') {
            steps {
                echo "Environment: ${params.ENVIRONMENT}"
                echo "Browser: ${params.BROWSER}"
                echo "Skip tests: ${params.SKIP_TESTS}"
            }
        }
    }
}
```

### Using Parameters

```groovy
pipeline {
    agent any
    
    parameters {
        string(name: 'VERSION', defaultValue: '1.0.0')
        choice(name: 'ENV', choices: ['dev', 'staging', 'prod'])
        booleanParam(name: 'DEPLOY', defaultValue: true)
    }
    
    stages {
        stage('Build') {
            steps {
                sh "npm version ${params.VERSION}"
                sh 'npm run build'
            }
        }
        
        stage('Deploy') {
            when {
                expression { params.DEPLOY == true }
            }
            steps {
                sh "./deploy.sh ${params.ENV}"
            }
        }
    }
}
```

### Credentials Parameter

```groovy
pipeline {
    agent any
    
    parameters {
        credentials(
            name: 'DEPLOY_CREDS',
            description: 'Deployment credentials',
            credentialType: 'Username with password',
            required: true
        )
    }
    
    stages {
        stage('Deploy') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: params.DEPLOY_CREDS,
                        usernameVariable: 'USER',
                        passwordVariable: 'PASS'
                    )
                ]) {
                    sh 'deploy --user $USER --pass $PASS'
                }
            }
        }
    }
}
```

### File Parameter

```groovy
pipeline {
    agent any
    
    parameters {
        file(
            name: 'CONFIG_FILE',
            description: 'Configuration file to upload'
        )
    }
    
    stages {
        stage('Process') {
            steps {
                sh 'cat $CONFIG_FILE'
            }
        }
    }
}
```

### Dynamic Parameters (Active Choices)

```groovy
// Requires Active Choices plugin
properties([
    parameters([
        [$class: 'ChoiceParameter',
            name: 'ENVIRONMENT',
            choiceType: 'PT_SINGLE_SELECT',
            script: [
                $class: 'GroovyScript',
                script: [
                    script: '''
                        return ['dev', 'staging', 'prod']
                    '''
                ]
            ]
        ],
        [$class: 'CascadeChoiceParameter',
            name: 'SERVER',
            choiceType: 'PT_SINGLE_SELECT',
            referencedParameters: 'ENVIRONMENT',
            script: [
                $class: 'GroovyScript',
                script: [
                    script: '''
                        if (ENVIRONMENT == 'dev') {
                            return ['dev-server-1', 'dev-server-2']
                        } else if (ENVIRONMENT == 'staging') {
                            return ['staging-server-1']
                        } else {
                            return ['prod-server-1', 'prod-server-2']
                        }
                    '''
                ]
            ]
        ]
    ])
])
```

### Trigger with Parameters

```bash
# Via API
curl -X POST http://jenkins:8080/job/my-job/buildWithParameters \
    --user admin:token \
    --data "ENVIRONMENT=production&BROWSER=chrome&SKIP_TESTS=false"

# Via Jenkins CLI
java -jar jenkins-cli.jar -s http://jenkins:8080/ \
    build my-job -p ENVIRONMENT=production -p BROWSER=chrome
```

### Parameter Validation

```groovy
pipeline {
    agent any
    
    parameters {
        string(name: 'VERSION', defaultValue: '1.0.0')
    }
    
    stages {
        stage('Validate') {
            steps {
                script {
                    if (!params.VERSION.matches(/^\d+\.\d+\.\d+$/)) {
                        error "Invalid version format: ${params.VERSION}"
                    }
                }
            }
        }
    }
}
```

### Best Practices

```
✅ Provide meaningful defaults
✅ Add clear descriptions
✅ Validate parameter values
✅ Use choice for limited options
✅ Use credentials parameter for secrets
✅ Document required parameters
```

