# Lab 785: Script Security

## LEARNING CONCEPT

Managing script security in Jenkins pipelines.

## EXERCISE

1. Understand script sandbox
2. Approve scripts safely
3. Implement secure scripting

## SOLUTION

### Script Security Plugin

```
Pre-installed plugin:
- Script Security Plugin

Features:
- Groovy sandbox
- Script approval
- Method whitelisting
```

### Groovy Sandbox

```groovy
// Sandboxed pipeline (default)
pipeline {
    agent any
    
    stages {
        stage('Safe Script') {
            steps {
                script {
                    // Safe operations allowed
                    def list = [1, 2, 3]
                    def sum = list.sum()
                    echo "Sum: ${sum}"
                }
            }
        }
    }
}
```

### Script Approval

```
Manage Jenkins → In-process Script Approval

Pending approvals:
- Review each script
- Approve or deny
- Check for malicious code
```

### Approve Methods

```
When sandbox blocks a method:
1. Build fails with RejectedAccessException
2. Go to Script Approval
3. Review the method signature
4. Approve if safe

Example approval:
method java.lang.String toUpperCase
staticMethod java.lang.System getenv java.lang.String
```

### Unsafe Methods

```
Methods requiring approval:
- System.exit()
- Runtime.exec()
- File operations outside workspace
- Network operations
- Reflection
- Class loading
```

### Shared Library Security

```groovy
// Shared library runs outside sandbox by default
// vars/myStep.groovy

def call(Map config) {
    // Has full access
    // Be careful with user input
    
    // Validate input
    if (!config.name?.trim()) {
        error "Name is required"
    }
    
    // Sanitize input
    def safeName = config.name.replaceAll(/[^a-zA-Z0-9-]/, '')
    
    sh "echo ${safeName}"
}
```

### Sandbox Escape Prevention

```groovy
// ❌ Dangerous - don't do this
script {
    def cmd = params.USER_INPUT
    sh cmd  // Command injection!
}

// ✅ Safe - validate and sanitize
script {
    def allowedCommands = ['build', 'test', 'deploy']
    def cmd = params.USER_INPUT
    
    if (cmd in allowedCommands) {
        sh "./scripts/${cmd}.sh"
    } else {
        error "Invalid command: ${cmd}"
    }
}
```

### Input Validation

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
                    // Validate version format
                    if (!(params.VERSION ==~ /^\d+\.\d+\.\d+$/)) {
                        error "Invalid version format"
                    }
                }
            }
        }
    }
}
```

### Secure Shell Commands

```groovy
// ❌ Dangerous
sh "echo ${userInput}"

// ✅ Safe - use single quotes
sh 'echo "${USER_INPUT}"'

// ✅ Safe - use environment
withEnv(["SAFE_INPUT=${sanitizedInput}"]) {
    sh 'echo "$SAFE_INPUT"'
}
```

### Disable Script Console

```
For production:
1. Restrict access to Script Console
2. Use Role-Based Authorization
3. Only admins can run scripts

Manage Jenkins → Security
- Remove "Run Scripts" permission from non-admins
```

### Audit Script Execution

```
Install: Audit Trail Plugin

Log script executions:
- Who ran the script
- What was executed
- When it ran
- Result
```

### Approved Signatures File

```
Location: $JENKINS_HOME/scriptApproval.xml

Contents:
<scriptApproval>
  <approvedSignatures>
    <string>method java.lang.String toUpperCase</string>
    <string>method java.util.List size</string>
  </approvedSignatures>
  <approvedScriptHashes>
    <string>abc123...</string>
  </approvedScriptHashes>
</scriptApproval>
```

### Reset Script Approvals

```bash
# Backup first
cp $JENKINS_HOME/scriptApproval.xml scriptApproval.xml.bak

# Clear approvals
cat > $JENKINS_HOME/scriptApproval.xml << 'EOF'
<?xml version='1.1' encoding='UTF-8'?>
<scriptApproval plugin="script-security">
  <approvedScriptHashes/>
  <approvedSignatures/>
  <aclApprovedSignatures/>
  <approvedClasspathEntries/>
  <pendingScripts/>
  <pendingSignatures/>
  <pendingClasspathEntries/>
</scriptApproval>
EOF

# Restart Jenkins
```

### Security Checklist

```
□ Keep sandbox enabled
□ Review all script approvals
□ Validate user input
□ Sanitize shell commands
□ Restrict Script Console access
□ Audit script execution
□ Regular security reviews
```

### Best Practices

```
✅ Use sandbox for all pipelines
✅ Minimize script approvals
✅ Review approvals carefully
✅ Validate all user input
✅ Use shared libraries for complex logic
✅ Audit script execution
✅ Regular security training
```

