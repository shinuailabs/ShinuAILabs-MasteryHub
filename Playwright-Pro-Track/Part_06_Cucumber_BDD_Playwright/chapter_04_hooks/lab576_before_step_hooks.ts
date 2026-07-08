/**
 * Lab 576: BeforeStep Hooks
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Using BeforeStep hooks:
 * 
 * - Runs before each step
 * - Logging
 * - Timing
 * - Conditional setup
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create BeforeStep hooks
 * 2. Log step execution
 * 3. Track timing
 *
 * =====================
 * SOLUTION:
 * =====================
 */

import { BeforeStep } from '@cucumber/cucumber';

// Solution 1: Basic BeforeStep Hook
BeforeStep(async function () {
    // Runs before every step
    this.stepStartTime = Date.now();
});

// Solution 2: BeforeStep with Step Info
BeforeStep(async function (step) {
    const stepText = step.pickleStep?.text || 'Unknown step';
    console.log(`\n  → Executing: ${stepText}`);
});

// Solution 3: BeforeStep with Tags
BeforeStep({ tags: '@debug' }, async function (step) {
    console.log('='.repeat(50));
    console.log(`DEBUG: Starting step`);
    console.log(`Text: ${step.pickleStep?.text}`);
    console.log(`Type: ${step.pickleStep?.type}`);
    console.log('='.repeat(50));
});

// Solution 4: BeforeStep for Screenshots
BeforeStep({ tags: '@screenshot-steps' }, async function (step) {
    if (this.page) {
        const stepText = step.pickleStep?.text?.replace(/[^a-zA-Z0-9]/g, '_') || 'step';
        const screenshotPath = `screenshots/steps/${stepText}_before.png`;
        
        try {
            await this.page.screenshot({ path: screenshotPath });
        } catch (error) {
            // Ignore screenshot errors
        }
    }
});

// Solution 5: BeforeStep for Slow Motion
BeforeStep({ tags: '@slow' }, async function () {
    // Add delay before each step for debugging
    await new Promise(resolve => setTimeout(resolve, 500));
});

// Solution 6: BeforeStep for Network Logging
BeforeStep({ tags: '@network' }, async function () {
    if (this.page && !this.networkLoggingEnabled) {
        this.networkRequests = [];
        
        this.page.on('request', (request: any) => {
            this.networkRequests.push({
                url: request.url(),
                method: request.method(),
                timestamp: Date.now(),
            });
        });
        
        this.networkLoggingEnabled = true;
    }
});

// Solution 7: BeforeStep for Console Logging
BeforeStep({ tags: '@console' }, async function () {
    if (this.page && !this.consoleLoggingEnabled) {
        this.consoleLogs = [];
        
        this.page.on('console', (msg: any) => {
            this.consoleLogs.push({
                type: msg.type(),
                text: msg.text(),
                timestamp: Date.now(),
            });
        });
        
        this.consoleLoggingEnabled = true;
    }
});

// Solution 8: BeforeStep for Wait State
BeforeStep(async function () {
    // Ensure page is ready before each step
    if (this.page) {
        try {
            await this.page.waitForLoadState('domcontentloaded', { timeout: 5000 });
        } catch (error) {
            // Continue even if timeout
        }
    }
});

// Solution 9: BeforeStep for Step Counter
BeforeStep(async function () {
    if (!this.stepCounter) {
        this.stepCounter = 0;
    }
    this.stepCounter++;
    this.currentStepNumber = this.stepCounter;
});

// Solution 10: BeforeStep for Conditional Actions
BeforeStep({ tags: '@retry' }, async function () {
    // Setup retry configuration for this step
    this.retryConfig = {
        maxRetries: 3,
        retryDelay: 1000,
        currentRetry: 0,
    };
});

// Solution 11: BeforeStep for Memory Tracking
BeforeStep({ tags: '@performance' }, async function () {
    if (this.page) {
        const metrics = await this.page.evaluate(() => {
            const perf = (performance as any);
            return {
                usedJSHeapSize: perf.memory?.usedJSHeapSize || 0,
                totalJSHeapSize: perf.memory?.totalJSHeapSize || 0,
            };
        });
        
        this.memoryBefore = metrics;
    }
});

// Solution 12: Export
export {};

