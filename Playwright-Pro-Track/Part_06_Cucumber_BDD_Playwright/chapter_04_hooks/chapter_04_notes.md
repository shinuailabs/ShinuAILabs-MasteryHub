# Part 04: Hooks

## 📚 Overview
Hooks allow setup and teardown code to run at specific points in the test lifecycle.

---

## 🎯 Key Concepts

### 1. Hook Types

```typescript
// support/hooks.ts
import { 
  Before, After, 
  BeforeAll, AfterAll, 
  BeforeStep, AfterStep,
  Status 
} from '@cucumber/cucumber';

// Runs once before all scenarios
BeforeAll(async function() {
  console.log('Starting test suite');
});

// Runs before each scenario
Before(async function() {
  console.log('Starting scenario');
});

// Runs before each step
BeforeStep(async function() {
  console.log('Starting step');
});

// Runs after each step
AfterStep(async function() {
  console.log('Step completed');
});

// Runs after each scenario
After(async function() {
  console.log('Scenario completed');
});

// Runs once after all scenarios
AfterAll(async function() {
  console.log('Test suite completed');
});
```

### 2. Browser Setup/Teardown

```typescript
// support/hooks.ts
import { Before, After, BeforeAll, AfterAll } from '@cucumber/cucumber';
import { Browser, chromium } from '@playwright/test';
import { CustomWorld } from './world';

let browser: Browser;

BeforeAll(async function() {
  browser = await chromium.launch({ headless: true });
});

Before(async function(this: CustomWorld) {
  this.context = await browser.newContext();
  this.page = await this.context.newPage();
});

After(async function(this: CustomWorld) {
  await this.page?.close();
  await this.context?.close();
});

AfterAll(async function() {
  await browser?.close();
});
```

### 3. Tagged Hooks

```typescript
// Run only for scenarios with @login tag
Before({ tags: '@login' }, async function(this: CustomWorld) {
  await this.page.goto('/login');
});

// Run for @smoke but not @wip
Before({ tags: '@smoke and not @wip' }, async function(this: CustomWorld) {
  console.log('Running smoke test');
});

// Run for @api or @integration
After({ tags: '@api or @integration' }, async function(this: CustomWorld) {
  // API cleanup
});

// Multiple tag conditions
Before({ tags: '@authenticated and @admin' }, async function(this: CustomWorld) {
  await this.loginAsAdmin();
});
```

### 4. Hook Order

```typescript
// Hooks run in order of definition
// Use order option to control execution

Before({ order: 1 }, async function() {
  console.log('First hook');
});

Before({ order: 2 }, async function() {
  console.log('Second hook');
});

// After hooks run in reverse order
After({ order: 2 }, async function() {
  console.log('Runs first in after');
});

After({ order: 1 }, async function() {
  console.log('Runs second in after');
});
```

### 5. Scenario Information

```typescript
Before(async function(this: CustomWorld, scenario) {
  console.log('Scenario:', scenario.pickle.name);
  console.log('Tags:', scenario.pickle.tags.map(t => t.name));
  console.log('URI:', scenario.pickle.uri);
});

After(async function(this: CustomWorld, scenario) {
  console.log('Status:', scenario.result?.status);
  console.log('Duration:', scenario.result?.duration);
  
  if (scenario.result?.status === Status.FAILED) {
    console.log('Error:', scenario.result?.message);
  }
});
```

### 6. Screenshot on Failure

```typescript
After(async function(this: CustomWorld, scenario) {
  if (scenario.result?.status === Status.FAILED) {
    // Take screenshot
    const screenshot = await this.page.screenshot({
      fullPage: true
    });
    
    // Attach to report
    this.attach(screenshot, 'image/png');
    
    // Save to file
    const name = scenario.pickle.name.replace(/\s+/g, '_');
    await this.page.screenshot({
      path: `screenshots/${name}.png`
    });
  }
});
```

### 7. Video Recording

```typescript
import { BrowserContext } from '@playwright/test';

Before(async function(this: CustomWorld) {
  this.context = await browser.newContext({
    recordVideo: {
      dir: 'videos/',
      size: { width: 1280, height: 720 }
    }
  });
  this.page = await this.context.newPage();
});

After(async function(this: CustomWorld, scenario) {
  // Get video path
  const video = this.page.video();
  if (video) {
    const path = await video.path();
    
    // Attach video on failure
    if (scenario.result?.status === Status.FAILED) {
      const videoBuffer = await fs.promises.readFile(path);
      this.attach(videoBuffer, 'video/webm');
    }
  }
  
  await this.page.close();
  await this.context.close();
});
```

### 8. Authentication Hook

```typescript
// Login before authenticated scenarios
Before({ tags: '@authenticated' }, async function(this: CustomWorld) {
  await this.page.goto('/login');
  await this.page.getByLabel('Email').fill('user@example.com');
  await this.page.getByLabel('Password').fill('password123');
  await this.page.getByRole('button', { name: 'Login' }).click();
  await this.page.waitForURL('/dashboard');
});

// Admin login
Before({ tags: '@admin' }, async function(this: CustomWorld) {
  await this.page.goto('/login');
  await this.page.getByLabel('Email').fill('admin@example.com');
  await this.page.getByLabel('Password').fill('adminpass');
  await this.page.getByRole('button', { name: 'Login' }).click();
});

// Use storage state for faster auth
Before({ tags: '@authenticated' }, async function(this: CustomWorld) {
  this.context = await browser.newContext({
    storageState: 'auth.json'
  });
  this.page = await this.context.newPage();
});
```

### 9. Data Cleanup

```typescript
// Clean up test data after scenarios
After({ tags: '@creates-data' }, async function(this: CustomWorld) {
  // Delete created test data
  if (this.createdUserId) {
    await this.apiClient.deleteUser(this.createdUserId);
  }
  
  if (this.createdOrderId) {
    await this.apiClient.deleteOrder(this.createdOrderId);
  }
});

// Reset database state
AfterAll(async function() {
  await resetTestDatabase();
});
```

---

## 💻 Practice Exercises

1. Implement browser hooks
2. Add screenshot on failure
3. Create tagged hooks
4. Set up authentication hooks
5. Implement data cleanup

---

## ✅ Best Practices

- ✅ Use BeforeAll for expensive setup
- ✅ Capture screenshots on failure
- ✅ Clean up test data
- ✅ Use tagged hooks for specific scenarios
- ❌ Don't put test logic in hooks
- ❌ Avoid slow operations in Before

---

## 📝 Quick Reference

```typescript
// Lifecycle
BeforeAll(async () => { })  // Once before all
Before(async () => { })     // Before each scenario
BeforeStep(async () => { }) // Before each step
AfterStep(async () => { })  // After each step
After(async () => { })      // After each scenario
AfterAll(async () => { })   // Once after all

// Tagged
Before({ tags: '@tag' }, async () => { })

// Ordered
Before({ order: 1 }, async () => { })

// Scenario info
After(async (scenario) => {
  scenario.pickle.name
  scenario.result?.status
})
```

