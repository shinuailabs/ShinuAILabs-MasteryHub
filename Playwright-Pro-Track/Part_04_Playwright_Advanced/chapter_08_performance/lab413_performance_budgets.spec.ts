/**
 * Lab 413: Performance Budgets
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Setting and enforcing performance budgets:
 * 
 * - Load time budgets
 * - Resource size budgets
 * - Request count budgets
 * - Core Web Vitals budgets
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Define performance budgets
 * 2. Measure against budgets
 * 3. Fail tests on budget violations
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Performance budget configuration
const BUDGET = {
    loadTime: 5000, // 5 seconds
    fcp: 2500, // 2.5 seconds
    lcp: 4000, // 4 seconds
    totalSize: 2 * 1024 * 1024, // 2MB
    jsSize: 500 * 1024, // 500KB
    cssSize: 100 * 1024, // 100KB
    imageSize: 1 * 1024 * 1024, // 1MB
    requestCount: 50,
    thirdPartyRequests: 10,
};

// Solution 1: Load Time Budget
test('load time budget', async ({ page }) => {
    const start = Date.now();
    
    await page.goto('https://playwright.dev');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - start;
    
    console.log(`Load time: ${loadTime}ms (budget: ${BUDGET.loadTime}ms)`);
    expect(loadTime).toBeLessThan(BUDGET.loadTime);
});

// Solution 2: FCP Budget
test('FCP budget', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const fcp = await page.evaluate(() => {
        const entry = performance.getEntriesByName('first-contentful-paint')[0];
        return entry ? entry.startTime : null;
    });
    
    if (fcp) {
        console.log(`FCP: ${fcp}ms (budget: ${BUDGET.fcp}ms)`);
        expect(fcp).toBeLessThan(BUDGET.fcp);
    }
});

// Solution 3: Total Size Budget
test('total size budget', async ({ page }) => {
    let totalSize = 0;
    
    page.on('response', async response => {
        try {
            const body = await response.body();
            totalSize += body.length;
        } catch {
            // Ignore
        }
    });
    
    await page.goto('https://playwright.dev');
    
    console.log(`Total size: ${(totalSize / 1024).toFixed(2)}KB (budget: ${(BUDGET.totalSize / 1024).toFixed(2)}KB)`);
    expect(totalSize).toBeLessThan(BUDGET.totalSize);
});

// Solution 4: JavaScript Size Budget
test('JavaScript size budget', async ({ page }) => {
    let jsSize = 0;
    
    page.on('response', async response => {
        const contentType = response.headers()['content-type'] || '';
        if (contentType.includes('javascript')) {
            try {
                const body = await response.body();
                jsSize += body.length;
            } catch {
                // Ignore
            }
        }
    });
    
    await page.goto('https://playwright.dev');
    
    console.log(`JS size: ${(jsSize / 1024).toFixed(2)}KB (budget: ${(BUDGET.jsSize / 1024).toFixed(2)}KB)`);
    expect(jsSize).toBeLessThan(BUDGET.jsSize);
});

// Solution 5: CSS Size Budget
test('CSS size budget', async ({ page }) => {
    let cssSize = 0;
    
    page.on('response', async response => {
        const contentType = response.headers()['content-type'] || '';
        if (contentType.includes('css')) {
            try {
                const body = await response.body();
                cssSize += body.length;
            } catch {
                // Ignore
            }
        }
    });
    
    await page.goto('https://playwright.dev');
    
    console.log(`CSS size: ${(cssSize / 1024).toFixed(2)}KB (budget: ${(BUDGET.cssSize / 1024).toFixed(2)}KB)`);
    expect(cssSize).toBeLessThan(BUDGET.cssSize);
});

// Solution 6: Image Size Budget
test('image size budget', async ({ page }) => {
    let imageSize = 0;
    
    page.on('response', async response => {
        const contentType = response.headers()['content-type'] || '';
        if (contentType.includes('image')) {
            try {
                const body = await response.body();
                imageSize += body.length;
            } catch {
                // Ignore
            }
        }
    });
    
    await page.goto('https://playwright.dev');
    
    console.log(`Image size: ${(imageSize / 1024).toFixed(2)}KB (budget: ${(BUDGET.imageSize / 1024).toFixed(2)}KB)`);
    expect(imageSize).toBeLessThan(BUDGET.imageSize);
});

// Solution 7: Request Count Budget
test('request count budget', async ({ page }) => {
    let requestCount = 0;
    
    page.on('request', () => {
        requestCount++;
    });
    
    await page.goto('https://playwright.dev');
    
    console.log(`Request count: ${requestCount} (budget: ${BUDGET.requestCount})`);
    expect(requestCount).toBeLessThan(BUDGET.requestCount);
});

// Solution 8: Third-Party Request Budget
test('third party request budget', async ({ page }) => {
    let thirdPartyCount = 0;
    const mainDomain = 'playwright.dev';
    
    page.on('request', request => {
        const url = new URL(request.url());
        if (!url.hostname.includes(mainDomain)) {
            thirdPartyCount++;
        }
    });
    
    await page.goto('https://playwright.dev');
    
    console.log(`Third-party requests: ${thirdPartyCount} (budget: ${BUDGET.thirdPartyRequests})`);
    expect(thirdPartyCount).toBeLessThan(BUDGET.thirdPartyRequests);
});

// Solution 9: Combined Budget Check
test('combined budget check', async ({ page }) => {
    const metrics = {
        totalSize: 0,
        jsSize: 0,
        cssSize: 0,
        requestCount: 0,
    };
    
    page.on('request', () => metrics.requestCount++);
    
    page.on('response', async response => {
        const contentType = response.headers()['content-type'] || '';
        try {
            const body = await response.body();
            metrics.totalSize += body.length;
            if (contentType.includes('javascript')) metrics.jsSize += body.length;
            if (contentType.includes('css')) metrics.cssSize += body.length;
        } catch {
            // Ignore
        }
    });
    
    const start = Date.now();
    await page.goto('https://playwright.dev');
    const loadTime = Date.now() - start;
    
    console.log('Budget Report:');
    console.log(`  Load time: ${loadTime}ms / ${BUDGET.loadTime}ms`);
    console.log(`  Total size: ${(metrics.totalSize / 1024).toFixed(0)}KB / ${(BUDGET.totalSize / 1024).toFixed(0)}KB`);
    console.log(`  JS size: ${(metrics.jsSize / 1024).toFixed(0)}KB / ${(BUDGET.jsSize / 1024).toFixed(0)}KB`);
    console.log(`  Requests: ${metrics.requestCount} / ${BUDGET.requestCount}`);
});

// Solution 10: Performance Budgets Best Practices
test('performance budgets best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Set realistic budgets
     * 2. Monitor trends over time
     * 3. Alert on budget violations
     * 4. Include in CI/CD
     * 5. Review and adjust regularly
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

