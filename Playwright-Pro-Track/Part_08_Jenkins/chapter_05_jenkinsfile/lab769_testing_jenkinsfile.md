# Lab 769: Testing Jenkinsfile

## LEARNING CONCEPT

Testing and validating Jenkinsfile before deployment.

## EXERCISE

1. Validate Jenkinsfile syntax
2. Use Jenkins Pipeline Unit
3. Test locally

## SOLUTION

### Validate Syntax via CLI

```bash
# Using Jenkins CLI
java -jar jenkins-cli.jar -s http://jenkins:8080/ \
    -auth admin:token \
    declarative-linter < Jenkinsfile

# Output: Jenkinsfile successfully validated.
```

### Validate via API

```bash
# Using curl
curl -X POST \
    -F "jenkinsfile=<Jenkinsfile" \
    http://jenkins:8080/pipeline-model-converter/validate \
    --user admin:token

# With authentication
CRUMB=$(curl -s 'http://jenkins:8080/crumbIssuer/api/xml?xpath=concat(//crumbRequestField,":",//crumb)' \
    --user admin:token)

curl -X POST \
    -H "$CRUMB" \
    -F "jenkinsfile=<Jenkinsfile" \
    http://jenkins:8080/pipeline-model-converter/validate \
    --user admin:token
```

### Jenkins Pipeline Unit Testing

```groovy
// test/JenkinsfileTest.groovy
import com.lesfurets.jenkins.unit.BasePipelineTest
import org.junit.Before
import org.junit.Test

class JenkinsfileTest extends BasePipelineTest {
    
    @Override
    @Before
    void setUp() throws Exception {
        super.setUp()
        
        // Mock environment variables
        binding.setVariable('env', [
            BUILD_NUMBER: '42',
            BRANCH_NAME: 'main'
        ])
        
        // Mock credentials
        helper.registerAllowedMethod('credentials', [String]) { id ->
            return "mocked-${id}"
        }
    }
    
    @Test
    void testPipeline() {
        // Load and run Jenkinsfile
        def script = loadScript('Jenkinsfile')
        script.run()
        
        // Verify stages were called
        assertJobStatusSuccess()
    }
    
    @Test
    void testBuildStage() {
        def script = loadScript('Jenkinsfile')
        script.run()
        
        // Verify sh commands
        assertThat(helper.callStack.findAll { it.methodName == 'sh' })
            .hasSize(3)
    }
}
```

### Setup Pipeline Unit

```groovy
// build.gradle
plugins {
    id 'groovy'
}

repositories {
    mavenCentral()
}

dependencies {
    testImplementation 'com.lesfurets:jenkins-pipeline-unit:1.9'
    testImplementation 'junit:junit:4.13.2'
}

sourceSets {
    test {
        groovy {
            srcDirs = ['test']
        }
    }
}
```

### Mock Steps

```groovy
class JenkinsfileTest extends BasePipelineTest {
    
    @Before
    void setUp() {
        super.setUp()
        
        // Mock sh step
        helper.registerAllowedMethod('sh', [String]) { cmd ->
            println "Executing: ${cmd}"
            return 0
        }
        
        // Mock sh with map
        helper.registerAllowedMethod('sh', [Map]) { params ->
            if (params.returnStdout) {
                return 'mocked output'
            }
            return params.returnStatus ? 0 : null
        }
        
        // Mock docker
        helper.registerAllowedMethod('docker', [Map, Closure]) { params, body ->
            body()
        }
        
        // Mock withCredentials
        helper.registerAllowedMethod('withCredentials', [List, Closure]) { creds, body ->
            body()
        }
        
        // Mock slackSend
        helper.registerAllowedMethod('slackSend', [Map]) { params ->
            println "Slack: ${params.message}"
        }
    }
}
```

### Test Shared Library

```groovy
// test/vars/BuildAppTest.groovy
import com.lesfurets.jenkins.unit.BasePipelineTest
import org.junit.Before
import org.junit.Test

class BuildAppTest extends BasePipelineTest {
    
    @Before
    void setUp() {
        super.setUp()
        
        // Add vars to script roots
        scriptRoots += 'vars'
    }
    
    @Test
    void testBuildApp() {
        def script = loadScript('vars/buildApp.groovy')
        script.call(appName: 'test-app')
        
        assertJobStatusSuccess()
    }
}
```

### Local Testing with Docker

```bash
# Run Jenkins locally
docker run -d \
    --name jenkins-test \
    -p 8080:8080 \
    -v $(pwd):/workspace \
    jenkins/jenkins:lts

# Copy Jenkinsfile and test
docker exec jenkins-test cat /workspace/Jenkinsfile
```

### Replay Feature

```
1. Go to build page
2. Click "Replay"
3. Edit Jenkinsfile
4. Run modified pipeline
5. If successful, commit changes
```

### Blue Ocean Editor

```
1. Open Blue Ocean
2. Click "Edit" on pipeline
3. Visual pipeline editor
4. Save changes to repository
```

### Jenkinsfile Linting Script

```bash
#!/bin/bash
# lint-jenkinsfile.sh

JENKINS_URL=${JENKINS_URL:-http://localhost:8080}
JENKINS_USER=${JENKINS_USER:-admin}
JENKINS_TOKEN=${JENKINS_TOKEN:-token}

for file in $(find . -name "Jenkinsfile*"); do
    echo "Validating: $file"
    
    result=$(curl -s -X POST \
        -F "jenkinsfile=<$file" \
        "$JENKINS_URL/pipeline-model-converter/validate" \
        --user "$JENKINS_USER:$JENKINS_TOKEN")
    
    if echo "$result" | grep -q "successfully validated"; then
        echo "✅ $file is valid"
    else
        echo "❌ $file has errors:"
        echo "$result"
        exit 1
    fi
done

echo "All Jenkinsfiles validated successfully!"
```

### Pre-commit Hook

```bash
#!/bin/bash
# .git/hooks/pre-commit

# Find modified Jenkinsfiles
files=$(git diff --cached --name-only | grep -E "Jenkinsfile")

if [ -n "$files" ]; then
    echo "Validating Jenkinsfiles..."
    ./lint-jenkinsfile.sh $files
    
    if [ $? -ne 0 ]; then
        echo "Jenkinsfile validation failed!"
        exit 1
    fi
fi
```

### Best Practices

```
✅ Validate before committing
✅ Use Pipeline Unit for complex logic
✅ Test shared libraries
✅ Use Replay for quick iterations
✅ Set up pre-commit hooks
✅ Document test cases
```

