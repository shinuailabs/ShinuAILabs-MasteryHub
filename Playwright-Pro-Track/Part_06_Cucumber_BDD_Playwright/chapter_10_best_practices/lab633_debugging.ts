/**
 * Lab 633: Debugging Best Practices
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Debugging Cucumber tests:
 * 
 * - Debug mode
 * - Logging
 * - Breakpoints
 * - Trace analysis
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Enable debug mode
 * 2. Add logging
 * 3. Use traces
 *
 * =====================
 * SOLUTION:
 * =====================
 */

import { Before, After, AfterStep, Status } from '@cucumber/cucumber';

/*
 * Best Practice 1: Debug Mode Setup
 * 
 * Run with: PWDEBUG=1 npm test
 * This opens Playwright Inspector
 */

/*
 * Best Practice 2: Conditional Debugging
 */
Before({ tags: '@debug' }, async function () {
    // Enable slow motion for debugging
    this.context = await this.browser.newContext({
        viewport: { width: 1280, height: 720 },
    });
    
    this.page = await this.context.newPage();
    
    // Add pause for manual inspection
    if (process.env.DEBUG === 'true') {
        await this.page.pause();
    }
});

/*
 * Best Practice 3: Logging Helper
 */
class TestLogger {
    private scenarioName: string;
    private stepCount: number = 0;
    
    constructor(scenarioName: string) {
        this.scenarioName = scenarioName;
    }
    
    step(message: string): void {
        this.stepCount++;
        console.log(`[${this.scenarioName}] Step ${this.stepCount}: ${message}`);
    }
    
    info(message: string): void {
        console.log(`[${this.scenarioName}] INFO: ${message}`);
    }
    
    warn(message: string): void {
        console.warn(`[${this.scenarioName}] WARN: ${message}`);
    }
    
    error(message: string, error?: Error): void {
        console.error(`[${this.scenarioName}] ERROR: ${message}`);
        if (error) {
            console.error(error.stack);
        }
    }
    
    debug(message: string, data?: any): void {
        if (process.env.DEBUG === 'true') {
            console.log(`[${this.scenarioName}] DEBUG: ${message}`);
            if (data) {
                console.log(JSON.stringify(data, null, 2));
            }
        }
    }
}

Before(async function (scenario) {
    this.logger = new TestLogger(scenario.pickle.name);
    this.logger.info('Starting scenario');
});

/*
 * Best Practice 4: Console Log Capture
 */
Before(async function () {
    this.consoleLogs = [];
    this.consoleErrors = [];
    
    this.page.on('console', msg => {
        const entry = `[${msg.type()}] ${msg.text()}`;
        this.consoleLogs.push(entry);
        
        if (msg.type() === 'error') {
            this.consoleErrors.push(entry);
        }
    });
    
    this.page.on('pageerror', error => {
        this.consoleErrors.push(`[PAGE ERROR] ${error.message}`);
    });
});

/*
 * Best Practice 5: Network Request Logging
 */
Before({ tags: '@debug-network' }, async function () {
    this.networkLog = [];
    
    this.page.on('request', request => {
        this.networkLog.push({
            type: 'request',
            method: request.method(),
            url: request.url(),
            timestamp: new Date().toISOString(),
        });
    });
    
    this.page.on('response', response => {
        this.networkLog.push({
            type: 'response',
            status: response.status(),
            url: response.url(),
            timestamp: new Date().toISOString(),
        });
    });
});

/*
 * Best Practice 6: Step-by-Step Screenshots
 */
AfterStep({ tags: '@debug-screenshots' }, async function (step) {
    if (this.page) {
        const screenshot = await this.page.screenshot();
        await this.attach(screenshot, 'image/png');
    }
});

/*
 * Best Practice 7: Failure Diagnostics
 */
After(async function (scenario) {
    if (scenario.result?.status === Status.FAILED) {
        this.logger?.error('Scenario failed');
        
        // Attach diagnostic information
        if (this.page) {
            // Screenshot
            const screenshot = await this.page.screenshot({ fullPage: true });
            await this.attach(screenshot, 'image/png');
            
            // Current URL
            await this.attach(`URL: ${this.page.url()}`, 'text/plain');
            
            // Console logs
            if (this.consoleLogs?.length) {
                await this.attach(
                    `Console Logs:\n${this.consoleLogs.join('\n')}`,
                    'text/plain'
                );
            }
            
            // Console errors
            if (this.consoleErrors?.length) {
                await this.attach(
                    `Console Errors:\n${this.consoleErrors.join('\n')}`,
                    'text/plain'
                );
            }
            
            // Network log
            if (this.networkLog?.length) {
                await this.attach(
                    `Network Log:\n${JSON.stringify(this.networkLog, null, 2)}`,
                    'application/json'
                );
            }
        }
    }
});

/*
 * Best Practice 8: Interactive Debugging
 */
async function debugPause(page: any, message: string): Promise<void> {
    if (process.env.DEBUG === 'true') {
        console.log(`\n🔍 DEBUG PAUSE: ${message}`);
        console.log('Press any key to continue...\n');
        await page.pause();
    }
}

// Export
export { TestLogger, debugPause };

