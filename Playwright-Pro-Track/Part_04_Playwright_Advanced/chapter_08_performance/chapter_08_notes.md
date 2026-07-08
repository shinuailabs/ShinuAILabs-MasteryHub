# Part 08: Performance Testing

## 📚 Overview
Playwright can measure and test web performance metrics including load times, Core Web Vitals, and more.

---

## 🎯 Key Concepts

### 1. Performance Timing

```typescript
test('measure load time', async ({ page }) => {
  await page.goto('/');
  
  // Get performance timing
  const timing = await page.evaluate(() => {
    const perf = performance.timing;
    return {
      loadTime: perf.loadEventEnd - perf.navigationStart,
      domContentLoaded: perf.domContentLoadedEventEnd - perf.navigationStart,
      firstByte: perf.responseStart - perf.navigationStart,
    };
  });
  
  console.log('Load time:', timing.loadTime, 'ms');
  expect(timing.loadTime).toBeLessThan(3000);
});
```

### 2. Core Web Vitals

```typescript
test('measure Core Web Vitals', async ({ page }) => {
  await page.goto('/');
  
  // Largest Contentful Paint (LCP)
  const lcp = await page.evaluate(() => {
    return new Promise(resolve => {
      new PerformanceObserver(list => {
        const entries = list.getEntries();
        resolve(entries[entries.length - 1].startTime);
      }).observe({ type: 'largest-contentful-paint', buffered: true });
    });
  });
  
  console.log('LCP:', lcp, 'ms');
  expect(lcp).toBeLessThan(2500);  // Good LCP < 2.5s
});

test('measure CLS', async ({ page }) => {
  await page.goto('/');
  
  // Cumulative Layout Shift (CLS)
  const cls = await page.evaluate(() => {
    return new Promise(resolve => {
      let clsValue = 0;
      new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        resolve(clsValue);
      }).observe({ type: 'layout-shift', buffered: true });
      
      setTimeout(() => resolve(clsValue), 5000);
    });
  });
  
  expect(cls).toBeLessThan(0.1);  // Good CLS < 0.1
});
```

### 3. Network Metrics

```typescript
test('measure network', async ({ page }) => {
  const requests: any[] = [];
  
  page.on('request', request => {
    requests.push({
      url: request.url(),
      method: request.method(),
      startTime: Date.now()
    });
  });
  
  page.on('response', response => {
    const req = requests.find(r => r.url === response.url());
    if (req) {
      req.duration = Date.now() - req.startTime;
      req.status = response.status();
    }
  });
  
  await page.goto('/');
  
  // Analyze requests
  const totalRequests = requests.length;
  const avgDuration = requests.reduce((a, r) => a + (r.duration || 0), 0) / totalRequests;
  
  console.log('Total requests:', totalRequests);
  console.log('Average duration:', avgDuration, 'ms');
});
```

### 4. Resource Timing

```typescript
test('resource timing', async ({ page }) => {
  await page.goto('/');
  
  const resources = await page.evaluate(() => {
    return performance.getEntriesByType('resource').map(r => ({
      name: r.name,
      type: r.initiatorType,
      duration: r.duration,
      size: r.transferSize
    }));
  });
  
  // Check for slow resources
  const slowResources = resources.filter(r => r.duration > 1000);
  console.log('Slow resources:', slowResources);
  
  // Check total size
  const totalSize = resources.reduce((a, r) => a + (r.size || 0), 0);
  console.log('Total size:', totalSize / 1024, 'KB');
});
```

### 5. Lighthouse Integration

```typescript
import { chromium } from '@playwright/test';
import lighthouse from 'lighthouse';

test('lighthouse audit', async () => {
  const browser = await chromium.launch({
    args: ['--remote-debugging-port=9222']
  });
  
  const page = await browser.newPage();
  await page.goto('http://localhost:3000');
  
  const result = await lighthouse('http://localhost:3000', {
    port: 9222,
    output: 'json'
  });
  
  const { performance, accessibility, seo } = result.lhr.categories;
  
  expect(performance.score).toBeGreaterThan(0.8);
  expect(accessibility.score).toBeGreaterThan(0.9);
  expect(seo.score).toBeGreaterThan(0.9);
  
  await browser.close();
});
```

### 6. Memory Profiling

```typescript
test('memory usage', async ({ page }) => {
  await page.goto('/');
  
  // Get memory info (Chrome only)
  const memory = await page.evaluate(() => {
    return (performance as any).memory;
  });
  
  console.log('Used JS Heap:', memory.usedJSHeapSize / 1024 / 1024, 'MB');
  console.log('Total JS Heap:', memory.totalJSHeapSize / 1024 / 1024, 'MB');
  
  // Check for memory leaks
  const initialMemory = memory.usedJSHeapSize;
  
  // Perform actions
  for (let i = 0; i < 10; i++) {
    await page.click('.load-more');
    await page.waitForTimeout(100);
  }
  
  const finalMemory = await page.evaluate(() => (performance as any).memory.usedJSHeapSize);
  const memoryGrowth = (finalMemory - initialMemory) / 1024 / 1024;
  
  console.log('Memory growth:', memoryGrowth, 'MB');
  expect(memoryGrowth).toBeLessThan(50);  // Less than 50MB growth
});
```

### 7. Performance Budgets

```typescript
const performanceBudget = {
  loadTime: 3000,
  firstByte: 500,
  domContentLoaded: 2000,
  totalRequests: 50,
  totalSize: 2 * 1024 * 1024,  // 2MB
};

test('performance budget', async ({ page }) => {
  const requests: any[] = [];
  page.on('response', r => requests.push(r));
  
  await page.goto('/');
  
  const timing = await page.evaluate(() => ({
    loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
    firstByte: performance.timing.responseStart - performance.timing.navigationStart,
    domContentLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
  }));
  
  expect(timing.loadTime).toBeLessThan(performanceBudget.loadTime);
  expect(timing.firstByte).toBeLessThan(performanceBudget.firstByte);
  expect(requests.length).toBeLessThan(performanceBudget.totalRequests);
});
```

---

## 💻 Practice Exercises

1. Measure page load times
2. Test Core Web Vitals
3. Analyze network requests
4. Set performance budgets
5. Profile memory usage

---

## ✅ Best Practices

- ✅ Set performance budgets
- ✅ Test on realistic networks
- ✅ Monitor Core Web Vitals
- ✅ Run performance tests in CI
- ❌ Don't test on fast networks only
- ❌ Avoid testing third-party scripts

---

## 📝 Quick Reference

```typescript
// Performance timing
const timing = await page.evaluate(() => performance.timing)

// Resource timing
const resources = await page.evaluate(() => 
  performance.getEntriesByType('resource')
)

// Memory (Chrome)
const memory = await page.evaluate(() => 
  (performance as any).memory
)

// Network monitoring
page.on('request', req => { })
page.on('response', res => { })

// Assertions
expect(loadTime).toBeLessThan(3000)
expect(lcp).toBeLessThan(2500)
expect(cls).toBeLessThan(0.1)
```

