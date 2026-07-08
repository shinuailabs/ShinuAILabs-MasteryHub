/**
 * Lab 574: Before Hooks
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Using Before hooks in Cucumber:
 * 
 * - Before each scenario
 * - Tagged hooks
 * - Setup operations
 * - Browser initialization
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create Before hooks
 * 2. Use tagged hooks
 * 3. Initialize browser
 *
 * =====================
 * SOLUTION:
 * =====================
 */

import { Before, BeforeAll, Status } from '@cucumber/cucumber';
import { chromium, Browser, BrowserContext, Page } from '@playwright/test';

// Global browser instance
let browser: Browser;

// Solution 1: BeforeAll - Runs once before all scenarios
BeforeAll(async function () {
    console.log('Starting test suite...');
    browser = await chromium.launch({
        headless: process.env.HEADLESS !== 'false',
    });
});

// Solution 2: Before - Runs before each scenario
Before(async function () {
    // Create new context and page for each scenario
    this.context = await browser.newContext({
        viewport: { width: 1280, height: 720 },
    });
    this.page = await this.context.newPage();
    
    // Set default timeout
    this.page.setDefaultTimeout(30000);
});

// Solution 3: Before with Tag - Only for specific scenarios
Before({ tags: '@auth' }, async function () {
    // Setup authentication state
    this.authToken = 'test-auth-token';
    await this.page.evaluate((token: string) => {
        localStorage.setItem('authToken', token);
    }, this.authToken);
});

// Solution 4: Before with Multiple Tags (AND)
Before({ tags: '@smoke and @critical' }, async function () {
    console.log('Running critical smoke test');
    this.isCriticalTest = true;
});

// Solution 5: Before with Multiple Tags (OR)
Before({ tags: '@api or @integration' }, async function () {
    // Setup API client
    this.apiClient = {
        baseUrl: process.env.API_URL || 'http://localhost:3000',
        headers: { 'Content-Type': 'application/json' },
    };
});

// Solution 6: Before with NOT Tag
Before({ tags: 'not @skip' }, async function () {
    // This runs for all scenarios except those tagged @skip
    this.shouldRun = true;
});

// Solution 7: Before with Named Hook
Before({ name: 'Setup test data' }, async function () {
    this.testData = {
        timestamp: Date.now(),
        testId: `test-${Math.random().toString(36).substr(2, 9)}`,
    };
});

// Solution 8: Before with Order (lower runs first)
Before({ tags: '@database', order: 1 }, async function () {
    // First: Setup database connection
    console.log('Setting up database connection');
    this.dbConnection = { connected: true };
});

Before({ tags: '@database', order: 2 }, async function () {
    // Second: Seed test data
    console.log('Seeding test data');
    this.seedData = { users: [], products: [] };
});

// Solution 9: Before with Scenario Info
Before(async function (scenario) {
    console.log(`Starting scenario: ${scenario.pickle.name}`);
    console.log(`Tags: ${scenario.pickle.tags.map(t => t.name).join(', ')}`);
    
    this.scenarioName = scenario.pickle.name;
    this.scenarioTags = scenario.pickle.tags;
});

// Solution 10: Before for Mobile Testing
Before({ tags: '@mobile' }, async function () {
    // Close existing context and create mobile context
    await this.context?.close();
    
    this.context = await browser.newContext({
        viewport: { width: 375, height: 667 },
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        isMobile: true,
        hasTouch: true,
    });
    this.page = await this.context.newPage();
});

// Solution 11: Before for Authenticated Tests
Before({ tags: '@authenticated' }, async function () {
    // Login before test
    await this.page.goto('/login');
    await this.page.fill('#username', 'testuser@example.com');
    await this.page.fill('#password', 'password123');
    await this.page.click('#login-btn');
    await this.page.waitForURL(/dashboard/);
});

// Export browser for other hooks
export { browser };

