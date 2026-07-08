# Part 08: Debugging

## 📚 Overview
Playwright provides powerful debugging tools including UI mode, trace viewer, and step-by-step debugging.

---

## 🎯 Key Concepts

### 1. UI Mode

```bash
# Run tests in UI mode
npx playwright test --ui

# Features:
# - Watch mode for tests
# - Time travel debugging
# - Pick locators
# - View traces
# - Filter tests
```

### 2. Debug Mode

```bash
# Run in debug mode
npx playwright test --debug

# Debug specific test
npx playwright test tests/login.spec.ts --debug

# Debug specific line
PWDEBUG=1 npx playwright test
```

### 3. Playwright Inspector

```typescript
// Pause execution and open inspector
await page.pause();

// In test
test('debug test', async ({ page }) => {
  await page.goto('/');
  await page.pause();  // Opens inspector here
  await page.click('button');
});
```

### 4. Trace Viewer

```bash
# Enable traces in config
# playwright.config.ts
use: {
  trace: 'on-first-retry'
}

# View trace after test
npx playwright show-trace trace.zip

# Trace viewer features:
# - Timeline of actions
# - DOM snapshots
# - Network requests
# - Console logs
# - Source code
```

### 5. Console Logging

```typescript
// Log in test
test('with logging', async ({ page }) => {
  console.log('Starting test');
  
  await page.goto('/');
  console.log('Current URL:', page.url());
  
  const title = await page.title();
  console.log('Page title:', title);
});

// Capture browser console
page.on('console', msg => {
  console.log('Browser:', msg.type(), msg.text());
});

// Capture page errors
page.on('pageerror', error => {
  console.error('Page error:', error.message);
});
```

### 6. Verbose Logging

```bash
# Enable verbose logging
DEBUG=pw:api npx playwright test

# Log specific categories
DEBUG=pw:browser npx playwright test
DEBUG=pw:protocol npx playwright test

# All logs
DEBUG=pw:* npx playwright test
```

### 7. Slow Motion

```typescript
// Slow down actions
// playwright.config.ts
export default defineConfig({
  use: {
    launchOptions: {
      slowMo: 500  // 500ms between actions
    }
  }
});

// Or in test
const browser = await chromium.launch({ slowMo: 500 });
```

### 8. Headed Mode

```bash
# Run with browser visible
npx playwright test --headed

# Keep browser open after test
npx playwright test --headed --debug

# In config
export default defineConfig({
  use: {
    headless: false
  }
});
```

### 9. Debugging Strategies

```typescript
// 1. Use page.pause() for breakpoints
await page.pause();

// 2. Take screenshots at key points
await page.screenshot({ path: 'debug-1.png' });

// 3. Log element state
const button = page.getByRole('button');
console.log('Button visible:', await button.isVisible());
console.log('Button enabled:', await button.isEnabled());
console.log('Button text:', await button.textContent());

// 4. Evaluate in browser context
const result = await page.evaluate(() => {
  return {
    url: window.location.href,
    cookies: document.cookie,
    localStorage: { ...localStorage }
  };
});
console.log('Page state:', result);

// 5. Use test.step for better traces
await test.step('Login', async () => {
  await page.fill('#email', 'user@example.com');
  await page.fill('#password', 'password');
  await page.click('button[type="submit"]');
});
```

### 10. VS Code Integration

```typescript
// Install Playwright VS Code extension
// Features:
// - Run tests from editor
// - Debug with breakpoints
// - Pick locators
// - Record tests

// launch.json for debugging
{
  "type": "node",
  "request": "launch",
  "name": "Debug Playwright",
  "program": "${workspaceFolder}/node_modules/.bin/playwright",
  "args": ["test", "--debug"],
  "console": "integratedTerminal"
}
```

---

## 💻 Practice Exercises

1. Use UI mode for debugging
2. Analyze traces
3. Set up VS Code debugging
4. Use page.pause() effectively
5. Capture and analyze logs

---

## ✅ Best Practices

- ✅ Use UI mode for development
- ✅ Enable traces for CI failures
- ✅ Use test.step for organization
- ✅ Log meaningful information
- ❌ Don't leave page.pause() in code
- ❌ Avoid excessive logging in CI

---

## 📝 Quick Reference

```bash
# UI mode
npx playwright test --ui

# Debug mode
npx playwright test --debug

# Headed
npx playwright test --headed

# Trace viewer
npx playwright show-trace trace.zip

# Verbose logs
DEBUG=pw:api npx playwright test
```

```typescript
// Pause
await page.pause()

// Log
console.log('Debug:', value)

// Browser console
page.on('console', msg => console.log(msg.text()))

// Test step
await test.step('Step name', async () => { })
```

