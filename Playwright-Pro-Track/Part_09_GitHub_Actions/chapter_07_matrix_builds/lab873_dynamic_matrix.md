# Lab 873: Dynamic Matrix

## LEARNING CONCEPT

Generating matrix configurations dynamically.

## EXERCISE

1. Generate matrix from job output
2. Use file-based matrix
3. Create conditional matrix

## SOLUTION

### Basic Dynamic Matrix

```yaml
jobs:
  setup:
    runs-on: ubuntu-latest
    outputs:
      matrix: ${{ steps.set-matrix.outputs.matrix }}
      
    steps:
      - id: set-matrix
        run: |
          echo 'matrix={"node":["18","20","22"]}' >> $GITHUB_OUTPUT
          
  test:
    needs: setup
    strategy:
      matrix: ${{ fromJson(needs.setup.outputs.matrix) }}
      
    runs-on: ubuntu-latest
    steps:
      - run: echo "Node ${{ matrix.node }}"
```

### Matrix from File

```yaml
jobs:
  setup:
    runs-on: ubuntu-latest
    outputs:
      matrix: ${{ steps.set-matrix.outputs.matrix }}
      
    steps:
      - uses: actions/checkout@v4
      
      - id: set-matrix
        run: |
          MATRIX=$(cat .github/matrix.json)
          echo "matrix=$MATRIX" >> $GITHUB_OUTPUT
          
  test:
    needs: setup
    strategy:
      matrix: ${{ fromJson(needs.setup.outputs.matrix) }}
    runs-on: ubuntu-latest
```

```json
// .github/matrix.json
{
  "node": ["18", "20", "22"],
  "os": ["ubuntu-latest", "windows-latest"]
}
```

### Conditional Matrix

```yaml
jobs:
  setup:
    runs-on: ubuntu-latest
    outputs:
      matrix: ${{ steps.set-matrix.outputs.matrix }}
      
    steps:
      - id: set-matrix
        run: |
          if [ "${{ github.event_name }}" == "pull_request" ]; then
            # Minimal matrix for PRs
            echo 'matrix={"node":["20"],"os":["ubuntu-latest"]}' >> $GITHUB_OUTPUT
          else
            # Full matrix for main branch
            echo 'matrix={"node":["18","20","22"],"os":["ubuntu-latest","windows-latest","macos-latest"]}' >> $GITHUB_OUTPUT
          fi
```

### Matrix from Changed Files

```yaml
jobs:
  detect:
    runs-on: ubuntu-latest
    outputs:
      matrix: ${{ steps.set-matrix.outputs.matrix }}
      
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
          
      - id: set-matrix
        run: |
          PACKAGES=()
          
          # Check which packages changed
          if git diff --name-only HEAD~1 | grep -q "^packages/api/"; then
            PACKAGES+=("api")
          fi
          if git diff --name-only HEAD~1 | grep -q "^packages/web/"; then
            PACKAGES+=("web")
          fi
          if git diff --name-only HEAD~1 | grep -q "^packages/cli/"; then
            PACKAGES+=("cli")
          fi
          
          # Create matrix JSON
          MATRIX=$(printf '%s\n' "${PACKAGES[@]}" | jq -R . | jq -s '{package: .}')
          echo "matrix=$MATRIX" >> $GITHUB_OUTPUT
          
  test:
    needs: detect
    if: needs.detect.outputs.matrix != '{"package":[]}'
    strategy:
      matrix: ${{ fromJson(needs.detect.outputs.matrix) }}
    runs-on: ubuntu-latest
    steps:
      - run: npm test --workspace=${{ matrix.package }}
```

### Matrix from Script

```yaml
jobs:
  setup:
    runs-on: ubuntu-latest
    outputs:
      matrix: ${{ steps.set-matrix.outputs.matrix }}
      
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - id: set-matrix
        run: |
          MATRIX=$(node scripts/generate-matrix.js)
          echo "matrix=$MATRIX" >> $GITHUB_OUTPUT
```

```javascript
// scripts/generate-matrix.js
const fs = require('fs');
const path = require('path');

const packages = fs.readdirSync('packages')
  .filter(f => fs.statSync(path.join('packages', f)).isDirectory());

const matrix = {
  package: packages,
  node: ['18', '20']
};

console.log(JSON.stringify(matrix));
```

### Matrix with Include

```yaml
jobs:
  setup:
    runs-on: ubuntu-latest
    outputs:
      matrix: ${{ steps.set-matrix.outputs.matrix }}
      
    steps:
      - id: set-matrix
        run: |
          MATRIX=$(cat << 'EOF'
          {
            "include": [
              {"os": "ubuntu-latest", "node": "18"},
              {"os": "ubuntu-latest", "node": "20", "coverage": true},
              {"os": "windows-latest", "node": "20"}
            ]
          }
          EOF
          )
          echo "matrix=$(echo $MATRIX | jq -c .)" >> $GITHUB_OUTPUT
```

### Empty Matrix Handling

```yaml
jobs:
  setup:
    runs-on: ubuntu-latest
    outputs:
      matrix: ${{ steps.set-matrix.outputs.matrix }}
      has-packages: ${{ steps.set-matrix.outputs.has-packages }}
      
    steps:
      - id: set-matrix
        run: |
          PACKAGES=$(find packages -maxdepth 1 -type d | tail -n +2)
          if [ -z "$PACKAGES" ]; then
            echo "has-packages=false" >> $GITHUB_OUTPUT
            echo 'matrix={"package":[]}' >> $GITHUB_OUTPUT
          else
            echo "has-packages=true" >> $GITHUB_OUTPUT
            MATRIX=$(echo "$PACKAGES" | jq -R . | jq -s '{package: .}')
            echo "matrix=$MATRIX" >> $GITHUB_OUTPUT
          fi
          
  test:
    needs: setup
    if: needs.setup.outputs.has-packages == 'true'
    strategy:
      matrix: ${{ fromJson(needs.setup.outputs.matrix) }}
    runs-on: ubuntu-latest
```

### Complete Example

```yaml
name: Dynamic Matrix CI

on: [push, pull_request]

jobs:
  setup:
    runs-on: ubuntu-latest
    outputs:
      matrix: ${{ steps.matrix.outputs.result }}
      
    steps:
      - uses: actions/checkout@v4
      
      - id: matrix
        uses: actions/github-script@v7
        with:
          script: |
            const isPR = context.eventName === 'pull_request';
            
            const matrix = {
              node: isPR ? ['20'] : ['18', '20', '22'],
              os: isPR ? ['ubuntu-latest'] : ['ubuntu-latest', 'windows-latest']
            };
            
            return matrix;
            
  test:
    needs: setup
    strategy:
      matrix: ${{ fromJson(needs.setup.outputs.matrix) }}
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
      - run: npm test
```

### Best Practices

```
✅ Validate matrix output
✅ Handle empty matrices
✅ Use minimal matrix for PRs
✅ Cache matrix generation
✅ Document matrix logic
```

