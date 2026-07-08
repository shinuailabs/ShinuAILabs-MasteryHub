/**
 * Lab 575: After Hooks
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Using After hooks in Cucumber:
 * 
 * - After each scenario
 * - Cleanup operations
 * - Screenshot on failure
 * - Resource cleanup
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create After hooks
 * 2. Handle failures
 * 3. Cleanup resources
 *
 * =====================
 * SOLUTION:
 * =====================
 */

import { After, AfterAll, Status } from '@cucumber/cucumber';
import { browser } from './lab574_before_hooks';
import * as fs from 'fs';
import * as path from 'path';

// Solution 1: AfterAll - Runs once after all scenarios
AfterAll(async function () {
    console.log('Test suite completed');
    
    // Close browser
    if (browser) {
        await browser.close();
    }
});

// Solution 2: After - Runs after each scenario
After(async function () {
    // Close context and page
    if (this.page) {
        await this.page.close();
    }
    if (this.context) {
        await this.context.close();
    }
});

// Solution 3: After with Scenario Result
After(async function (scenario) {
    console.log(`Scenario "${scenario.pickle.name}" ${scenario.result?.status}`);
    
    // Log duration
    if (scenario.result?.duration) {
        const durationMs = Number(scenario.result.duration.nanos) / 1000000;
        console.log(`Duration: ${durationMs}ms`);
    }
});

// Solution 4: Screenshot on Failure
After(async function (scenario) {
    if (scenario.result?.status === Status.FAILED) {
        // Take screenshot
        const screenshotDir = 'screenshots';
        if (!fs.existsSync(screenshotDir)) {
            fs.mkdirSync(screenshotDir, { recursive: true });
        }
        
        const screenshotName = `${scenario.pickle.name.replace(/\s+/g, '_')}_${Date.now()}.png`;
        const screenshotPath = path.join(screenshotDir, screenshotName);
        
        if (this.page) {
            await this.page.screenshot({ path: screenshotPath, fullPage: true });
            console.log(`Screenshot saved: ${screenshotPath}`);
            
            // Attach to report
            const screenshot = await this.page.screenshot();
            this.attach(screenshot, 'image/png');
        }
    }
});

// Solution 5: After with Tag
After({ tags: '@database' }, async function () {
    // Cleanup database
    console.log('Cleaning up database...');
    if (this.dbConnection) {
        // Rollback transactions
        // Delete test data
        this.dbConnection.connected = false;
    }
});

// Solution 6: After with Order (higher runs first)
After({ tags: '@cleanup', order: 2 }, async function () {
    // First: Cleanup test data
    console.log('Cleaning up test data');
});

After({ tags: '@cleanup', order: 1 }, async function () {
    // Second: Close connections
    console.log('Closing connections');
});

// Solution 7: Attach Logs on Failure
After(async function (scenario) {
    if (scenario.result?.status === Status.FAILED) {
        // Attach console logs
        if (this.consoleLogs && this.consoleLogs.length > 0) {
            this.attach(this.consoleLogs.join('\n'), 'text/plain');
        }
        
        // Attach page URL
        if (this.page) {
            this.attach(`Failed on URL: ${this.page.url()}`, 'text/plain');
        }
    }
});

// Solution 8: Video Recording Cleanup
After({ tags: '@video' }, async function (scenario) {
    if (this.context) {
        // Save video only on failure
        if (scenario.result?.status === Status.FAILED) {
            const video = this.page?.video();
            if (video) {
                const videoPath = await video.path();
                console.log(`Video saved: ${videoPath}`);
            }
        }
    }
});

// Solution 9: API Cleanup
After({ tags: '@api' }, async function () {
    // Cleanup created resources via API
    if (this.createdResources && this.createdResources.length > 0) {
        for (const resource of this.createdResources) {
            try {
                await this.page.request.delete(`/api/${resource.type}/${resource.id}`);
                console.log(`Deleted ${resource.type}: ${resource.id}`);
            } catch (error) {
                console.log(`Failed to delete ${resource.type}: ${resource.id}`);
            }
        }
    }
});

// Solution 10: Logout After Authenticated Tests
After({ tags: '@authenticated' }, async function () {
    // Logout after test
    if (this.page) {
        try {
            await this.page.click('.user-menu');
            await this.page.click('#logout');
        } catch (error) {
            // Ignore logout errors
        }
    }
});

// Solution 11: Clear Storage
After(async function () {
    if (this.page) {
        try {
            await this.page.evaluate(() => {
                localStorage.clear();
                sessionStorage.clear();
            });
        } catch (error) {
            // Page might be closed
        }
    }
});

// Solution 12: Export
export {};

