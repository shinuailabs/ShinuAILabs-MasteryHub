/**
 * Lab 582: Hook Best Practices
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Best practices for Cucumber hooks:
 * 
 * - Keep hooks focused
 * - Error handling
 * - Performance
 * - Maintainability
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Apply best practices
 * 2. Handle errors properly
 * 3. Optimize performance
 *
 * =====================
 * SOLUTION:
 * =====================
 */

import { Before, After, BeforeAll, AfterAll, Status } from '@cucumber/cucumber';
import { chromium, Browser } from '@playwright/test';

let browser: Browser;

// Solution 1: Keep Hooks Focused
// BAD: Hook does too much
Before(async function () {
    // Don't do all of this in one hook!
    // - Launch browser
    // - Create context
    // - Create page
    // - Login
    // - Navigate
    // - Setup data
});

// GOOD: Separate concerns
BeforeAll(async function () {
    // Only browser launch
    browser = await chromium.launch();
});

Before({ order: 1 }, async function () {
    // Only context/page creation
    this.context = await browser.newContext();
    this.page = await this.context.newPage();
});

Before({ tags: '@authenticated', order: 2 }, async function () {
    // Only authentication
    await this.page.goto('/login');
    await this.page.fill('#email', 'test@example.com');
    await this.page.fill('#password', 'password');
    await this.page.click('#login');
});

// Solution 2: Error Handling in Hooks
Before(async function () {
    try {
        this.context = await browser.newContext();
        this.page = await this.context.newPage();
    } catch (error) {
        console.error('Failed to create browser context:', error);
        throw error; // Re-throw to fail the scenario
    }
});

After(async function () {
    // Always cleanup, even if errors occur
    try {
        if (this.page) await this.page.close();
    } catch (error) {
        console.warn('Error closing page:', error);
    }
    
    try {
        if (this.context) await this.context.close();
    } catch (error) {
        console.warn('Error closing context:', error);
    }
});

// Solution 3: Conditional Hooks
Before(async function (scenario) {
    // Skip setup for certain scenarios
    const tags = scenario.pickle.tags.map(t => t.name);
    
    if (tags.includes('@skip-browser')) {
        this.skipBrowser = true;
        return;
    }
    
    this.context = await browser.newContext();
    this.page = await this.context.newPage();
});

// Solution 4: Timeout Handling
Before({ timeout: 60000 }, async function () {
    // Long-running setup with explicit timeout
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
});

// Solution 5: Reusable Hook Functions
async function setupBrowserContext(world: any) {
    world.context = await browser.newContext({
        viewport: { width: 1280, height: 720 },
    });
    world.page = await world.context.newPage();
}

async function cleanupBrowserContext(world: any) {
    if (world.page) await world.page.close();
    if (world.context) await world.context.close();
}

Before(async function () {
    await setupBrowserContext(this);
});

After(async function () {
    await cleanupBrowserContext(this);
});

// Solution 6: Logging Best Practices
Before(async function (scenario) {
    const scenarioName = scenario.pickle.name;
    const tags = scenario.pickle.tags.map(t => t.name).join(', ');
    
    console.log('\n' + '='.repeat(60));
    console.log(`Scenario: ${scenarioName}`);
    console.log(`Tags: ${tags || 'none'}`);
    console.log('='.repeat(60));
});

After(async function (scenario) {
    const status = scenario.result?.status;
    const duration = scenario.result?.duration;
    
    console.log('-'.repeat(60));
    console.log(`Result: ${status}`);
    if (duration) {
        console.log(`Duration: ${Number(duration.nanos) / 1000000}ms`);
    }
    console.log('='.repeat(60) + '\n');
});

// Solution 7: Resource Management
const resources: any[] = [];

Before(async function () {
    // Track resources for cleanup
    this.createdResources = [];
});

After(async function () {
    // Cleanup all created resources
    for (const resource of this.createdResources || []) {
        try {
            await resource.cleanup();
        } catch (error) {
            console.warn(`Failed to cleanup resource: ${error}`);
        }
    }
});

// Solution 8: Performance Optimization
// BAD: Creating new browser for each scenario
Before(async function () {
    // Don't do this - slow!
    // this.browser = await chromium.launch();
});

// GOOD: Reuse browser, create new context
Before(async function () {
    // Fast - reuse browser
    this.context = await browser.newContext();
    this.page = await this.context.newPage();
});

// Solution 9: Documentation
/**
 * Sets up the test environment before each scenario.
 * 
 * Creates:
 * - Browser context with default viewport
 * - Page instance
 * - Console log capture
 * 
 * @requires browser - Global browser instance from BeforeAll
 */
Before({ name: 'Setup test environment' }, async function () {
    this.context = await browser.newContext();
    this.page = await this.context.newPage();
});

// Solution 10: Best Practices Summary
/*
 * Hook Best Practices:
 * 
 * 1. Keep hooks focused - one responsibility per hook
 * 2. Use order property for dependencies
 * 3. Handle errors gracefully
 * 4. Always cleanup resources
 * 5. Use tags for conditional execution
 * 6. Set appropriate timeouts
 * 7. Reuse browser, create new contexts
 * 8. Log meaningful information
 * 9. Document complex hooks
 * 10. Test hooks independently
 */

// Solution 11: Export
export {};

