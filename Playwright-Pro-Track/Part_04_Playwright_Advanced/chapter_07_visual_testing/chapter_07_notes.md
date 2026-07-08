# Part 07: Visual Testing

## 📚 Overview
Visual testing compares screenshots to detect unintended UI changes and ensure visual consistency.

---

## 🎯 Key Concepts

### 1. Basic Screenshot Comparison

```typescript
import { test, expect } from '@playwright/test';

test('visual test', async ({ page }) => {
  await page.goto('/');
  
  // Compare full page
  await expect(page).toHaveScreenshot('homepage.png');
});
```

### 2. Element Screenshots

```typescript
// Compare specific element
await expect(page.locator('.header')).toHaveScreenshot('header.png');
await expect(page.locator('.card')).toHaveScreenshot('card.png');

// Multiple elements
const cards = page.locator('.product-card');
for (let i = 0; i < await cards.count(); i++) {
  await expect(cards.nth(i)).toHaveScreenshot(`card-${i}.png`);
}
```

### 3. Screenshot Options

```typescript
await expect(page).toHaveScreenshot('page.png', {
  // Allowed pixel difference
  maxDiffPixels: 100,
  
  // Allowed percentage difference
  maxDiffPixelRatio: 0.1,
  
  // Color threshold (0-1)
  threshold: 0.2,
  
  // Disable animations
  animations: 'disabled',
  
  // Mask dynamic elements
  mask: [
    page.locator('.timestamp'),
    page.locator('.random-ad')
  ],
  
  // Full page screenshot
  fullPage: true,
  
  // Scale
  scale: 'css',  // or 'device'
});
```

### 4. Update Snapshots

```bash
# Update all snapshots
npx playwright test --update-snapshots

# Update specific test
npx playwright test visual.spec.ts --update-snapshots

# Update in CI (careful!)
npx playwright test --update-snapshots
```

### 5. Snapshot Configuration

```typescript
// playwright.config.ts
export default defineConfig({
  expect: {
    toHaveScreenshot: {
      maxDiffPixels: 50,
      threshold: 0.2,
      animations: 'disabled',
    },
    toMatchSnapshot: {
      maxDiffPixelRatio: 0.1,
    },
  },
  
  // Snapshot directory
  snapshotDir: './snapshots',
  
  // Snapshot path template
  snapshotPathTemplate: '{testDir}/__screenshots__/{testFilePath}/{arg}{ext}',
});
```

### 6. Handle Dynamic Content

```typescript
test('handle dynamic content', async ({ page }) => {
  await page.goto('/dashboard');
  
  // Mask dynamic elements
  await expect(page).toHaveScreenshot('dashboard.png', {
    mask: [
      page.locator('.current-time'),
      page.locator('.user-avatar'),
      page.locator('.notification-count')
    ]
  });
  
  // Or hide elements
  await page.locator('.dynamic-banner').evaluate(el => el.style.visibility = 'hidden');
  await expect(page).toHaveScreenshot('dashboard-clean.png');
});
```

### 7. Disable Animations

```typescript
// Disable animations globally
// playwright.config.ts
export default defineConfig({
  use: {
    // Disable CSS animations
    launchOptions: {
      args: ['--force-prefers-reduced-motion']
    }
  }
});

// Disable in test
test('no animations', async ({ page }) => {
  await page.goto('/');
  
  // Disable animations via CSS
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        transition-duration: 0s !important;
      }
    `
  });
  
  await expect(page).toHaveScreenshot('static.png');
});
```

### 8. Cross-Browser Visual Testing

```typescript
// playwright.config.ts
export default defineConfig({
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});

// Snapshots are stored per browser
// snapshots/
//   chromium/
//     homepage.png
//   firefox/
//     homepage.png
//   webkit/
//     homepage.png
```

### 9. Visual Regression Workflow

```typescript
// 1. Create baseline
test('create baseline', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot('baseline.png');
});

// 2. Run tests to detect changes
// npx playwright test

// 3. Review differences in report
// npx playwright show-report

// 4. Update if changes are intentional
// npx playwright test --update-snapshots

// CI workflow
test('visual regression', async ({ page }) => {
  await page.goto('/');
  
  // Strict comparison in CI
  await expect(page).toHaveScreenshot('page.png', {
    maxDiffPixels: process.env.CI ? 0 : 100
  });
});
```

---

## 💻 Practice Exercises

1. Create visual baselines
2. Handle dynamic content
3. Test across browsers
4. Configure thresholds
5. Set up CI visual testing

---

## ✅ Best Practices

- ✅ Disable animations
- ✅ Mask dynamic content
- ✅ Use appropriate thresholds
- ✅ Review diffs carefully
- ❌ Don't auto-update in CI
- ❌ Avoid testing third-party content

---

## 📝 Quick Reference

```typescript
// Page screenshot
await expect(page).toHaveScreenshot('name.png')

// Element screenshot
await expect(locator).toHaveScreenshot('name.png')

// Options
await expect(page).toHaveScreenshot('name.png', {
  maxDiffPixels: 100,
  threshold: 0.2,
  animations: 'disabled',
  mask: [locator1, locator2],
  fullPage: true
})

// Update snapshots
npx playwright test --update-snapshots

// Config
expect: {
  toHaveScreenshot: { maxDiffPixels: 50 }
}
```

