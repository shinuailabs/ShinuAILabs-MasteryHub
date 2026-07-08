/**
 * Lab 400: Snapshot Testing
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Text and data snapshot testing:
 * 
 * - toMatchSnapshot
 * - Text snapshots
 * - JSON snapshots
 * - Custom snapshots
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create text snapshots
 * 2. Compare data snapshots
 * 3. Update snapshots
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Text Snapshot
test('text snapshot', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const title = await page.title();
    expect(title).toMatchSnapshot('page-title.txt');
});

// Solution 2: HTML Snapshot
test('HTML snapshot', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const headerHTML = await page.locator('header').innerHTML();
    expect(headerHTML).toMatchSnapshot('header.html');
});

// Solution 3: JSON Snapshot
test('JSON snapshot', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const data = await page.evaluate(() => {
        return {
            title: document.title,
            url: window.location.href,
        };
    });
    
    expect(JSON.stringify(data, null, 2)).toMatchSnapshot('page-data.json');
});

// Solution 4: Array Snapshot
test('array snapshot', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const links = await page.locator('header a').allTextContents();
    expect(links).toMatchSnapshot('header-links.txt');
});

// Solution 5: Object Snapshot
test('object snapshot', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const viewport = page.viewportSize();
    expect(viewport).toMatchSnapshot('viewport.json');
});

// Solution 6: CSS Snapshot
test('CSS snapshot', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const styles = await page.evaluate(() => {
        const header = document.querySelector('header');
        if (header) {
            const computed = window.getComputedStyle(header);
            return {
                backgroundColor: computed.backgroundColor,
                padding: computed.padding,
                position: computed.position,
            };
        }
        return null;
    });
    
    expect(styles).toMatchSnapshot('header-styles.json');
});

// Solution 7: API Response Snapshot
test('API response snapshot', async ({ page }) => {
    // Intercept API response
    let apiResponse: any = null;
    
    await page.route('**/api/**', async route => {
        const response = await route.fetch();
        apiResponse = await response.json();
        await route.fulfill({ response });
    });
    
    await page.goto('https://playwright.dev');
    
    if (apiResponse) {
        expect(apiResponse).toMatchSnapshot('api-response.json');
    }
});

// Solution 8: Accessibility Tree Snapshot
test('accessibility tree snapshot', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const accessibilityTree = await page.accessibility.snapshot();
    expect(accessibilityTree).toMatchSnapshot('accessibility.json');
});

// Solution 9: Custom Snapshot Name
test('custom snapshot name', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const title = await page.title();
    expect(title).toMatchSnapshot(['snapshots', 'titles', 'homepage.txt']);
});

// Solution 10: Snapshot Testing Best Practices
test('snapshot testing best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Use meaningful names
     * 2. Keep snapshots small
     * 3. Review snapshot changes
     * 4. Exclude dynamic data
     * 5. Organize snapshots
     */
    
    await page.goto('https://playwright.dev');
    
    const staticData = {
        hasHeader: await page.locator('header').isVisible(),
        hasFooter: await page.locator('footer').isVisible(),
    };
    
    expect(staticData).toMatchSnapshot('page-structure.json');
});

