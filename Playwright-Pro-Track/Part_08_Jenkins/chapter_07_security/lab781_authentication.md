# Lab 781: Authentication

## LEARNING CONCEPT

Configuring authentication in Jenkins.

## EXERCISE

1. Set up user authentication
2. Configure security realm
3. Implement SSO

## SOLUTION

### Security Realm Options

```
Manage Jenkins → Security → Security Realm

Options:
- Jenkins' own user database
- LDAP
- Unix user/group database
- Active Directory
- SAML 2.0
- OAuth/OpenID Connect
```

### Jenkins User Database

```
Security Realm: Jenkins' own user database

Settings:
✓ Allow users to sign up (disable in production)

Create users:
Manage Jenkins → Users → Create User
- Username
- Password
- Full name
- Email
```

### LDAP Configuration

```
Security Realm: LDAP

Server: ldap://ldap.example.com
Root DN: dc=example,dc=com
User search base: ou=users
User search filter: uid={0}
Group search base: ou=groups
Group search filter: (member={0})
Manager DN: cn=admin,dc=example,dc=com
Manager Password: ****
```

### Active Directory

```
Install: Active Directory Plugin

Security Realm: Active Directory

Domain: example.com
Domain Controllers: dc1.example.com, dc2.example.com
Bind DN: CN=Jenkins,OU=Service Accounts,DC=example,DC=com
Bind Password: ****
```

### SAML 2.0 (Okta/Azure AD)

```
Install: SAML Plugin

Security Realm: SAML 2.0

IdP Metadata URL: https://idp.example.com/metadata
Display Name Attribute: displayName
Group Attribute: groups
Username Attribute: email
Email Attribute: email
```

### OAuth/GitHub

```
Install: GitHub OAuth Plugin

Security Realm: GitHub Authentication

Client ID: your-client-id
Client Secret: your-client-secret
GitHub Web URI: https://github.com
GitHub API URI: https://api.github.com
OAuth Scope: read:org,user:email
```

### API Token Authentication

```
User → Configure → API Token

Generate new token:
1. Click "Add new Token"
2. Name the token
3. Click "Generate"
4. Copy token (shown once)

Use in API:
curl -u username:token http://jenkins:8080/api/json
```

### SSH Key Authentication

```
For CLI access:
1. User → Configure → SSH Public Keys
2. Add public key
3. Use CLI with SSH

java -jar jenkins-cli.jar -s http://jenkins:8080/ \
    -ssh -user admin \
    list-jobs
```

### Disable Anonymous Access

```
Manage Jenkins → Security

Authorization:
- Select "Logged-in users can do anything"
- Or use Matrix-based security

Uncheck:
- Allow anonymous read access
```

### Password Policy

```
Install: Password Strength Plugin

Configure:
Manage Jenkins → Security → Password Strength

Requirements:
- Minimum length: 12
- Require uppercase
- Require lowercase
- Require numbers
- Require special characters
```

### Account Lockout

```
Install: Login Lockout Plugin

Configure:
- Max failed attempts: 5
- Lockout duration: 30 minutes
- Reset after: 24 hours
```

### Two-Factor Authentication

```
Install: Google Authenticator Plugin

Enable per user:
1. User → Configure
2. Enable 2FA
3. Scan QR code
4. Enter verification code
```

### Session Management

```
Manage Jenkins → Security

Session settings:
- Session timeout: 30 minutes
- Disable "Remember me"
- Force HTTPS
```

### Authentication in Pipeline

```groovy
pipeline {
    agent any
    
    stages {
        stage('API Call') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'jenkins-api',
                        usernameVariable: 'USER',
                        passwordVariable: 'TOKEN'
                    )
                ]) {
                    sh '''
                        curl -u $USER:$TOKEN \
                            http://jenkins:8080/api/json
                    '''
                }
            }
        }
    }
}
```

### Best Practices

```
✅ Use SSO when possible
✅ Disable anonymous access
✅ Enforce strong passwords
✅ Enable 2FA for admins
✅ Use API tokens, not passwords
✅ Regular credential rotation
✅ Audit authentication logs
```

