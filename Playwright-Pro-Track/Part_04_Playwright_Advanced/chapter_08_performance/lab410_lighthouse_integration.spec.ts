/**
 * Lab 410: Lighthouse Integration
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Integrating Lighthouse with Playwright:
 * 
 * - Performance audits
 * - Accessibility audits
 * - Best practices
 * - SEO checks
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Run Lighthouse audits
 * 2. Check performance scores
 * 3. Validate accessibility
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Basic Performance Check
test('basic performance check', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('https://playwright.dev');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    console.log('Page load time:', loadTime, 'ms');
    expect(loadTime).toBeLessThan(10000); // 10 seconds max
});

// Solution 2: Core Web Vitals Check
test('core web vitals check', async ({ page }) => {
    await page.goto('https://playwright.dev');
    await page.waitForTimeout(3000);
    
    const metrics = await page.evaluate(() => {
        const fcp = performance.getEntriesByName('first-contentful-paint')[0];
        const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        return {
            FCP: fcp ? Math.round(fcp.startTime) : null,
            TTFB: Math.round(nav.responseStart - nav.requestStart),
            DOMContentLoaded: Math.round(nav.domContentLoadedEventEnd - nav.startTime),
        };
    });
    
    console.log('Core Web Vitals:', metrics);
    
    // Check thresholds
    if (metrics.FCP) {
        expect(metrics.FCP).toBeLessThan(2500); // Good FCP < 2.5s
    }
});

// Solution 3: Resource Count Check
test('resource count check', async ({ page }) => {
    let resourceCount = 0;
    
    page.on('response', () => {
        resourceCount++;
    });
    
    await page.goto('https://playwright.dev');
    
    console.log('Total resources:', resourceCount);
    expect(resourceCount).toBeLessThan(100); // Reasonable limit
});

// Solution 4: Image Optimization Check
test('image optimization check', async ({ page }) => {
    const images: any[] = [];
    
    page.on('response', async response => {
        const contentType = response.headers()['content-type'] || '';
        if (contentType.includes('image')) {
            try {
                const body = await response.body();
                images.push({
                    url: response.url(),
                    size: body.length,
                    type: contentType,
                });
            } catch {
                // Ignore
            }
        }
    });
    
    await page.goto('https://playwright.dev');
    
    const totalImageSize = images.reduce((sum, img) => sum + img.size, 0);
    console.log('Total image size:', (totalImageSize / 1024).toFixed(2), 'KB');
    console.log('Image count:', images.length);
});

// Solution 5: JavaScript Size Check
test('JavaScript size check', async ({ page }) => {
    let jsSize = 0;
    let jsCount = 0;
    
    page.on('response', async response => {
        const contentType = response.headers()['content-type'] || '';
        if (contentType.includes('javascript')) {
            try {
                const body = await response.body();
                jsSize += body.length;
                jsCount++;
            } catch {
                // Ignore
            }
        }
    });
    
    await page.goto('https://playwright.dev');
    
    console.log('Total JS size:', (jsSize / 1024).toFixed(2), 'KB');
    console.log('JS file count:', jsCount);
});

// Solution 6: CSS Size Check
test('CSS size check', async ({ page }) => {
    let cssSize = 0;
    let cssCount = 0;
    
    page.on('response', async response => {
        const contentType = response.headers()['content-type'] || '';
        if (contentType.includes('css')) {
            try {
                const body = await response.body();
                cssSize += body.length;
                cssCount++;
            } catch {
                // Ignore
            }
        }
    });
    
    await page.goto('https://playwright.dev');
    
    console.log('Total CSS size:', (cssSize / 1024).toFixed(2), 'KB');
    console.log('CSS file count:', cssCount);
});

// Solution 7: SEO Basic Checks
test('SEO basic checks', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const seo = await page.evaluate(() => {
        return {
            title: document.title,
            hasMetaDescription: !!document.querySelector('meta[name="description"]'),
            hasViewport: !!document.querySelector('meta[name="viewport"]'),
            hasCanonical: !!document.querySelector('link[rel="canonical"]'),
            h1Count: document.querySelectorAll('h1').length,
        };
    });
    
    console.log('SEO Checks:', seo);
    
    expect(seo.title).toBeTruthy();
    expect(seo.hasViewport).toBeTruthy();
    expect(seo.h1Count).toBe(1);
});

// Solution 8: Accessibility Basic Checks
test('accessibility basic checks', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const a11y = await page.evaluate(() => {
        const images = document.querySelectorAll('img');
        const imagesWithAlt = Array.from(images).filter(img => img.alt);
        
        return {
            hasLang: !!document.documentElement.lang,
            imagesWithAlt: imagesWithAlt.length,
            totalImages: images.length,
            hasSkipLink: !!document.querySelector('[href="#main"], [href="#content"]'),
        };
    });
    
    console.log('Accessibility Checks:', a11y);
    expect(a11y.hasLang).toBeTruthy();
});

// Solution 9: Performance Budget
test('performance budget', async ({ page }) => {
    const budget = {
        maxLoadTime: 5000,
        maxResources: 50,
        maxJSSize: 500 * 1024, // 500KB
        maxCSSSize: 100 * 1024, // 100KB
    };
    
    let jsSize = 0;
    let cssSize = 0;
    let resourceCount = 0;
    
    page.on('response', async response => {
        resourceCount++;
        const contentType = response.headers()['content-type'] || '';
        try {
            const body = await response.body();
            if (contentType.includes('javascript')) jsSize += body.length;
            if (contentType.includes('css')) cssSize += body.length;
        } catch {
            // Ignore
        }
    });
    
    const start = Date.now();
    await page.goto('https://playwright.dev');
    const loadTime = Date.now() - start;
    
    console.log('Budget Check:');
    console.log('  Load time:', loadTime, '/', budget.maxLoadTime);
    console.log('  Resources:', resourceCount, '/', budget.maxResources);
    console.log('  JS size:', jsSize, '/', budget.maxJSSize);
    console.log('  CSS size:', cssSize, '/', budget.maxCSSSize);
});

// Solution 10: Lighthouse Integration Best Practices
test('lighthouse integration best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Set performance budgets
     * 2. Check Core Web Vitals
     * 3. Monitor resource sizes
     * 4. Validate SEO basics
     * 5. Check accessibility
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

