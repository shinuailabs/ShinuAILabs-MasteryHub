/**
 * Lab 577: AfterStep Hooks
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Using AfterStep hooks:
 * 
 * - Runs after each step
 * - Timing measurement
 * - Error handling
 * - Reporting
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create AfterStep hooks
 * 2. Measure step duration
 * 3. Handle step failures
 *
 * =====================
 * SOLUTION:
 * =====================
 */

import { AfterStep, Status } from '@cucumber/cucumber';

// Solution 1: Basic AfterStep Hook
AfterStep(async function () {
    // Runs after every step
    if (this.stepStartTime) {
        const duration = Date.now() - this.stepStartTime;
        this.lastStepDuration = duration;
    }
});

// Solution 2: AfterStep with Step Info
AfterStep(async function (step) {
    const stepText = step.pickleStep?.text || 'Unknown step';
    const duration = this.lastStepDuration || 0;
    console.log(`    ✓ Completed in ${duration}ms`);
});

// Solution 3: AfterStep with Result Status
AfterStep(async function (step) {
    const status = step.result?.status;
    const stepText = step.pickleStep?.text || 'Unknown step';
    
    switch (status) {
        case Status.PASSED:
            console.log(`  ✅ PASSED: ${stepText}`);
            break;
        case Status.FAILED:
            console.log(`  ❌ FAILED: ${stepText}`);
            break;
        case Status.SKIPPED:
            console.log(`  ⏭️ SKIPPED: ${stepText}`);
            break;
        case Status.PENDING:
            console.log(`  ⏳ PENDING: ${stepText}`);
            break;
    }
});

// Solution 4: AfterStep Screenshot on Failure
AfterStep(async function (step) {
    if (step.result?.status === Status.FAILED && this.page) {
        const stepText = step.pickleStep?.text?.replace(/[^a-zA-Z0-9]/g, '_') || 'step';
        const screenshotPath = `screenshots/failures/${stepText}_${Date.now()}.png`;
        
        try {
            const screenshot = await this.page.screenshot({ fullPage: true });
            this.attach(screenshot, 'image/png');
            console.log(`  📸 Screenshot captured: ${screenshotPath}`);
        } catch (error) {
            console.log('  ⚠️ Failed to capture screenshot');
        }
    }
});

// Solution 5: AfterStep with Tags
AfterStep({ tags: '@debug' }, async function (step) {
    console.log('='.repeat(50));
    console.log(`DEBUG: Step completed`);
    console.log(`Status: ${step.result?.status}`);
    console.log(`Duration: ${this.lastStepDuration}ms`);
    
    if (step.result?.status === Status.FAILED) {
        console.log(`Error: ${step.result?.message}`);
    }
    console.log('='.repeat(50));
});

// Solution 6: AfterStep for Performance Tracking
AfterStep({ tags: '@performance' }, async function (step) {
    if (!this.stepPerformance) {
        this.stepPerformance = [];
    }
    
    this.stepPerformance.push({
        step: step.pickleStep?.text,
        duration: this.lastStepDuration,
        status: step.result?.status,
    });
    
    // Warn if step is slow
    if (this.lastStepDuration > 5000) {
        console.log(`  ⚠️ Slow step detected: ${this.lastStepDuration}ms`);
    }
});

// Solution 7: AfterStep for Memory Tracking
AfterStep({ tags: '@performance' }, async function () {
    if (this.page && this.memoryBefore) {
        const memoryAfter = await this.page.evaluate(() => {
            const perf = (performance as any);
            return {
                usedJSHeapSize: perf.memory?.usedJSHeapSize || 0,
            };
        });
        
        const memoryDiff = memoryAfter.usedJSHeapSize - this.memoryBefore.usedJSHeapSize;
        if (memoryDiff > 1000000) { // 1MB
            console.log(`  ⚠️ Memory increase: ${(memoryDiff / 1000000).toFixed(2)}MB`);
        }
    }
});

// Solution 8: AfterStep for Network Summary
AfterStep({ tags: '@network' }, async function (step) {
    if (this.networkRequests && this.networkRequests.length > 0) {
        const stepRequests = this.networkRequests.filter(
            (r: any) => r.timestamp >= this.stepStartTime
        );
        
        if (stepRequests.length > 0) {
            console.log(`  📡 Network requests: ${stepRequests.length}`);
        }
    }
});

// Solution 9: AfterStep for Console Errors
AfterStep(async function () {
    if (this.consoleLogs) {
        const errors = this.consoleLogs.filter(
            (log: any) => log.type === 'error' && log.timestamp >= this.stepStartTime
        );
        
        if (errors.length > 0) {
            console.log(`  ⚠️ Console errors: ${errors.length}`);
            errors.forEach((e: any) => console.log(`    - ${e.text}`));
        }
    }
});

// Solution 10: AfterStep for Step History
AfterStep(async function (step) {
    if (!this.stepHistory) {
        this.stepHistory = [];
    }
    
    this.stepHistory.push({
        number: this.currentStepNumber,
        text: step.pickleStep?.text,
        status: step.result?.status,
        duration: this.lastStepDuration,
        timestamp: new Date().toISOString(),
    });
});

// Solution 11: Export
export {};

