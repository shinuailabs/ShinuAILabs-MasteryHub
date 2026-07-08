/**
 * Lab 603: Tagged Hooks
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Using tags with hooks:
 * 
 * - Conditional setup
 * - Conditional teardown
 * - Tag-specific behavior
 * - Hook filtering
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create tagged hooks
 * 2. Implement conditional logic
 * 3. Handle cleanup
 *
 * =====================
 * SOLUTION:
 * =====================
 */

import { Before, After, BeforeAll, AfterAll } from '@cucumber/cucumber';
import { chromium, Browser, BrowserContext, Page } from '@playwright/test';

let browser: Browser;

// Solution 1: Global Setup (no tag filter)
BeforeAll(async function () {
    browser = await chromium.launch({ headless: true });
});

AfterAll(async function () {
    await browser?.close();
});

// Solution 2: Tagged Before Hook - Authentication
Before({ tags: '@authenticated' }, async function () {
    this.context = await browser.newContext();
    this.page = await this.context.newPage();
    
    // Perform login
    await this.page.goto('/login');
    await this.page.fill('#email', 'test@example.com');
    await this.page.fill('#password', 'password123');
    await this.page.click('#login-btn');
    await this.page.waitForURL('/dashboard');
    
    console.log('Authenticated user setup complete');
});

// Solution 3: Tagged Before Hook - Admin User
Before({ tags: '@admin' }, async function () {
    this.context = await browser.newContext();
    this.page = await this.context.newPage();
    
    // Login as admin
    await this.page.goto('/login');
    await this.page.fill('#email', 'admin@example.com');
    await this.page.fill('#password', 'adminpass123');
    await this.page.click('#login-btn');
    await this.page.waitForURL('/admin/dashboard');
    
    this.isAdmin = true;
    console.log('Admin user setup complete');
});

// Solution 4: Tagged Before Hook - API Testing
Before({ tags: '@api' }, async function () {
    // No browser needed for API tests
    this.apiContext = await browser.newContext();
    this.request = this.apiContext.request;
    
    // Set up API authentication
    this.apiToken = 'test-api-token';
    this.apiHeaders = {
        'Authorization': `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json',
    };
    
    console.log('API testing setup complete');
});

// Solution 5: Tagged Before Hook - Database Setup
Before({ tags: '@database' }, async function () {
    // Set up test database connection
    this.dbConnection = {
        host: 'localhost',
        database: 'test_db',
        connected: true,
    };
    
    // Seed test data
    this.testData = {
        users: [
            { id: 1, name: 'Test User 1' },
            { id: 2, name: 'Test User 2' },
        ],
    };
    
    console.log('Database setup complete');
});

// Solution 6: Tagged After Hook - Screenshot on Failure
After({ tags: '@screenshot-on-failure' }, async function (scenario) {
    if (scenario.result?.status === 'FAILED' && this.page) {
        const screenshot = await this.page.screenshot({
            fullPage: true,
        });
        
        await this.attach(screenshot, 'image/png');
        console.log('Screenshot captured for failed scenario');
    }
});

// Solution 7: Tagged After Hook - Cleanup Test Data
After({ tags: '@cleanup-required' }, async function () {
    if (this.createdResources) {
        for (const resource of this.createdResources) {
            try {
                await this.page?.request.delete(`/api/resources/${resource.id}`);
                console.log(`Cleaned up resource: ${resource.id}`);
            } catch (error) {
                console.error(`Failed to cleanup resource: ${resource.id}`);
            }
        }
    }
});

// Solution 8: Tagged After Hook - Database Cleanup
After({ tags: '@database' }, async function () {
    if (this.dbConnection?.connected) {
        // Rollback any test transactions
        console.log('Rolling back database changes');
        this.dbConnection.connected = false;
    }
});

// Solution 9: Combined Tag Expression in Hook
Before({ tags: '@authenticated and @admin' }, async function () {
    // This runs only for scenarios with BOTH tags
    this.superAdmin = true;
    console.log('Super admin setup');
});

Before({ tags: '@smoke or @critical' }, async function () {
    // This runs for scenarios with EITHER tag
    this.priorityTest = true;
    console.log('Priority test setup');
});

Before({ tags: 'not @slow' }, async function () {
    // This runs for all scenarios EXCEPT @slow
    this.timeout = 30000; // Shorter timeout for fast tests
});

// Solution 10: Tagged Hook with Order
Before({ tags: '@authenticated', order: 1 }, async function () {
    console.log('First: Create browser context');
    this.context = await browser.newContext();
});

Before({ tags: '@authenticated', order: 2 }, async function () {
    console.log('Second: Create page');
    this.page = await this.context.newPage();
});

Before({ tags: '@authenticated', order: 3 }, async function () {
    console.log('Third: Perform login');
    // Login logic here
});

// Solution 11: Export
export {};

