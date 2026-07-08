# Lab 742: Configuration as Code

## LEARNING CONCEPT

Using Jenkins Configuration as Code (JCasC) for reproducible setup.

## EXERCISE

1. Create JCasC configuration
2. Apply configuration
3. Manage configuration changes

## SOLUTION

### Install JCasC Plugin

```
Manage Jenkins → Plugins → Available
Search: Configuration as Code
Install and restart
```

### Basic Configuration

```yaml
# jenkins.yaml
jenkins:
  systemMessage: "Jenkins configured by JCasC"
  numExecutors: 0
  mode: EXCLUSIVE
  
  securityRealm:
    local:
      allowsSignup: false
      users:
        - id: admin
          password: ${JENKINS_ADMIN_PASSWORD}
  
  authorizationStrategy:
    loggedInUsersCanDoAnything:
      allowAnonymousRead: false
```

### Configure Tools

```yaml
tool:
  git:
    installations:
      - name: Default
        home: git
  
  jdk:
    installations:
      - name: JDK17
        properties:
          - installSource:
              installers:
                - adoptOpenJdkInstaller:
                    id: jdk-17.0.1+12
  
  nodejs:
    installations:
      - name: Node18
        properties:
          - installSource:
              installers:
                - nodeJSInstaller:
                    id: "18.19.0"
                    npmPackages: "npm@latest"
```

### Configure Credentials

```yaml
credentials:
  system:
    domainCredentials:
      - credentials:
          - usernamePassword:
              scope: GLOBAL
              id: github-credentials
              username: ${GITHUB_USER}
              password: ${GITHUB_TOKEN}
              description: "GitHub credentials"
          
          - string:
              scope: GLOBAL
              id: slack-token
              secret: ${SLACK_TOKEN}
              description: "Slack notification token"
          
          - basicSSHUserPrivateKey:
              scope: GLOBAL
              id: ssh-key
              username: git
              privateKeySource:
                directEntry:
                  privateKey: ${SSH_PRIVATE_KEY}
```

### Configure Agents

```yaml
jenkins:
  nodes:
    - permanent:
        name: linux-agent
        remoteFS: /home/jenkins
        numExecutors: 2
        labelString: linux docker
        launcher:
          ssh:
            host: 192.168.1.100
            port: 22
            credentialsId: ssh-key
            sshHostKeyVerificationStrategy:
              knownHostsFileKeyVerificationStrategy: {}
```

### Configure Jobs

```yaml
jobs:
  - script: >
      pipelineJob('my-pipeline') {
        definition {
          cpsScm {
            scm {
              git {
                remote {
                  url('https://github.com/user/repo.git')
                  credentials('github-credentials')
                }
                branch('*/main')
              }
            }
            scriptPath('Jenkinsfile')
          }
        }
        triggers {
          scm('H/5 * * * *')
        }
      }
```

### Configure Plugins

```yaml
unclassified:
  location:
    url: http://jenkins.example.com/
    adminAddress: admin@example.com
  
  slackNotifier:
    teamDomain: myteam
    tokenCredentialId: slack-token
    room: "#builds"
  
  gitHubPluginConfig:
    configs:
      - name: GitHub
        apiUrl: https://api.github.com
        credentialsId: github-credentials
```

### Apply Configuration

```
Method 1: UI
Manage Jenkins → Configuration as Code → Apply new configuration

Method 2: Environment Variable
CASC_JENKINS_CONFIG=/path/to/jenkins.yaml

Method 3: Docker
docker run -v ./jenkins.yaml:/var/jenkins_home/casc_configs/jenkins.yaml \
    -e CASC_JENKINS_CONFIG=/var/jenkins_home/casc_configs/jenkins.yaml \
    jenkins/jenkins:lts
```

### Docker Compose with JCasC

```yaml
version: '3.8'
services:
  jenkins:
    image: jenkins/jenkins:lts
    environment:
      - CASC_JENKINS_CONFIG=/var/jenkins_home/casc_configs
      - JENKINS_ADMIN_PASSWORD=admin123
    volumes:
      - ./jenkins.yaml:/var/jenkins_home/casc_configs/jenkins.yaml
      - jenkins_home:/var/jenkins_home

volumes:
  jenkins_home:
```

### Best Practices

```
✅ Version control configuration
✅ Use environment variables for secrets
✅ Test configuration changes
✅ Document configuration
✅ Use separate files for different concerns
```

