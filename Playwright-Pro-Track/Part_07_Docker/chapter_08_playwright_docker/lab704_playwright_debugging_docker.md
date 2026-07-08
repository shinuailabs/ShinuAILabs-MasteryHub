# Lab 704: Debugging Playwright in Docker

## LEARNING CONCEPT

Debugging Playwright tests running in Docker containers.

## EXERCISE

1. Enable headed mode
2. Use trace viewer
3. Debug interactively

## SOLUTION

### Enable Headed Mode (X11)

```bash
# Linux with X11
docker run --rm \
    -v $(pwd):/app \
    -w /app \
    -e DISPLAY=$DISPLAY \
    -v /tmp/.X11-unix:/tmp/.X11-unix \
    mcr.microsoft.com/playwright:v1.40.0-jammy \
    npx playwright test --headed
```

### VNC for Headed Mode

```dockerfile
FROM mcr.microsoft.com/playwright:v1.40.0-jammy

# Install VNC
RUN apt-get update && apt-get install -y \
    x11vnc \
    xvfb \
    fluxbox \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Start VNC and run tests
CMD Xvfb :99 -screen 0 1920x1080x24 & \
    fluxbox & \
    x11vnc -display :99 -forever -nopw & \
    DISPLAY=:99 npx playwright test --headed

EXPOSE 5900
```

```bash
# Run with VNC
docker run --rm -p 5900:5900 \
    -v $(pwd):/app \
    playwright-vnc

# Connect with VNC viewer to localhost:5900
```

### Trace Viewer

```bash
# Run tests with trace
docker run --rm \
    -v $(pwd):/app \
    -w /app \
    -v $(pwd)/test-results:/app/test-results \
    mcr.microsoft.com/playwright:v1.40.0-jammy \
    npx playwright test --trace on

# View trace locally
npx playwright show-trace test-results/*/trace.zip
```

### Debug Mode

```bash
# Run with debug
docker run -it --rm \
    -v $(pwd):/app \
    -w /app \
    -e PWDEBUG=1 \
    mcr.microsoft.com/playwright:v1.40.0-jammy \
    npx playwright test
```

### Interactive Shell

```bash
# Start interactive container
docker run -it --rm \
    -v $(pwd):/app \
    -w /app \
    mcr.microsoft.com/playwright:v1.40.0-jammy \
    bash

# Inside container
npm ci
npx playwright test --debug
npx playwright codegen https://example.com
```

### Docker Compose Debug Setup

```yaml
version: '3.8'
services:
  playwright-debug:
    image: mcr.microsoft.com/playwright:v1.40.0-jammy
    working_dir: /app
    volumes:
      - .:/app
      - ./test-results:/app/test-results
      - ./playwright-report:/app/playwright-report
    environment:
      - CI=false
      - PWDEBUG=1
    stdin_open: true
    tty: true
    command: bash
    profiles:
      - debug
```

```bash
# Start debug container
docker compose --profile debug run playwright-debug

# Inside container
npx playwright test --debug
```

### Screenshots and Videos

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
});
```

```bash
# Run and capture artifacts
docker run --rm \
    -v $(pwd):/app \
    -w /app \
    -v $(pwd)/test-results:/app/test-results \
    mcr.microsoft.com/playwright:v1.40.0-jammy \
    npx playwright test

# View results locally
ls test-results/
```

### Remote Debugging

```bash
# Expose debugger port
docker run --rm \
    -v $(pwd):/app \
    -w /app \
    -p 9229:9229 \
    mcr.microsoft.com/playwright:v1.40.0-jammy \
    node --inspect=0.0.0.0:9229 node_modules/.bin/playwright test

# Connect Chrome DevTools to localhost:9229
```

### Logging

```bash
# Enable verbose logging
docker run --rm \
    -v $(pwd):/app \
    -w /app \
    -e DEBUG=pw:api \
    mcr.microsoft.com/playwright:v1.40.0-jammy \
    npx playwright test
```

### Troubleshooting Checklist

```
□ Check volume mounts
□ Verify environment variables
□ Check network connectivity
□ Review container logs
□ Enable trace/screenshots
□ Use interactive mode
□ Check browser installation
```

### Best Practices

```
✅ Always capture traces on failure
✅ Use screenshots for debugging
✅ Mount test-results volume
✅ Use interactive mode for development
✅ Enable verbose logging when needed
```

