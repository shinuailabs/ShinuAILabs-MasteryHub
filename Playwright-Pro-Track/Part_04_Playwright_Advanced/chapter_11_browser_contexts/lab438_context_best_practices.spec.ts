/**
 * Lab 438: Browser Context Best Practices
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Best practices for browser contexts:
 * 
 * - Context management
 * - Resource optimization
 * - Test isolation
 * - Performance tips
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Apply context best practices
 * 2. Optimize resource usage
 * 3. Ensure test isolation
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Proper Context Cleanup
test('proper context cleanup', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
        await page.goto('https://playwright.dev');
        await expect(page).toHaveTitle(/Playwright/);
    } finally {
        // Always clean up
        await context.close();
    }
});

// Solution 2: Reusing Context for Related Tests
test.describe('reusing context', () => {
    test.describe.configure({ mode: 'serial' });
    
    let sharedPage: any;
    
    test.beforeAll(async ({ browser }) => {
        const context = await browser.newContext();
        sharedPage = await context.newPage();
        await sharedPage.goto('https://playwright.dev');
    });
    
    test('first test', async () => {
        await expect(sharedPage).toHaveTitle(/Playwright/);
    });
    
    test('second test', async () => {
        await expect(sharedPage.locator('body')).toBeVisible();
    });
    
    test.afterAll(async () => {
        await sharedPage.context().close();
    });
});

// Solution 3: Context Options Configuration
test('context options configuration', async ({ browser }) => {
    const context = await browser.newContext({
        viewport: { width: 1280, height: 720 },
        locale: 'en-US',
        timezoneId: 'America/New_York',
        colorScheme: 'light',
        reducedMotion: 'reduce',
        forcedColors: 'none',
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    await expect(page).toHaveTitle(/Playwright/);
    
    await context.close();
});

// Solution 4: Parallel Context Usage
test('parallel context usage', async ({ browser }) => {
    // Create multiple contexts for parallel testing
    const contexts = await Promise.all([
        browser.newContext(),
        browser.newContext(),
        browser.newContext(),
    ]);
    
    const pages = await Promise.all(
        contexts.map(ctx => ctx.newPage())
    );
    
    // Navigate all pages in parallel
    await Promise.all(
        pages.map(page => page.goto('https://playwright.dev'))
    );
    
    // Verify all pages
    for (const page of pages) {
        await expect(page).toHaveTitle(/Playwright/);
    }
    
    // Clean up all contexts
    await Promise.all(contexts.map(ctx => ctx.close()));
});

// Solution 5: Context Event Handling
test('context event handling', async ({ browser }) => {
    const context = await browser.newContext();
    
    // Listen for new pages
    context.on('page', (page) => {
        console.log('New page opened:', page.url());
    });
    
    // Listen for page close
    context.on('close', () => {
        console.log('Context closed');
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    await context.close();
});

// Solution 6: Context with Network Interception
test('context with network interception', async ({ browser }) => {
    const context = await browser.newContext();
    
    // Set up route at context level (applies to all pages)
    await context.route('**/*.png', route => route.abort());
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    await expect(page).toHaveTitle(/Playwright/);
    
    await context.close();
});

// Solution 7: Context State Management
test('context state management', async ({ browser }) => {
    // Create context with initial state
    const context = await browser.newContext();
    const page = await context.newPage();
    
    await page.goto('https://playwright.dev');
    
    // Add cookies
    await context.addCookies([{
        name: 'session',
        value: 'test123',
        domain: 'playwright.dev',
        path: '/',
    }]);
    
    // Save state for later use
    const state = await context.storageState();
    console.log('State saved with', state.cookies.length, 'cookies');
    
    await context.close();
});

// Solution 8: Context Resource Limits
test('context resource limits', async ({ browser }) => {
    const context = await browser.newContext();
    
    // Limit number of pages
    const maxPages = 5;
    const pages: any[] = [];
    
    for (let i = 0; i < maxPages; i++) {
        pages.push(await context.newPage());
    }
    
    console.log('Created', pages.length, 'pages');
    
    // Close excess pages
    while (pages.length > 2) {
        const page = pages.pop();
        await page.close();
    }
    
    console.log('Remaining pages:', context.pages().length);
    
    await context.close();
});

// Solution 9: Context Timeout Configuration
test('context timeout configuration', async ({ browser }) => {
    const context = await browser.newContext();
    
    // Set default timeout for all operations
    context.setDefaultTimeout(30000);
    context.setDefaultNavigationTimeout(60000);
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    await expect(page).toHaveTitle(/Playwright/);
    
    await context.close();
});

// Solution 10: Context Best Practices Summary
test('context best practices summary', async ({ page }) => {
    /*
     * Browser Context Best Practices:
     * 
     * Resource Management:
     * - Always close contexts when done
     * - Limit number of concurrent contexts
     * - Reuse contexts for related tests
     * 
     * Configuration:
     * - Set viewport for consistency
     * - Configure locale and timezone
     * - Set appropriate timeouts
     * 
     * Isolation:
     * - Use separate contexts for different users
     * - Don't share state between unrelated tests
     * - Clear cookies/storage when needed
     * 
     * Performance:
     * - Use parallel contexts for speed
     * - Set up routes at context level
     * - Save/restore state for auth
     * 
     * Events:
     * - Handle page events at context level
     * - Listen for context close
     * - Log important events
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

