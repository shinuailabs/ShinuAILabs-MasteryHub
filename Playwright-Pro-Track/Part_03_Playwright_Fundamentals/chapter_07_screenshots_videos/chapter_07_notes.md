# Part 07: Screenshots & Videos

## 📚 Overview
Playwright can capture screenshots and videos for debugging, visual testing, and documentation.

---

## 🎯 Key Concepts

### 1. Page Screenshots

```typescript
// Full page screenshot
await page.screenshot({ path: 'screenshot.png' });

// Full page (including scrollable area)
await page.screenshot({ path: 'full.png', fullPage: true });

// Specific quality (JPEG only)
await page.screenshot({ 
  path: 'screenshot.jpg', 
  type: 'jpeg',
  quality: 80 
});

// Return buffer instead of saving
const buffer = await page.screenshot();
```

### 2. Element Screenshots

```typescript
// Screenshot specific element
await page.locator('.card').screenshot({ path: 'card.png' });

// With options
await page.locator('.chart').screenshot({
  path: 'chart.png',
  animations: 'disabled',  // Disable CSS animations
  scale: 'css'  // or 'device'
});
```

### 3. Screenshot Options

```typescript
await page.screenshot({
  path: 'screenshot.png',
  fullPage: true,
  type: 'png',  // or 'jpeg'
  
  // Clip to specific area
  clip: {
    x: 0,
    y: 0,
    width: 800,
    height: 600
  },
  
  // Omit background (transparent)
  omitBackground: true,
  
  // Disable animations
  animations: 'disabled',
  
  // Mask elements
  mask: [page.locator('.sensitive-data')],
  
  // Scale
  scale: 'css'  // or 'device'
});
```

### 4. Visual Comparison

```typescript
// Compare with baseline
await expect(page).toHaveScreenshot('homepage.png');

// With options
await expect(page).toHaveScreenshot('homepage.png', {
  maxDiffPixels: 100,
  maxDiffPixelRatio: 0.1,
  threshold: 0.2,
  animations: 'disabled'
});

// Element comparison
await expect(page.locator('.chart')).toHaveScreenshot('chart.png');

// Update baselines
// npx playwright test --update-snapshots
```

### 5. Video Recording

```typescript
// Enable in config
// playwright.config.ts
export default defineConfig({
  use: {
    video: 'on',  // Always record
    // video: 'on-first-retry',  // Only on retry
    // video: 'retain-on-failure',  // Keep only on failure
    // video: 'off',  // Disable
  }
});

// Video options
use: {
  video: {
    mode: 'on',
    size: { width: 1280, height: 720 }
  }
}
```

### 6. Access Video in Test

```typescript
test('record video', async ({ page }, testInfo) => {
  await page.goto('/');
  // ... test actions
  
  // Get video path after test
  const video = page.video();
  if (video) {
    const path = await video.path();
    console.log('Video saved to:', path);
    
    // Attach to report
    testInfo.attach('video', {
      path: path,
      contentType: 'video/webm'
    });
  }
});
```

### 7. Trace Recording

```typescript
// Enable in config
export default defineConfig({
  use: {
    trace: 'on',  // Always record
    // trace: 'on-first-retry',
    // trace: 'retain-on-failure',
  }
});

// View trace
// npx playwright show-trace trace.zip

// Programmatic trace
await context.tracing.start({ screenshots: true, snapshots: true });
// ... test actions
await context.tracing.stop({ path: 'trace.zip' });
```

### 8. Screenshot on Failure

```typescript
// Enable in config
export default defineConfig({
  use: {
    screenshot: 'only-on-failure',
    // screenshot: 'on',  // Always
    // screenshot: 'off',  // Never
  }
});

// Manual screenshot on failure
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    const screenshot = await page.screenshot();
    await testInfo.attach('screenshot', {
      body: screenshot,
      contentType: 'image/png'
    });
  }
});
```

### 9. PDF Generation

```typescript
// Generate PDF (Chromium only)
await page.pdf({ path: 'page.pdf' });

// With options
await page.pdf({
  path: 'page.pdf',
  format: 'A4',
  printBackground: true,
  margin: {
    top: '1cm',
    bottom: '1cm',
    left: '1cm',
    right: '1cm'
  }
});

// Return buffer
const pdfBuffer = await page.pdf();
```

---

## 💻 Practice Exercises

1. Capture full page screenshots
2. Implement visual regression tests
3. Record test videos
4. Use trace viewer for debugging
5. Generate PDF reports

---

## ✅ Best Practices

- ✅ Use visual comparison for UI tests
- ✅ Enable traces for debugging
- ✅ Capture screenshots on failure
- ✅ Disable animations for consistent screenshots
- ❌ Don't store large videos in repo
- ❌ Avoid pixel-perfect comparisons

---

## 📝 Quick Reference

```typescript
// Screenshot
await page.screenshot({ path: 'shot.png' })
await page.screenshot({ fullPage: true })
await locator.screenshot({ path: 'element.png' })

// Visual comparison
await expect(page).toHaveScreenshot('name.png')

// Video config
use: { video: 'retain-on-failure' }

// Trace config
use: { trace: 'on-first-retry' }

// View trace
npx playwright show-trace trace.zip

// PDF
await page.pdf({ path: 'page.pdf' })
```

