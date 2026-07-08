/**
 * Lab 581: Playwright Integration Hooks
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Integrating Playwright with Cucumber hooks:
 * 
 * - Browser lifecycle
 * - Context management
 * - Page setup
 * - Tracing
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Setup Playwright in hooks
 * 2. Manage browser lifecycle
 * 3. Configure tracing
 *
 * =====================
 * SOLUTION:
 * =====================
 */

import { Before, After, BeforeAll, AfterAll, Status } from '@cucumber/cucumber';
import { chromium, firefox, webkit, Browser, BrowserContext, Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Global browser instance
let browser: Browser;

// Solution 1: BeforeAll - Launch Browser
BeforeAll(async function () {
    const browserType = process.env.BROWSER || 'chromium';
    const headless = process.env.HEADLESS !== 'false';
    
    console.log(`Launching ${browserType} browser (headless: ${headless})`);
    
    switch (browserType) {
        case 'firefox':
            browser = await firefox.launch({ headless });
            break;
        case 'webkit':
            browser = await webkit.launch({ headless });
            break;
        default:
            browser = await chromium.launch({ headless });
    }
});

// Solution 2: Before - Create Context and Page
Before(async function (scenario) {
    // Create context with options
    this.context = await browser.newContext({
        viewport: { width: 1280, height: 720 },
        ignoreHTTPSErrors: true,
        locale: 'en-US',
        timezoneId: 'America/New_York',
    });
    
    // Create page
    this.page = await this.context.newPage();
    
    // Set default timeout
    this.page.setDefaultTimeout(30000);
    this.page.setDefaultNavigationTimeout(30000);
    
    // Store scenario info
    this.scenarioName = scenario.pickle.name;
});

// Solution 3: Before with Tracing
Before({ tags: '@trace' }, async function (scenario) {
    // Start tracing
    await this.context.tracing.start({
        screenshots: true,
        snapshots: true,
        sources: true,
    });
    
    this.tracingEnabled = true;
});

// Solution 4: Before with Video Recording
Before({ tags: '@video' }, async function () {
    // Close existing context
    if (this.context) {
        await this.context.close();
    }
    
    // Create context with video recording
    this.context = await browser.newContext({
        viewport: { width: 1280, height: 720 },
        recordVideo: {
            dir: 'videos/',
            size: { width: 1280, height: 720 },
        },
    });
    
    this.page = await this.context.newPage();
});

// Solution 5: Before with Console Logging
Before(async function () {
    this.consoleLogs = [];
    
    this.page.on('console', (msg: any) => {
        this.consoleLogs.push({
            type: msg.type(),
            text: msg.text(),
            location: msg.location(),
        });
    });
    
    this.page.on('pageerror', (error: any) => {
        this.consoleLogs.push({
            type: 'error',
            text: error.message,
        });
    });
});

// Solution 6: Before with Network Interception
Before({ tags: '@mock-api' }, async function () {
    // Mock API responses
    await this.page.route('**/api/**', async (route: any) => {
        const url = route.request().url();
        
        // Check for mock data
        const mockFile = `mocks/${url.split('/api/')[1]}.json`;
        if (fs.existsSync(mockFile)) {
            const mockData = JSON.parse(fs.readFileSync(mockFile, 'utf-8'));
            await route.fulfill({ json: mockData });
        } else {
            await route.continue();
        }
    });
});

// Solution 7: After - Save Trace on Failure
After({ tags: '@trace' }, async function (scenario) {
    if (this.tracingEnabled && this.context) {
        const tracePath = `traces/${this.scenarioName?.replace(/\s+/g, '_')}_${Date.now()}.zip`;
        
        // Save trace only on failure or always based on config
        if (scenario.result?.status === Status.FAILED || process.env.SAVE_ALL_TRACES) {
            await this.context.tracing.stop({ path: tracePath });
            console.log(`Trace saved: ${tracePath}`);
        } else {
            await this.context.tracing.stop();
        }
    }
});

// Solution 8: After - Screenshot on Failure
After(async function (scenario) {
    if (scenario.result?.status === Status.FAILED && this.page) {
        const screenshot = await this.page.screenshot({ fullPage: true });
        this.attach(screenshot, 'image/png');
        
        // Also attach page URL and console logs
        this.attach(`URL: ${this.page.url()}`, 'text/plain');
        
        if (this.consoleLogs?.length > 0) {
            const logs = this.consoleLogs.map((l: any) => `[${l.type}] ${l.text}`).join('\n');
            this.attach(logs, 'text/plain');
        }
    }
});

// Solution 9: After - Cleanup
After(async function () {
    if (this.page) {
        await this.page.close();
    }
    if (this.context) {
        await this.context.close();
    }
});

// Solution 10: AfterAll - Close Browser
AfterAll(async function () {
    if (browser) {
        await browser.close();
    }
});

// Solution 11: Export
export { browser };

