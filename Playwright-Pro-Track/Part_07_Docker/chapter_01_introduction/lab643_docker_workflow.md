# Lab 643: Docker Development Workflow

## LEARNING CONCEPT

Understanding the typical Docker development workflow.

### Workflow Steps:
1. Write Dockerfile
2. Build image
3. Test locally
4. Push to registry
5. Deploy

## EXERCISE

1. Create a simple app
2. Dockerize it
3. Test and deploy

## SOLUTION

### Step 1: Create Application

```javascript
// app.js
const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello from Docker!\n');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

```json
// package.json
{
    "name": "docker-demo",
    "version": "1.0.0",
    "main": "app.js",
    "scripts": {
        "start": "node app.js"
    }
}
```

### Step 2: Write Dockerfile

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

### Step 3: Build Image

```bash
# Build image
docker build -t my-app:latest .

# Build with specific tag
docker build -t my-app:v1.0.0 .

# Build with build args
docker build --build-arg NODE_ENV=production -t my-app .
```

### Step 4: Test Locally

```bash
# Run container
docker run -d -p 3000:3000 --name my-app-container my-app:latest

# Test
curl http://localhost:3000

# View logs
docker logs my-app-container

# Stop and remove
docker stop my-app-container
docker rm my-app-container
```

### Step 5: Push to Registry

```bash
# Tag for registry
docker tag my-app:latest username/my-app:latest
docker tag my-app:latest username/my-app:v1.0.0

# Push
docker push username/my-app:latest
docker push username/my-app:v1.0.0
```

### Step 6: Deploy

```bash
# Pull on production server
docker pull username/my-app:v1.0.0

# Run in production
docker run -d \
    -p 80:3000 \
    --name my-app \
    --restart unless-stopped \
    username/my-app:v1.0.0
```

### Complete Workflow Script

```bash
#!/bin/bash
# deploy.sh

VERSION=${1:-latest}
IMAGE_NAME="username/my-app"

echo "Building image..."
docker build -t $IMAGE_NAME:$VERSION .

echo "Testing locally..."
docker run -d -p 3000:3000 --name test-container $IMAGE_NAME:$VERSION
sleep 2
curl -f http://localhost:3000 || exit 1
docker stop test-container && docker rm test-container

echo "Pushing to registry..."
docker push $IMAGE_NAME:$VERSION

echo "Deployment complete!"
```

