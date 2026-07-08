# Lab 823: Workflow Commands

## LEARNING CONCEPT

Using workflow commands to interact with the runner.

## EXERCISE

1. Learn workflow commands
2. Set outputs and variables
3. Use logging commands

## SOLUTION

### Workflow Commands Overview

```
Workflow commands communicate with the runner:
- Set environment variables
- Set output parameters
- Add to PATH
- Debug/warning/error messages
- Group log output
- Mask secrets
```

### Setting Output Parameters

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    outputs:
      version: ${{ steps.version.outputs.version }}
      
    steps:
      - name: Set output
        id: version
        run: echo "version=1.0.0" >> $GITHUB_OUTPUT
        
      - name: Use output
        run: echo "Version is ${{ steps.version.outputs.version }}"
```

### Setting Environment Variables

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Set env var
        run: echo "MY_VAR=hello" >> $GITHUB_ENV
        
      - name: Use env var
        run: echo "MY_VAR is $MY_VAR"
```

### Multi-line Environment Variables

```yaml
steps:
  - name: Set multi-line env
    run: |
      echo "JSON_DATA<<EOF" >> $GITHUB_ENV
      echo '{"key": "value"}' >> $GITHUB_ENV
      echo "EOF" >> $GITHUB_ENV
      
  - name: Use multi-line env
    run: echo "$JSON_DATA"
```

### Adding to PATH

```yaml
steps:
  - name: Add to PATH
    run: echo "/custom/bin" >> $GITHUB_PATH
    
  - name: Use custom path
    run: which custom-tool
```

### Logging Commands

```yaml
steps:
  - name: Logging examples
    run: |
      # Debug message (only shown if debug logging enabled)
      echo "::debug::This is a debug message"
      
      # Notice message
      echo "::notice::This is a notice"
      
      # Warning message
      echo "::warning::This is a warning"
      
      # Error message
      echo "::error::This is an error"
```

### Annotations

```yaml
steps:
  - name: File annotations
    run: |
      # Warning on specific file and line
      echo "::warning file=app.js,line=10,col=5::Missing semicolon"
      
      # Error on specific file
      echo "::error file=test.js,line=20::Test failed"
      
      # Notice with title
      echo "::notice title=Build Info::Build completed successfully"
```

### Grouping Log Output

```yaml
steps:
  - name: Grouped output
    run: |
      echo "::group::Installing dependencies"
      npm ci
      echo "::endgroup::"
      
      echo "::group::Running tests"
      npm test
      echo "::endgroup::"
```

### Masking Values

```yaml
steps:
  - name: Mask sensitive data
    run: |
      SECRET_VALUE="my-secret-123"
      echo "::add-mask::$SECRET_VALUE"
      echo "The secret is $SECRET_VALUE"  # Will show ***
```

### Stop Commands

```yaml
steps:
  - name: Stop processing commands
    run: |
      echo "::stop-commands::pause-token"
      echo "::warning::This won't be processed as a command"
      echo "::pause-token::"
      echo "::warning::This will be processed"
```

### Job Summary

```yaml
steps:
  - name: Add to job summary
    run: |
      echo "## Build Results" >> $GITHUB_STEP_SUMMARY
      echo "" >> $GITHUB_STEP_SUMMARY
      echo "| Test | Result |" >> $GITHUB_STEP_SUMMARY
      echo "|------|--------|" >> $GITHUB_STEP_SUMMARY
      echo "| Unit | ✅ Pass |" >> $GITHUB_STEP_SUMMARY
      echo "| E2E | ✅ Pass |" >> $GITHUB_STEP_SUMMARY
```

### Complete Example

```yaml
name: Workflow Commands Demo

on: workflow_dispatch

jobs:
  demo:
    runs-on: ubuntu-latest
    outputs:
      build-version: ${{ steps.build.outputs.version }}
      
    steps:
      - name: Set version
        id: build
        run: |
          VERSION="1.0.${{ github.run_number }}"
          echo "version=$VERSION" >> $GITHUB_OUTPUT
          echo "BUILD_VERSION=$VERSION" >> $GITHUB_ENV
          
      - name: Build
        run: |
          echo "::group::Building version $BUILD_VERSION"
          echo "Building..."
          echo "::endgroup::"
          
      - name: Report
        run: |
          echo "::notice title=Build Complete::Version $BUILD_VERSION built successfully"
          
          echo "## Build Summary" >> $GITHUB_STEP_SUMMARY
          echo "- Version: $BUILD_VERSION" >> $GITHUB_STEP_SUMMARY
          echo "- Status: ✅ Success" >> $GITHUB_STEP_SUMMARY
```

### Environment Files

```
$GITHUB_OUTPUT   - Set step outputs
$GITHUB_ENV      - Set environment variables
$GITHUB_PATH     - Add to PATH
$GITHUB_STEP_SUMMARY - Add to job summary
```

### Best Practices

```
✅ Use outputs for job communication
✅ Mask sensitive values
✅ Group related log output
✅ Add meaningful annotations
✅ Create helpful job summaries
✅ Use appropriate log levels
```

