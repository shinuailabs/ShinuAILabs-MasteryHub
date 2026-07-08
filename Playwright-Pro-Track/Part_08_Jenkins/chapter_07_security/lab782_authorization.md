# Lab 782: Authorization

## LEARNING CONCEPT

Configuring authorization and permissions in Jenkins.

## EXERCISE

1. Set up authorization strategy
2. Configure role-based access
3. Implement folder permissions

## SOLUTION

### Authorization Strategies

```
Manage Jenkins → Security → Authorization

Options:
- Anyone can do anything (not recommended)
- Logged-in users can do anything
- Matrix-based security
- Project-based Matrix Authorization
- Role-Based Strategy
```

### Matrix-based Security

```
Manage Jenkins → Security → Authorization
Select: Matrix-based security

Add users/groups and set permissions:

User/Group | Overall | Job | View | ...
-----------|---------|-----|------|----
admin      | ✓ All   | ✓   | ✓    | ✓
developer  | Read    | ✓   | ✓    | -
viewer     | Read    | Read| ✓    | -
```

### Permission Categories

```
Overall:
- Administer
- Read
- RunScripts
- ConfigureUpdateCenter

Job:
- Build
- Cancel
- Configure
- Create
- Delete
- Discover
- Move
- Read
- Workspace

View:
- Configure
- Create
- Delete
- Read

Credentials:
- Create
- Delete
- ManageDomains
- Update
- View
```

### Role-Based Strategy

```
Install: Role-based Authorization Strategy

Manage Jenkins → Security → Authorization
Select: Role-Based Strategy

Configure roles:
Manage Jenkins → Manage and Assign Roles
```

### Create Global Roles

```
Manage and Assign Roles → Manage Roles

Global roles:
| Role      | Overall | Job  | View |
|-----------|---------|------|------|
| admin     | All     | All  | All  |
| developer | Read    | Build, Read | Read |
| viewer    | Read    | Read | Read |
```

### Create Project Roles

```
Project roles (pattern-based):

Role: frontend-dev
Pattern: frontend-.*
Permissions: Job (Build, Read, Workspace)

Role: backend-dev
Pattern: backend-.*
Permissions: Job (Build, Read, Workspace)

Role: qa
Pattern: .*-test
Permissions: Job (Build, Read)
```

### Assign Roles

```
Manage and Assign Roles → Assign Roles

Global roles:
| User/Group | admin | developer | viewer |
|------------|-------|-----------|--------|
| admin      | ✓     |           |        |
| dev-team   |       | ✓         |        |
| qa-team    |       |           | ✓      |

Project roles:
| User/Group   | frontend-dev | backend-dev |
|--------------|--------------|-------------|
| frontend-team| ✓            |             |
| backend-team |              | ✓           |
```

### Folder-based Permissions

```
Install: Folders Plugin

Create folder:
1. New Item → Folder
2. Configure folder
3. Set permissions per folder

Folder → Configure → Properties
Enable: Inherit permissions from parent
Or: Define custom permissions
```

### Project-based Matrix

```
Job → Configure → Enable project-based security

Add users/groups with specific permissions:
| User/Group | Build | Configure | Read |
|------------|-------|-----------|------|
| dev-team   | ✓     |           | ✓    |
| lead       | ✓     | ✓         | ✓    |
```

### Agent Permissions

```
Permissions for agents:
- Agent/Build
- Agent/Configure
- Agent/Connect
- Agent/Create
- Agent/Delete
- Agent/Disconnect

Restrict who can:
- Create agents
- Configure agents
- Connect agents
```

### Credential Permissions

```
Credential permissions:
- Credentials/Create
- Credentials/Delete
- Credentials/ManageDomains
- Credentials/Update
- Credentials/View

Restrict credential access:
- Use folder-scoped credentials
- Limit who can view/update
```

### Authorization in Pipeline

```groovy
pipeline {
    agent any
    
    stages {
        stage('Check Permission') {
            steps {
                script {
                    def user = currentBuild.rawBuild.getCause(
                        hudson.model.Cause$UserIdCause
                    )?.userId
                    
                    echo "Build triggered by: ${user}"
                }
            }
        }
        
        stage('Deploy') {
            when {
                expression {
                    // Check if user has permission
                    return currentBuild.rawBuild.getCause(
                        hudson.model.Cause$UserIdCause
                    )?.userId in ['admin', 'deployer']
                }
            }
            steps {
                sh './deploy.sh'
            }
        }
    }
}
```

### Audit Authorization

```
Install: Audit Trail Plugin

Configure:
Manage Jenkins → System → Audit Trail

Log:
- Permission changes
- User access
- Configuration changes
```

### Best Practices

```
✅ Use role-based authorization
✅ Follow least privilege principle
✅ Use folder-based permissions
✅ Regular permission audits
✅ Document permission structure
✅ Separate admin and user roles
```

