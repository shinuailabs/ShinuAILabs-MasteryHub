# Lab 778: Blue Ocean

## LEARNING CONCEPT

Using Blue Ocean for modern Jenkins UI.

## EXERCISE

1. Install Blue Ocean
2. Navigate the interface
3. Use pipeline editor

## SOLUTION

### Install Blue Ocean

```
Manage Jenkins → Plugins → Available
Search: Blue Ocean
Install: Blue Ocean (aggregator plugin)

Includes:
- Blue Ocean Pipeline Editor
- Blue Ocean Core JS
- Blue Ocean Dashboard
- Blue Ocean Personalization
- Blue Ocean i18n
```

### Access Blue Ocean

```
Methods:
1. Click "Open Blue Ocean" in Jenkins header
2. Navigate to: http://jenkins:8080/blue
3. Direct pipeline URL: http://jenkins:8080/blue/organizations/jenkins/pipeline-name
```

### Dashboard Features

```
Dashboard shows:
- All pipelines
- Recent activity
- Favorites
- Search

Pipeline view:
- Branch list
- Build history
- Run status
```

### Pipeline View

```
Features:
- Visual stage execution
- Parallel stage visualization
- Log streaming
- Artifact access
- Test results
```

### Pipeline Editor

```
Create pipeline:
1. Click "New Pipeline"
2. Select source (Git, GitHub, etc.)
3. Connect repository
4. Use visual editor or Jenkinsfile

Visual editor:
- Add stages
- Configure steps
- Set environment
- Add parallel stages
```

### Visual Pipeline Creation

```
1. Open Blue Ocean
2. Click "New Pipeline"
3. Select "GitHub" or "Git"
4. Authorize and select repository
5. Use visual editor:
   - Click "+" to add stage
   - Click stage to add steps
   - Configure step parameters
6. Save to create Jenkinsfile
```

### Pipeline Activity

```
Activity view shows:
- All branches
- Pull requests
- Build history
- Status indicators

Filter by:
- Branch
- Status
- Time range
```

### Build Details

```
Build view shows:
- Stage visualization
- Step logs
- Test results
- Artifacts
- Changes

Features:
- Expand/collapse stages
- Search logs
- Download artifacts
```

### Favorites

```
Mark pipelines as favorites:
1. Click star icon
2. Favorites appear on dashboard
3. Quick access to important pipelines
```

### Pipeline Run

```
Run pipeline:
1. Click "Run" button
2. Enter parameters (if any)
3. Watch execution in real-time

Features:
- Live log streaming
- Stage progress
- Abort option
```

### Test Results

```
View test results:
1. Click "Tests" tab
2. See pass/fail summary
3. View failed test details
4. Access test history
```

### Artifacts

```
Access artifacts:
1. Click "Artifacts" tab
2. Browse artifact tree
3. Download files
4. View HTML reports
```

### Branch and PR View

```
Branch view:
- All branches with Jenkinsfile
- Build status per branch
- Last build time

PR view:
- Open pull requests
- Build status
- Merge readiness
```

### Configuration

```
Blue Ocean settings:
Manage Jenkins → Configure System → Blue Ocean

Options:
- Default organization
- Pipeline display settings
```

### Limitations

```
Blue Ocean limitations:
- No job configuration
- Limited plugin support
- Some features require classic UI

Use classic UI for:
- System configuration
- Plugin management
- User management
- Credential management
```

### Best Practices

```
✅ Use for pipeline visualization
✅ Use visual editor for simple pipelines
✅ Monitor builds in real-time
✅ Use favorites for quick access
✅ Switch to classic UI for configuration
```

