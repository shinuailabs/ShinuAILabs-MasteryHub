# Lab 857: Docker Actions

## LEARNING CONCEPT

Creating Docker-based GitHub Actions.

## EXERCISE

1. Create Docker action
2. Handle inputs and outputs
3. Use custom images

## SOLUTION

### Action Structure

```
my-docker-action/
├── action.yml
├── Dockerfile
├── entrypoint.sh
└── README.md
```

### Action Metadata

```yaml
# action.yml
name: 'Docker Action'
description: 'A Docker-based action'
author: 'Your Name'

inputs:
  name:
    description: 'Name to greet'
    required: true
    default: 'World'
  debug:
    description: 'Enable debug mode'
    required: false
    default: 'false'

outputs:
  result:
    description: 'Action result'

runs:
  using: 'docker'
  image: 'Dockerfile'
  args:
    - ${{ inputs.name }}
    - ${{ inputs.debug }}
```

### Dockerfile

```dockerfile
FROM alpine:3.18

# Install dependencies
RUN apk add --no-cache bash curl jq

# Copy scripts
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Set entrypoint
ENTRYPOINT ["/entrypoint.sh"]
```

### Entrypoint Script

```bash
#!/bin/bash
# entrypoint.sh

set -e

NAME="$1"
DEBUG="$2"

if [ "$DEBUG" = "true" ]; then
    echo "Debug mode enabled"
    set -x
fi

echo "Hello, $NAME!"

# Set output
echo "result=success" >> $GITHUB_OUTPUT
```

### Pre-built Image

```yaml
# action.yml
name: 'Docker Action'
description: 'Use pre-built image'

runs:
  using: 'docker'
  image: 'docker://alpine:3.18'
  entrypoint: '/bin/sh'
  args:
    - '-c'
    - 'echo "Hello from Docker!"'
```

### Complex Dockerfile

```dockerfile
FROM node:20-alpine

# Install additional tools
RUN apk add --no-cache git curl

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source
COPY src/ ./src/
COPY entrypoint.js ./

# Set entrypoint
ENTRYPOINT ["node", "/app/entrypoint.js"]
```

### Node.js Entrypoint

```javascript
// entrypoint.js
const fs = require('fs');

const name = process.argv[2] || 'World';
const outputFile = process.env.GITHUB_OUTPUT;

console.log(`Hello, ${name}!`);

// Write output
fs.appendFileSync(outputFile, `greeting=Hello, ${name}!\n`);
```

### Environment Variables

```yaml
# action.yml
runs:
  using: 'docker'
  image: 'Dockerfile'
  env:
    MY_VAR: 'value'
    GITHUB_TOKEN: ${{ inputs.token }}
```

```bash
#!/bin/bash
# entrypoint.sh

echo "MY_VAR: $MY_VAR"
echo "Token available: ${GITHUB_TOKEN:+yes}"
```

### Volume Mounts

```yaml
# action.yml
runs:
  using: 'docker'
  image: 'Dockerfile'
  args:
    - ${{ inputs.path }}
  # Workspace is automatically mounted at /github/workspace
```

### Multi-stage Build

```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Runtime stage
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
ENTRYPOINT ["node", "dist/index.js"]
```

### Python Docker Action

```dockerfile
FROM python:3.11-slim

COPY requirements.txt /requirements.txt
RUN pip install -r /requirements.txt

COPY entrypoint.py /entrypoint.py

ENTRYPOINT ["python", "/entrypoint.py"]
```

```python
# entrypoint.py
import os
import sys

def main():
    name = sys.argv[1] if len(sys.argv) > 1 else 'World'
    print(f'Hello, {name}!')
    
    # Set output
    output_file = os.environ.get('GITHUB_OUTPUT')
    if output_file:
        with open(output_file, 'a') as f:
            f.write(f'result=success\n')

if __name__ == '__main__':
    main()
```

### Using GitHub Context

```bash
#!/bin/bash
# entrypoint.sh

echo "Repository: $GITHUB_REPOSITORY"
echo "Ref: $GITHUB_REF"
echo "SHA: $GITHUB_SHA"
echo "Actor: $GITHUB_ACTOR"
echo "Workflow: $GITHUB_WORKFLOW"
echo "Event: $GITHUB_EVENT_NAME"

# Read event payload
if [ -f "$GITHUB_EVENT_PATH" ]; then
    echo "Event payload:"
    cat "$GITHUB_EVENT_PATH"
fi
```

### Complete Example

```yaml
# action.yml
name: 'Build and Test'
description: 'Build and test in Docker'

inputs:
  node-version:
    description: 'Node.js version'
    default: '20'
  test-command:
    description: 'Test command'
    default: 'npm test'

outputs:
  coverage:
    description: 'Test coverage'

runs:
  using: 'docker'
  image: 'Dockerfile'
  args:
    - ${{ inputs.test-command }}
  env:
    NODE_VERSION: ${{ inputs.node-version }}
```

### Best Practices

```
✅ Use small base images
✅ Multi-stage builds
✅ Handle signals properly
✅ Set proper permissions
✅ Document requirements
```

