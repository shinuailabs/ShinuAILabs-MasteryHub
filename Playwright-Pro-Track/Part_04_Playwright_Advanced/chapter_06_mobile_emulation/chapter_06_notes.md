# Part 06: Mobile Emulation

## 📚 Overview
Playwright can emulate mobile devices, including viewport, user agent, touch events, and geolocation.

---

## 🎯 Key Concepts

### 1. Device Emulation

```typescript
import { devices } from '@playwright/test';

// Use predefined device
const iPhone = devices['iPhone 13'];

test.use({ ...iPhone });

test('mobile test', async ({ page }) => {
  await page.goto('/');
  // Page renders as iPhone 13
});
```

### 2. Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: 'Desktop Chrome',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 13'] },
    },
    {
      name: 'Tablet',
      use: { ...devices['iPad Pro 11'] },
    },
  ],
});
```

### 3. Custom Viewport

```typescript
// Custom viewport
test.use({
  viewport: { width: 375, height: 667 },
});

// Change viewport in test
test('responsive test', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  // Desktop view
  
  await page.setViewportSize({ width: 375, height: 667 });
  // Mobile view
});
```

### 4. User Agent

```typescript
// Custom user agent
test.use({
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
});

// Check user agent in test
test('user agent', async ({ page }) => {
  const ua = await page.evaluate(() => navigator.userAgent);
  expect(ua).toContain('iPhone');
});
```

### 5. Touch Events

```typescript
// Enable touch
test.use({
  hasTouch: true,
});

test('touch interactions', async ({ page }) => {
  await page.goto('/');
  
  // Tap
  await page.tap('.button');
  
  // Touch and hold
  await page.touchscreen.tap(100, 200);
  
  // Swipe
  await page.locator('.carousel').evaluate(el => {
    el.dispatchEvent(new TouchEvent('touchstart', {
      touches: [{ clientX: 300, clientY: 200 }]
    }));
    el.dispatchEvent(new TouchEvent('touchmove', {
      touches: [{ clientX: 100, clientY: 200 }]
    }));
    el.dispatchEvent(new TouchEvent('touchend'));
  });
});
```

### 6. Geolocation

```typescript
// Set geolocation
test.use({
  geolocation: { latitude: 40.7128, longitude: -74.0060 },
  permissions: ['geolocation'],
});

test('location test', async ({ page }) => {
  await page.goto('/map');
  
  // Change location during test
  await page.context().setGeolocation({ 
    latitude: 51.5074, 
    longitude: -0.1278 
  });
  
  await page.reload();
});
```

### 7. Device Scale Factor

```typescript
// High DPI display
test.use({
  deviceScaleFactor: 2,
});

// Retina display
test.use({
  viewport: { width: 375, height: 667 },
  deviceScaleFactor: 3,
});
```

### 8. Color Scheme

```typescript
// Dark mode
test.use({
  colorScheme: 'dark',
});

// Light mode
test.use({
  colorScheme: 'light',
});

// Test both
test('dark mode', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(0, 0, 0)');
});
```

### 9. Responsive Testing

```typescript
const viewports = [
  { name: 'mobile', width: 375, height: 667 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1920, height: 1080 },
];

for (const vp of viewports) {
  test(`responsive ${vp.name}`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto('/');
    
    // Check responsive elements
    if (vp.width < 768) {
      await expect(page.locator('.mobile-menu')).toBeVisible();
      await expect(page.locator('.desktop-menu')).toBeHidden();
    } else {
      await expect(page.locator('.desktop-menu')).toBeVisible();
    }
    
    // Screenshot for visual comparison
    await expect(page).toHaveScreenshot(`home-${vp.name}.png`);
  });
}
```

---

## 💻 Practice Exercises

1. Test on multiple devices
2. Implement responsive tests
3. Test touch interactions
4. Use geolocation
5. Test dark/light modes

---

## ✅ Best Practices

- ✅ Use predefined devices
- ✅ Test critical breakpoints
- ✅ Verify touch interactions
- ✅ Test both orientations
- ❌ Don't test every device
- ❌ Avoid pixel-perfect mobile tests

---

## 📝 Quick Reference

```typescript
// Device emulation
import { devices } from '@playwright/test'
test.use({ ...devices['iPhone 13'] })

// Viewport
test.use({ viewport: { width: 375, height: 667 } })
await page.setViewportSize({ width: 375, height: 667 })

// Touch
test.use({ hasTouch: true })
await page.tap('.button')

// Geolocation
test.use({
  geolocation: { latitude: 40.7, longitude: -74.0 },
  permissions: ['geolocation']
})

// Color scheme
test.use({ colorScheme: 'dark' })
await page.emulateMedia({ colorScheme: 'dark' })
```

