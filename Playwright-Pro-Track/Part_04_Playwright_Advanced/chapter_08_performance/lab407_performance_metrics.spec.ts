/**
 * Lab 407: Performance Metrics
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Measuring performance metrics:
 * 
 * - Navigation timing
 * - Paint timing
 * - Resource timing
 * - Custom metrics
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Measure load times
 * 2. Capture paint metrics
 * 3. Analyze resources
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Navigation Timing
test('navigation timing', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const timing = await page.evaluate(() => {
        const perf = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        return {
            domContentLoaded: perf.domContentLoadedEventEnd - perf.startTime,
            loadComplete: perf.loadEventEnd - perf.startTime,
            domInteractive: perf.domInteractive - perf.startTime,
            responseTime: perf.responseEnd - perf.requestStart,
        };
    });
    
    console.log('Navigation Timing:', timing);
    expect(timing.loadComplete).toBeLessThan(10000); // 10 seconds max
});

// Solution 2: First Contentful Paint
test('first contentful paint', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const fcp = await page.evaluate(() => {
        const entries = performance.getEntriesByName('first-contentful-paint');
        return entries.length > 0 ? entries[0].startTime : null;
    });
    
    console.log('First Contentful Paint:', fcp, 'ms');
    if (fcp) {
        expect(fcp).toBeLessThan(3000); // 3 seconds max
    }
});

// Solution 3: Largest Contentful Paint
test('largest contentful paint', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Wait for LCP
    await page.waitForTimeout(3000);
    
    const lcp = await page.evaluate(() => {
        return new Promise((resolve) => {
            new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                resolve(lastEntry.startTime);
            }).observe({ type: 'largest-contentful-paint', buffered: true });
            
            setTimeout(() => resolve(null), 5000);
        });
    });
    
    console.log('Largest Contentful Paint:', lcp, 'ms');
});

// Solution 4: Time to Interactive
test('time to interactive', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('https://playwright.dev');
    await page.waitForLoadState('networkidle');
    
    const tti = Date.now() - startTime;
    
    console.log('Time to Interactive:', tti, 'ms');
    expect(tti).toBeLessThan(10000);
});

// Solution 5: Resource Timing
test('resource timing', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const resources = await page.evaluate(() => {
        const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
        return entries.map(entry => ({
            name: entry.name.split('/').pop(),
            type: entry.initiatorType,
            duration: Math.round(entry.duration),
            size: entry.transferSize,
        })).slice(0, 10);
    });
    
    console.log('Top Resources:', resources);
});

// Solution 6: Memory Usage
test('memory usage', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const memory = await page.evaluate(() => {
        if ('memory' in performance) {
            const mem = (performance as any).memory;
            return {
                usedJSHeapSize: Math.round(mem.usedJSHeapSize / 1024 / 1024),
                totalJSHeapSize: Math.round(mem.totalJSHeapSize / 1024 / 1024),
            };
        }
        return null;
    });
    
    if (memory) {
        console.log('Memory Usage:', memory, 'MB');
    }
});

// Solution 7: Custom Performance Marks
test('custom performance marks', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Add custom marks
    await page.evaluate(() => {
        performance.mark('custom-start');
    });
    
    // Do some action
    await page.locator('header').click();
    
    await page.evaluate(() => {
        performance.mark('custom-end');
        performance.measure('custom-action', 'custom-start', 'custom-end');
    });
    
    const measure = await page.evaluate(() => {
        const entries = performance.getEntriesByName('custom-action');
        return entries.length > 0 ? entries[0].duration : null;
    });
    
    console.log('Custom Action Duration:', measure, 'ms');
});

// Solution 8: Network Metrics
test('network metrics', async ({ page }) => {
    const requests: any[] = [];
    
    page.on('request', request => {
        requests.push({
            url: request.url(),
            method: request.method(),
            startTime: Date.now(),
        });
    });
    
    page.on('response', response => {
        const request = requests.find(r => r.url === response.url());
        if (request) {
            request.duration = Date.now() - request.startTime;
            request.status = response.status();
        }
    });
    
    await page.goto('https://playwright.dev');
    
    console.log('Total Requests:', requests.length);
    console.log('Sample:', requests.slice(0, 5));
});

// Solution 9: Core Web Vitals
test('core web vitals', async ({ page }) => {
    await page.goto('https://playwright.dev');
    await page.waitForTimeout(3000);
    
    const vitals = await page.evaluate(() => {
        const fcp = performance.getEntriesByName('first-contentful-paint')[0];
        
        return {
            FCP: fcp ? fcp.startTime : null,
            // LCP and CLS require PerformanceObserver
        };
    });
    
    console.log('Core Web Vitals:', vitals);
});

// Solution 10: Performance Metrics Best Practices
test('performance metrics best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Measure multiple metrics
     * 2. Set performance budgets
     * 3. Test under realistic conditions
     * 4. Monitor trends over time
     * 5. Focus on user-centric metrics
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

