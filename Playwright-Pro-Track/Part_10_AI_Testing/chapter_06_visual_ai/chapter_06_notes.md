# Part 06: Visual AI Testing

## 📚 Overview
Visual AI testing uses machine learning to detect visual differences and validate UI appearance.

---

## 🎯 Key Concepts

### 1. Visual Testing Basics

```typescript
// Traditional screenshot comparison
test('visual comparison', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page).toHaveScreenshot('dashboard.png');
});

// With threshold
await expect(page).toHaveScreenshot('dashboard.png', {
  maxDiffPixels: 100,
  threshold: 0.2,
});
```

### 2. Applitools Eyes Integration

```typescript
import { Eyes, Target, Configuration, BatchInfo } from '@applitools/eyes-playwright';

test.describe('Visual AI Tests', () => {
  let eyes: Eyes;
  
  test.beforeEach(async () => {
    eyes = new Eyes();
    const config = new Configuration();
    config.setBatch(new BatchInfo('My App Tests'));
    config.setApiKey(process.env.APPLITOOLS_API_KEY!);
    eyes.setConfiguration(config);
  });
  
  test.afterEach(async () => {
    await eyes.close();
  });
  
  test('homepage visual test', async ({ page }) => {
    await eyes.open(page, 'My App', 'Homepage Test');
    await page.goto('/');
    
    // Full page check
    await eyes.check('Homepage', Target.window().fully());
    
    // Specific region
    await eyes.check('Header', Target.region('.header'));
  });
});
```

### 3. Percy Integration

```typescript
import percySnapshot from '@percy/playwright';

test('Percy visual test', async ({ page }) => {
  await page.goto('/products');
  
  // Take Percy snapshot
  await percySnapshot(page, 'Products Page');
  
  // With options
  await percySnapshot(page, 'Products Page Mobile', {
    widths: [375, 768, 1280],
    minHeight: 1024,
  });
});
```

### 4. Visual AI Features

```typescript
// Applitools AI features
test('AI visual features', async ({ page }) => {
  await eyes.open(page, 'App', 'AI Features');
  await page.goto('/dashboard');
  
  // Ignore dynamic content
  await eyes.check('Dashboard', 
    Target.window()
      .ignoreRegions('.timestamp', '.user-avatar')
      .layoutRegions('.sidebar')
      .strictRegions('.logo')
  );
  
  // Floating regions (elements that may move)
  await eyes.check('Responsive Layout',
    Target.window()
      .floatingRegion('.notification', 10, 10, 10, 10)
  );
});
```

### 5. Cross-Browser Visual Testing

```typescript
import { Configuration, BrowserType, DeviceName } from '@applitools/eyes-playwright';

test('cross-browser visual', async ({ page }) => {
  const config = new Configuration();
  
  // Test on multiple browsers
  config.addBrowser(1200, 800, BrowserType.CHROME);
  config.addBrowser(1200, 800, BrowserType.FIREFOX);
  config.addBrowser(1200, 800, BrowserType.SAFARI);
  
  // Test on mobile devices
  config.addDeviceEmulation(DeviceName.iPhone_12);
  config.addDeviceEmulation(DeviceName.Pixel_5);
  
  eyes.setConfiguration(config);
  
  await eyes.open(page, 'App', 'Cross-Browser Test');
  await page.goto('/');
  await eyes.check('Homepage', Target.window().fully());
});
```

### 6. Component Visual Testing

```typescript
// Visual test for specific components
test('button component visual', async ({ page }) => {
  await page.goto('/components/buttons');
  
  // Test each button state
  const primaryBtn = page.locator('.btn-primary');
  await expect(primaryBtn).toHaveScreenshot('btn-primary-default.png');
  
  await primaryBtn.hover();
  await expect(primaryBtn).toHaveScreenshot('btn-primary-hover.png');
  
  await primaryBtn.focus();
  await expect(primaryBtn).toHaveScreenshot('btn-primary-focus.png');
});
```

### 7. Visual Regression Workflow

```typescript
// playwright.config.ts
export default defineConfig({
  expect: {
    toHaveScreenshot: {
      maxDiffPixels: 50,
      threshold: 0.2,
      animations: 'disabled',
    },
  },
  use: {
    // Consistent viewport
    viewport: { width: 1280, height: 720 },
    // Disable animations
    launchOptions: {
      args: ['--force-prefers-reduced-motion'],
    },
  },
});

// Update baselines
// npx playwright test --update-snapshots
```

### 8. Handling Dynamic Content

```typescript
test('visual with dynamic content', async ({ page }) => {
  await page.goto('/dashboard');
  
  // Hide dynamic elements
  await page.evaluate(() => {
    document.querySelectorAll('.timestamp, .random-ad').forEach(el => {
      (el as HTMLElement).style.visibility = 'hidden';
    });
  });
  
  // Or use mask option
  await expect(page).toHaveScreenshot('dashboard.png', {
    mask: [
      page.locator('.timestamp'),
      page.locator('.user-avatar'),
      page.locator('.live-data'),
    ],
  });
});
```

### 9. Visual Test Reports

```typescript
// Applitools dashboard provides:
// - Side-by-side comparison
// - AI-detected differences
// - Batch results
// - Root cause analysis

// Percy provides:
// - Visual diffs
// - Browser coverage
// - Approval workflow
// - CI integration

// Playwright built-in:
// - HTML report with screenshots
// - Diff images
// - Trace viewer
```

---

## 💻 Practice Exercises

1. Set up Playwright screenshots
2. Integrate Applitools Eyes
3. Configure Percy
4. Handle dynamic content
5. Cross-browser visual testing

---

## ✅ Best Practices

- ✅ Use consistent viewport sizes
- ✅ Disable animations
- ✅ Mask dynamic content
- ✅ Test on multiple browsers
- ❌ Don't ignore all differences
- ❌ Avoid flaky baselines

---

## 📝 Quick Reference

```typescript
// Playwright screenshot
await expect(page).toHaveScreenshot('name.png');
await expect(locator).toHaveScreenshot('element.png');

// Applitools
await eyes.check('Name', Target.window().fully());
await eyes.check('Region', Target.region('.selector'));

// Percy
await percySnapshot(page, 'Snapshot Name');

// Options
{
  maxDiffPixels: 100,
  threshold: 0.2,
  mask: [locator],
  animations: 'disabled',
}
```

