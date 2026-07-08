# Lab 845: Job Outputs

## LEARNING CONCEPT

Passing data between jobs using outputs.

## EXERCISE

1. Define job outputs
2. Access outputs in dependent jobs
3. Use outputs for conditional logic

## SOLUTION

### Basic Job Output

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    outputs:
      version: ${{ steps.version.outputs.version }}
      
    steps:
      - name: Get version
        id: version
        run: echo "version=1.0.0" >> $GITHUB_OUTPUT
        
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - run: echo "Version: ${{ needs.build.outputs.version }}"
```

### Multiple Outputs

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    outputs:
      version: ${{ steps.info.outputs.version }}
      artifact: ${{ steps.info.outputs.artifact }}
      sha: ${{ steps.info.outputs.sha }}
      
    steps:
      - uses: actions/checkout@v4
      
      - name: Get build info
        id: info
        run: |
          echo "version=$(cat VERSION)" >> $GITHUB_OUTPUT
          echo "artifact=build-$(date +%Y%m%d)" >> $GITHUB_OUTPUT
          echo "sha=$(git rev-parse --short HEAD)" >> $GITHUB_OUTPUT
          
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - run: |
          echo "Version: ${{ needs.build.outputs.version }}"
          echo "Artifact: ${{ needs.build.outputs.artifact }}"
          echo "SHA: ${{ needs.build.outputs.sha }}"
```

### JSON Output

```yaml
jobs:
  analyze:
    runs-on: ubuntu-latest
    outputs:
      matrix: ${{ steps.set-matrix.outputs.matrix }}
      
    steps:
      - name: Set matrix
        id: set-matrix
        run: |
          echo 'matrix={"node":["18","20"],"os":["ubuntu-latest","windows-latest"]}' >> $GITHUB_OUTPUT
          
  build:
    needs: analyze
    strategy:
      matrix: ${{ fromJson(needs.analyze.outputs.matrix) }}
    runs-on: ${{ matrix.os }}
    steps:
      - run: echo "Node ${{ matrix.node }} on ${{ matrix.os }}"
```

### Conditional Output

```yaml
jobs:
  check:
    runs-on: ubuntu-latest
    outputs:
      should-deploy: ${{ steps.check.outputs.deploy }}
      
    steps:
      - uses: actions/checkout@v4
      
      - name: Check for changes
        id: check
        run: |
          if git diff --name-only HEAD~1 | grep -q "^src/"; then
            echo "deploy=true" >> $GITHUB_OUTPUT
          else
            echo "deploy=false" >> $GITHUB_OUTPUT
          fi
          
  deploy:
    needs: check
    if: needs.check.outputs.should-deploy == 'true'
    runs-on: ubuntu-latest
    steps:
      - run: ./deploy.sh
```

### Output from Action

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    outputs:
      changed-files: ${{ steps.changes.outputs.all_changed_files }}
      
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
          
      - name: Get changed files
        id: changes
        uses: tj-actions/changed-files@v40
        
  process:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - run: echo "Changed: ${{ needs.build.outputs.changed-files }}"
```

### Multi-line Output

```yaml
jobs:
  generate:
    runs-on: ubuntu-latest
    outputs:
      report: ${{ steps.report.outputs.content }}
      
    steps:
      - name: Generate report
        id: report
        run: |
          {
            echo 'content<<EOF'
            echo "Build Report"
            echo "============"
            echo "Date: $(date)"
            echo "Status: Success"
            echo 'EOF'
          } >> $GITHUB_OUTPUT
          
  notify:
    needs: generate
    runs-on: ubuntu-latest
    steps:
      - run: echo "${{ needs.generate.outputs.report }}"
```

### Chained Outputs

```yaml
jobs:
  job1:
    runs-on: ubuntu-latest
    outputs:
      value: ${{ steps.step1.outputs.value }}
    steps:
      - id: step1
        run: echo "value=from-job1" >> $GITHUB_OUTPUT
        
  job2:
    needs: job1
    runs-on: ubuntu-latest
    outputs:
      value: ${{ steps.step2.outputs.value }}
    steps:
      - id: step2
        run: echo "value=${{ needs.job1.outputs.value }}-modified" >> $GITHUB_OUTPUT
        
  job3:
    needs: job2
    runs-on: ubuntu-latest
    steps:
      - run: echo "Final: ${{ needs.job2.outputs.value }}"
```

### Output Validation

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    outputs:
      version: ${{ steps.version.outputs.version }}
    steps:
      - id: version
        run: |
          VERSION="1.0.0"
          if [[ ! "$VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
            echo "Invalid version format"
            exit 1
          fi
          echo "version=$VERSION" >> $GITHUB_OUTPUT
          
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Validate version
        run: |
          VERSION="${{ needs.build.outputs.version }}"
          if [ -z "$VERSION" ]; then
            echo "Version is empty!"
            exit 1
          fi
          echo "Deploying $VERSION"
```

### Best Practices

```
✅ Use descriptive output names
✅ Validate outputs before use
✅ Handle empty outputs
✅ Use JSON for complex data
✅ Document output format
```

