# Lab 765: Groovy in Jenkinsfile

## LEARNING CONCEPT

Using Groovy scripting in Jenkinsfile.

## EXERCISE

1. Use Groovy syntax
2. Implement logic with script blocks
3. Create helper functions

## SOLUTION

### Script Block

```groovy
pipeline {
    agent any
    
    stages {
        stage('Groovy Example') {
            steps {
                script {
                    // Groovy code here
                    def message = "Hello, Jenkins!"
                    println message
                    
                    // Variables
                    def version = "1.0.0"
                    def buildNumber = env.BUILD_NUMBER
                    
                    // String interpolation
                    echo "Building version ${version}, build #${buildNumber}"
                }
            }
        }
    }
}
```

### Variables and Data Types

```groovy
pipeline {
    agent any
    
    stages {
        stage('Data Types') {
            steps {
                script {
                    // Strings
                    def name = "Jenkins"
                    def greeting = 'Hello'
                    def multiline = """
                        This is a
                        multiline string
                    """
                    
                    // Numbers
                    def count = 10
                    def price = 19.99
                    
                    // Boolean
                    def isEnabled = true
                    
                    // Lists
                    def browsers = ['chrome', 'firefox', 'webkit']
                    echo "First browser: ${browsers[0]}"
                    
                    // Maps
                    def config = [
                        name: 'my-app',
                        version: '1.0.0',
                        port: 3000
                    ]
                    echo "App name: ${config.name}"
                }
            }
        }
    }
}
```

### Conditionals

```groovy
pipeline {
    agent any
    
    stages {
        stage('Conditionals') {
            steps {
                script {
                    def branch = env.BRANCH_NAME
                    
                    // If-else
                    if (branch == 'main') {
                        echo 'Production deployment'
                    } else if (branch == 'develop') {
                        echo 'Staging deployment'
                    } else {
                        echo 'Development build'
                    }
                    
                    // Ternary operator
                    def env = branch == 'main' ? 'production' : 'staging'
                    
                    // Elvis operator
                    def value = env.MY_VAR ?: 'default'
                    
                    // Safe navigation
                    def result = env.OPTIONAL_VAR?.toUpperCase()
                }
            }
        }
    }
}
```

### Loops

```groovy
pipeline {
    agent any
    
    stages {
        stage('Loops') {
            steps {
                script {
                    // Each loop
                    def browsers = ['chrome', 'firefox', 'webkit']
                    browsers.each { browser ->
                        echo "Testing on ${browser}"
                    }
                    
                    // For loop
                    for (int i = 0; i < 3; i++) {
                        echo "Iteration ${i}"
                    }
                    
                    // For-in loop
                    for (browser in browsers) {
                        echo "Browser: ${browser}"
                    }
                    
                    // Times
                    3.times { i ->
                        echo "Count: ${i}"
                    }
                    
                    // Map iteration
                    def config = [a: 1, b: 2, c: 3]
                    config.each { key, value ->
                        echo "${key}: ${value}"
                    }
                }
            }
        }
    }
}
```

### Functions

```groovy
// Define functions outside pipeline
def getVersion() {
    return sh(script: 'cat VERSION', returnStdout: true).trim()
}

def deploy(String environment) {
    echo "Deploying to ${environment}"
    sh "./deploy.sh ${environment}"
}

def notify(String message, String channel = '#builds') {
    slackSend(channel: channel, message: message)
}

pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
                script {
                    def version = getVersion()
                    echo "Building version ${version}"
                }
            }
        }
        
        stage('Deploy') {
            steps {
                script {
                    deploy('staging')
                }
            }
        }
    }
    
    post {
        success {
            script {
                notify('Build succeeded!')
            }
        }
    }
}
```

### Error Handling

```groovy
pipeline {
    agent any
    
    stages {
        stage('Error Handling') {
            steps {
                script {
                    try {
                        sh 'npm test'
                    } catch (Exception e) {
                        echo "Error: ${e.message}"
                        currentBuild.result = 'UNSTABLE'
                    } finally {
                        echo 'Cleanup'
                    }
                    
                    // Throw error
                    if (!fileExists('config.json')) {
                        error 'Config file not found!'
                    }
                }
            }
        }
    }
}
```

### Working with JSON

```groovy
pipeline {
    agent any
    
    stages {
        stage('JSON') {
            steps {
                script {
                    // Parse JSON
                    def jsonText = '{"name": "app", "version": "1.0.0"}'
                    def json = readJSON text: jsonText
                    echo "Name: ${json.name}"
                    
                    // Read JSON file
                    def config = readJSON file: 'package.json'
                    echo "Package: ${config.name}"
                    
                    // Create JSON
                    def data = [
                        name: 'my-app',
                        version: env.BUILD_NUMBER
                    ]
                    writeJSON file: 'build-info.json', json: data
                    
                    // Convert to JSON string
                    def jsonString = groovy.json.JsonOutput.toJson(data)
                }
            }
        }
    }
}
```

### String Operations

```groovy
pipeline {
    agent any
    
    stages {
        stage('Strings') {
            steps {
                script {
                    def text = "Hello, Jenkins!"
                    
                    // Methods
                    echo text.toUpperCase()
                    echo text.toLowerCase()
                    echo text.replace('Jenkins', 'World')
                    echo text.split(',')[0]
                    
                    // Check content
                    if (text.contains('Jenkins')) {
                        echo 'Found Jenkins'
                    }
                    
                    if (text.startsWith('Hello')) {
                        echo 'Starts with Hello'
                    }
                    
                    // Regex
                    if (text ==~ /.*Jenkins.*/) {
                        echo 'Matches pattern'
                    }
                }
            }
        }
    }
}
```

### Best Practices

```
✅ Keep script blocks small
✅ Extract complex logic to functions
✅ Use proper error handling
✅ Avoid blocking operations
✅ Be careful with serialization
✅ Test Groovy code separately
```

