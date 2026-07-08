/**
 * Lab 411: Tracing
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Using Playwright tracing:
 * 
 * - Start/stop tracing
 * - Trace viewer
 * - Screenshots in trace
 * - Network in trace
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Record traces
 * 2. Analyze trace data
 * 3. Debug with traces
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Basic Tracing
test('basic tracing', async ({ context, page }) => {
    // Start tracing
    await context.tracing.start({ screenshots: true, snapshots: true });
    
    await page.goto('https://playwright.dev');
    await page.click('text=Get started');
    
    // Stop and save trace
    await context.tracing.stop({ path: 'traces/basic-trace.zip' });
});

// Solution 2: Tracing with Sources
test('tracing with sources', async ({ context, page }) => {
    await context.tracing.start({
        screenshots: true,
        snapshots: true,
        sources: true, // Include source files
    });
    
    await page.goto('https://playwright.dev');
    
    await context.tracing.stop({ path: 'traces/with-sources.zip' });
});

// Solution 3: Tracing Specific Actions
test('tracing specific actions', async ({ context, page }) => {
    await page.goto('https://playwright.dev');
    
    // Start tracing for specific section
    await context.tracing.start({ screenshots: true, snapshots: true });
    
    // Actions to trace
    await page.click('text=Get started');
    await page.waitForLoadState('networkidle');
    
    // Stop tracing
    await context.tracing.stop({ path: 'traces/specific-actions.zip' });
});

// Solution 4: Trace on Failure
test('trace on failure', async ({ context, page }) => {
    await context.tracing.start({ screenshots: true, snapshots: true });
    
    try {
        await page.goto('https://playwright.dev');
        await expect(page).toHaveTitle(/Playwright/);
        
        // This would fail - for demo purposes
        // await expect(page.locator('.nonexistent')).toBeVisible({ timeout: 1000 });
    } catch (error) {
        // Save trace on failure
        await context.tracing.stop({ path: 'traces/failure-trace.zip' });
        throw error;
    }
    
    await context.tracing.stop({ path: 'traces/success-trace.zip' });
});

// Solution 5: Trace Chunks
test('trace chunks', async ({ context, page }) => {
    await context.tracing.start({ screenshots: true, snapshots: true });
    
    // First chunk
    await page.goto('https://playwright.dev');
    await context.tracing.startChunk();
    await page.click('text=Get started');
    await context.tracing.stopChunk({ path: 'traces/chunk-1.zip' });
    
    // Second chunk
    await context.tracing.startChunk();
    await page.goBack();
    await context.tracing.stopChunk({ path: 'traces/chunk-2.zip' });
    
    await context.tracing.stop();
});

// Solution 6: Trace with Title
test('trace with title', async ({ context, page }) => {
    await context.tracing.start({
        screenshots: true,
        snapshots: true,
        title: 'Homepage Navigation Test',
    });
    
    await page.goto('https://playwright.dev');
    await page.click('text=Get started');
    
    await context.tracing.stop({ path: 'traces/titled-trace.zip' });
});

// Solution 7: Conditional Tracing
test('conditional tracing', async ({ context, page }) => {
    const shouldTrace = process.env.TRACE === 'true';
    
    if (shouldTrace) {
        await context.tracing.start({ screenshots: true, snapshots: true });
    }
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
    
    if (shouldTrace) {
        await context.tracing.stop({ path: 'traces/conditional-trace.zip' });
    }
});

// Solution 8: Trace Analysis Helper
test('trace analysis helper', async ({ context, page }) => {
    await context.tracing.start({ screenshots: true, snapshots: true });
    
    const startTime = Date.now();
    
    await page.goto('https://playwright.dev');
    const navigationTime = Date.now() - startTime;
    
    await page.click('text=Get started');
    const totalTime = Date.now() - startTime;
    
    console.log('Navigation time:', navigationTime, 'ms');
    console.log('Total time:', totalTime, 'ms');
    
    await context.tracing.stop({ path: 'traces/analysis-trace.zip' });
});

// Solution 9: Trace with Network
test('trace with network', async ({ context, page }) => {
    await context.tracing.start({
        screenshots: true,
        snapshots: true,
    });
    
    // Network requests will be captured in trace
    await page.goto('https://playwright.dev');
    
    // API calls will also be in trace
    // await page.request.get('https://api.example.com/data');
    
    await context.tracing.stop({ path: 'traces/network-trace.zip' });
});

// Solution 10: Tracing Best Practices
test('tracing best practices', async ({ context, page }) => {
    /*
     * Best Practices:
     * 1. Enable tracing on CI failures
     * 2. Include screenshots and snapshots
     * 3. Use meaningful trace names
     * 4. Use chunks for long tests
     * 5. Clean up old traces
     */
    
    await context.tracing.start({
        screenshots: true,
        snapshots: true,
        sources: true,
        title: 'Best Practices Demo',
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
    
    await context.tracing.stop({ path: 'traces/best-practices.zip' });
});

