# Lab 821: Expressions

## LEARNING CONCEPT

Using expressions in GitHub Actions workflows.

## EXERCISE

1. Learn expression syntax
2. Use operators and functions
3. Apply expressions in workflows

## SOLUTION

### Expression Syntax

```yaml
# Expression syntax
${{ <expression> }}

# In if conditions (optional ${{ }})
if: github.ref == 'refs/heads/main'
if: ${{ github.ref == 'refs/heads/main' }}

# In other contexts (required ${{ }})
run: echo "Branch is ${{ github.ref_name }}"
```

### Literals

```yaml
steps:
  - run: |
      # Boolean
      echo "${{ true }}"
      echo "${{ false }}"
      
      # Number
      echo "${{ 42 }}"
      echo "${{ 3.14 }}"
      
      # String
      echo "${{ 'hello' }}"
      
      # Null
      echo "${{ null }}"
```

### Operators

```yaml
# Comparison
${{ github.ref == 'refs/heads/main' }}
${{ github.run_number != 1 }}
${{ github.run_number > 10 }}
${{ github.run_number >= 10 }}
${{ github.run_number < 100 }}
${{ github.run_number <= 100 }}

# Logical
${{ github.event_name == 'push' && github.ref == 'refs/heads/main' }}
${{ github.event_name == 'push' || github.event_name == 'workflow_dispatch' }}
${{ !cancelled() }}

# Grouping
${{ (github.event_name == 'push' || github.event_name == 'pull_request') && github.ref == 'refs/heads/main' }}
```

### Status Functions

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: exit 1
        continue-on-error: true
        
      - name: Always run
        if: always()
        run: echo "This always runs"
        
      - name: On success
        if: success()
        run: echo "Previous steps succeeded"
        
      - name: On failure
        if: failure()
        run: echo "A previous step failed"
        
      - name: On cancel
        if: cancelled()
        run: echo "Workflow was cancelled"
```

### String Functions

```yaml
steps:
  - name: String functions
    run: |
      # contains
      echo "${{ contains('Hello World', 'World') }}"  # true
      
      # startsWith
      echo "${{ startsWith('Hello', 'He') }}"  # true
      
      # endsWith
      echo "${{ endsWith('Hello', 'lo') }}"  # true
      
      # format
      echo "${{ format('Hello {0}!', 'World') }}"  # Hello World!
      
      # join
      echo "${{ join(github.event.commits.*.message, ', ') }}"
```

### Array Functions

```yaml
steps:
  - name: Array functions
    run: |
      # contains (array)
      echo "${{ contains(github.event.commits.*.author.email, 'user@example.com') }}"
      
      # fromJson
      echo "${{ fromJson('[1, 2, 3]')[0] }}"  # 1
      
      # toJson
      echo '${{ toJson(github.event) }}'
```

### Conditional Expressions

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      # Simple condition
      - if: github.ref == 'refs/heads/main'
        run: echo "On main"
        
      # Multiple conditions
      - if: |
          github.event_name == 'push' &&
          github.ref == 'refs/heads/main'
        run: echo "Push to main"
        
      # Negation
      - if: "!contains(github.event.head_commit.message, '[skip ci]')"
        run: npm test
```

### Environment Variable Expressions

```yaml
env:
  IS_MAIN: ${{ github.ref == 'refs/heads/main' }}
  
jobs:
  build:
    runs-on: ubuntu-latest
    env:
      DEPLOY_ENV: ${{ github.ref == 'refs/heads/main' && 'production' || 'staging' }}
      
    steps:
      - run: echo "Deploy to $DEPLOY_ENV"
```

### Ternary-like Expression

```yaml
# condition && valueIfTrue || valueIfFalse
env:
  ENVIRONMENT: ${{ github.ref == 'refs/heads/main' && 'production' || 'development' }}
  
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: ${{ github.ref == 'refs/heads/main' && 'production' || 'staging' }}
```

### Object Filters

```yaml
steps:
  - name: Filter objects
    run: |
      # Get all commit messages
      echo "${{ toJson(github.event.commits.*.message) }}"
      
      # Get all author emails
      echo "${{ toJson(github.event.commits.*.author.email) }}"
```

### HashFiles Function

```yaml
steps:
  - uses: actions/checkout@v4
  
  - name: Cache dependencies
    uses: actions/cache@v4
    with:
      path: node_modules
      key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
```

### Common Patterns

```yaml
# Check if PR
if: github.event_name == 'pull_request'

# Check branch
if: github.ref_name == 'main'

# Check tag
if: startsWith(github.ref, 'refs/tags/')

# Skip CI
if: "!contains(github.event.head_commit.message, '[skip ci]')"

# Only on specific actor
if: github.actor == 'dependabot[bot]'
```

### Best Practices

```
✅ Use parentheses for clarity
✅ Test expressions in dry runs
✅ Use status functions appropriately
✅ Avoid complex nested expressions
✅ Document complex conditions
```

