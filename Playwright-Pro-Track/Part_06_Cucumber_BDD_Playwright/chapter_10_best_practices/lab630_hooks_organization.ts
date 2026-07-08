/**
 * Lab 630: Hooks Organization Best Practices
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Organizing hooks effectively:
 * 
 * - Hook ordering
 * - Tagged hooks
 * - Cleanup patterns
 * - Error handling
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Organize hooks properly
 * 2. Use tagged hooks
 * 3. Handle cleanup
 *
 * =====================
 * SOLUTION:
 * =====================
 */

import { BeforeAll, AfterAll, Before, After, AfterStep, Status } from '@cucumber/cucumber';
import { chromium, Browser, BrowserContext, Page } from '@playwright/test';

let browser: Browser;

/*
 * Best Practice 1: Global Setup in BeforeAll
 * - Launch browser once
 * - Set up global resources
 * - Initialize test data
 */
BeforeAll(async function () {
    console.log('🚀 Starting test suite...');
    
    browser = await chromium.launch({
        headless: process.env.HEADLESS !== 'false',
    });
    
    console.log('✅ Browser launched');
});

/*
 * Best Practice 2: Global Teardown in AfterAll
 * - Close browser
 * - Clean up global resources
 * - Generate reports
 */
AfterAll(async function () {
    if (browser) {
        await browser.close();
        console.log('✅ Browser closed');
    }
    
    console.log('🏁 Test suite completed');
});

/*
 * Best Practice 3: Scenario Setup in Before
 * - Create fresh context
 * - Initialize scenario state
 * - Set up test data
 */
Before(async function (scenario) {
    // Create isolated context for each scenario
    this.context = await browser.newContext({
        viewport: { width: 1280, height: 720 },
    });
    
    this.page = await this.context.newPage();
    
    // Store scenario info for debugging
    this.scenarioName = scenario.pickle.name;
    this.scenarioTags = scenario.pickle.tags.map(t => t.name);
    
    // Initialize console log capture
    this.consoleLogs = [];
    this.page.on('console', msg => {
        this.consoleLogs.push(`[${msg.type()}] ${msg.text()}`);
    });
});

/*
 * Best Practice 4: Tagged Hooks for Specific Setup
 */
Before({ tags: '@authenticated' }, async function () {
    // Login before authenticated scenarios
    await this.page.goto('/login');
    await this.page.fill('#email', 'user@test.com');
    await this.page.fill('#password', 'password123');
    await this.page.click('#login-btn');
    await this.page.waitForURL('**/dashboard');
});

Before({ tags: '@admin' }, async function () {
    // Login as admin
    await this.page.goto('/login');
    await this.page.fill('#email', 'admin@test.com');
    await this.page.fill('#password', 'admin123');
    await this.page.click('#login-btn');
    await this.page.waitForURL('**/admin');
});

Before({ tags: '@mobile' }, async function () {
    // Close desktop context and create mobile
    await this.page.close();
    await this.context.close();
    
    this.context = await browser.newContext({
        viewport: { width: 375, height: 667 },
        isMobile: true,
    });
    this.page = await this.context.newPage();
});

/*
 * Best Practice 5: AfterStep for Debugging
 */
AfterStep(async function (step) {
    // Capture screenshot after each step (optional, for debugging)
    if (process.env.CAPTURE_ALL_STEPS === 'true') {
        const screenshot = await this.page.screenshot();
        await this.attach(screenshot, 'image/png');
    }
});

/*
 * Best Practice 6: Comprehensive After Hook
 */
After(async function (scenario) {
    // Capture artifacts on failure
    if (scenario.result?.status === Status.FAILED) {
        // Screenshot
        if (this.page) {
            const screenshot = await this.page.screenshot({ fullPage: true });
            await this.attach(screenshot, 'image/png');
            
            // Page URL
            await this.attach(`URL: ${this.page.url()}`, 'text/plain');
            
            // Console logs
            if (this.consoleLogs?.length) {
                await this.attach(
                    `Console Logs:\n${this.consoleLogs.join('\n')}`,
                    'text/plain'
                );
            }
            
            // Page HTML (optional)
            const html = await this.page.content();
            await this.attach(html, 'text/html');
        }
    }
    
    // Always cleanup
    if (this.page) {
        await this.page.close();
    }
    if (this.context) {
        await this.context.close();
    }
});

/*
 * Best Practice 7: Tagged Cleanup Hooks
 */
After({ tags: '@database' }, async function () {
    // Clean up database changes
    if (this.createdRecords?.length) {
        for (const record of this.createdRecords) {
            // Delete created records
            await this.page.request.delete(`/api/${record.type}/${record.id}`);
        }
    }
});

After({ tags: '@file-upload' }, async function () {
    // Clean up uploaded files
    if (this.uploadedFiles?.length) {
        for (const file of this.uploadedFiles) {
            await this.page.request.delete(`/api/files/${file.id}`);
        }
    }
});

/*
 * Best Practice 8: Hook Order Control
 * Hooks run in order of definition
 * Use multiple hooks for clear separation of concerns
 */

// Export
export {};

