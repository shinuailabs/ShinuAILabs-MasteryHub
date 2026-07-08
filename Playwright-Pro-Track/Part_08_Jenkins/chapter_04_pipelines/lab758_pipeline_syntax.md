# Lab 758: Pipeline Syntax

## LEARNING CONCEPT

Understanding Jenkins pipeline syntax and common patterns.

## EXERCISE

1. Learn step syntax
2. Use built-in steps
3. Master common patterns

## SOLUTION

### Shell Commands

```groovy
// Unix shell
sh 'npm run build'

// Multi-line
sh '''
    npm ci
    npm run build
    npm test
'''

// Return output
def version = sh(script: 'node --version', returnStdout: true).trim()

// Return status
def status = sh(script: 'npm test', returnStatus: true)
if (status != 0) {
    error 'Tests failed'
}

// Windows batch
bat 'npm run build'

// PowerShell
powershell 'npm run build'
```

### File Operations

```groovy
// Write file
writeFile file: 'config.json', text: '{"key": "value"}'

// Read file
def content = readFile file: 'config.json'

// Read JSON
def config = readJSON file: 'config.json'

// Write JSON
writeJSON file: 'output.json', json: [key: 'value']

// Read YAML
def config = readYaml file: 'config.yaml'

// Write YAML
writeYaml file: 'output.yaml', data: [key: 'value']

// Check file exists
def exists = fileExists 'config.json'
```

### Directory Operations

```groovy
// Change directory
dir('subdir') {
    sh 'npm run build'
}

// Delete directory
deleteDir()

// Clean workspace
cleanWs()
```

### Git Operations

```groovy
// Checkout
checkout scm

// Explicit checkout
git url: 'https://github.com/user/repo.git',
    branch: 'main',
    credentialsId: 'github-creds'

// Get commit info
def commit = sh(script: 'git rev-parse HEAD', returnStdout: true).trim()
def branch = sh(script: 'git branch --show-current', returnStdout: true).trim()
```

### Archive and Artifacts

```groovy
// Archive artifacts
archiveArtifacts artifacts: 'dist/**/*', fingerprint: true

// Stash files
stash includes: 'dist/**/*', name: 'build'

// Unstash files
unstash 'build'

// Copy artifacts from another job
copyArtifacts projectName: 'build-job', filter: 'dist/**/*'
```

### Test Results

```groovy
// JUnit results
junit 'test-results/*.xml'

// With options
junit(
    testResults: 'test-results/*.xml',
    allowEmptyResults: true,
    skipPublishingChecks: false
)

// HTML report
publishHTML([
    reportDir: 'coverage',
    reportFiles: 'index.html',
    reportName: 'Coverage Report'
])
```

### Credentials

```groovy
// Username/password
withCredentials([
    usernamePassword(
        credentialsId: 'my-creds',
        usernameVariable: 'USER',
        passwordVariable: 'PASS'
    )
]) {
    sh 'echo $USER'
}

// Secret text
withCredentials([
    string(credentialsId: 'api-token', variable: 'TOKEN')
]) {
    sh 'curl -H "Authorization: $TOKEN" ...'
}

// SSH key
withCredentials([
    sshUserPrivateKey(
        credentialsId: 'ssh-key',
        keyFileVariable: 'KEY_FILE'
    )
]) {
    sh 'ssh -i $KEY_FILE user@host'
}

// File
withCredentials([
    file(credentialsId: 'config-file', variable: 'CONFIG')
]) {
    sh 'cp $CONFIG ./config.json'
}
```

### Environment

```groovy
// Set environment
withEnv(['VAR1=value1', 'VAR2=value2']) {
    sh 'echo $VAR1'
}

// Access environment
echo env.BUILD_NUMBER
echo env.JOB_NAME
echo env.WORKSPACE
```

### Control Flow

```groovy
// Timeout
timeout(time: 10, unit: 'MINUTES') {
    sh 'npm run build'
}

// Retry
retry(3) {
    sh './flaky-script.sh'
}

// Wait until
waitUntil {
    def status = sh(script: 'curl -s -o /dev/null -w "%{http_code}" http://app/health', returnStdout: true)
    return status == '200'
}

// Sleep
sleep time: 30, unit: 'SECONDS'

// Input
def userInput = input message: 'Continue?', ok: 'Yes'
```

### Error Handling

```groovy
// Catch error
catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
    sh 'npm test'
}

// Try-catch in script
script {
    try {
        sh 'npm test'
    } catch (Exception e) {
        echo "Tests failed: ${e.message}"
        currentBuild.result = 'UNSTABLE'
    }
}

// Error
error 'Build failed!'

// Unstable
unstable 'Tests have warnings'
```

### Notifications

```groovy
// Email
mail to: 'team@example.com',
     subject: "Build ${currentBuild.result}",
     body: "Check ${env.BUILD_URL}"

// Slack
slackSend channel: '#builds', message: 'Build complete'
```

### Useful Patterns

```groovy
// Lock resource
lock('deploy-lock') {
    sh './deploy.sh'
}

// Milestone
milestone 1
// Only one build can pass this point

// Build job
build job: 'downstream-job', parameters: [
    string(name: 'VERSION', value: '1.0.0')
]
```

