/**
 * Lab 613: Screenshot Attachments
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Attaching screenshots to reports:
 * 
 * - Capture on failure
 * - Capture on demand
 * - Full page screenshots
 * - Element screenshots
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Capture screenshots
 * 2. Attach to reports
 * 3. Organize screenshots
 *
 * =====================
 * SOLUTION:
 * =====================
 */

import { After, AfterStep, When, Status } from '@cucumber/cucumber';
import * as fs from 'fs';
import * as path from 'path';

// Solution 1: Screenshot on Failure
After(async function (scenario) {
    if (scenario.result?.status === Status.FAILED && this.page) {
        const screenshot = await this.page.screenshot({
            fullPage: true,
        });
        
        // Attach to Cucumber report
        await this.attach(screenshot, 'image/png');
    }
});

// Solution 2: Screenshot After Each Step
AfterStep(async function (step) {
    if (this.page && this.captureAllSteps) {
        const screenshot = await this.page.screenshot();
        await this.attach(screenshot, 'image/png');
    }
});

// Solution 3: Screenshot on Failure with File Save
After(async function (scenario) {
    if (scenario.result?.status === Status.FAILED && this.page) {
        const screenshotDir = 'reports/screenshots';
        
        if (!fs.existsSync(screenshotDir)) {
            fs.mkdirSync(screenshotDir, { recursive: true });
        }
        
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const scenarioName = scenario.pickle.name.replace(/[^a-zA-Z0-9]/g, '_');
        const filename = `${scenarioName}_${timestamp}.png`;
        const filepath = path.join(screenshotDir, filename);
        
        await this.page.screenshot({
            path: filepath,
            fullPage: true,
        });
        
        console.log(`Screenshot saved: ${filepath}`);
        
        // Also attach to report
        const screenshot = fs.readFileSync(filepath);
        await this.attach(screenshot, 'image/png');
    }
});

// Solution 4: Element Screenshot
When('I capture screenshot of {string} element', async function (selector: string) {
    const element = this.page.locator(selector);
    const screenshot = await element.screenshot();
    
    await this.attach(screenshot, 'image/png');
});

// Solution 5: Full Page Screenshot
When('I capture full page screenshot', async function () {
    const screenshot = await this.page.screenshot({
        fullPage: true,
    });
    
    await this.attach(screenshot, 'image/png');
});

// Solution 6: Viewport Screenshot
When('I capture viewport screenshot', async function () {
    const screenshot = await this.page.screenshot({
        fullPage: false,
    });
    
    await this.attach(screenshot, 'image/png');
});

// Solution 7: Screenshot with Mask
When('I capture screenshot hiding sensitive data', async function () {
    // Mask sensitive elements before screenshot
    await this.page.evaluate(() => {
        const sensitiveSelectors = [
            '[data-sensitive]',
            '.credit-card-number',
            '.ssn',
            '.password',
        ];
        
        sensitiveSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                (el as HTMLElement).style.visibility = 'hidden';
            });
        });
    });
    
    const screenshot = await this.page.screenshot({ fullPage: true });
    await this.attach(screenshot, 'image/png');
    
    // Restore visibility
    await this.page.evaluate(() => {
        const sensitiveSelectors = [
            '[data-sensitive]',
            '.credit-card-number',
            '.ssn',
            '.password',
        ];
        
        sensitiveSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                (el as HTMLElement).style.visibility = 'visible';
            });
        });
    });
});

// Solution 8: Screenshot Comparison Helper
async function captureAndCompare(
    page: any,
    baselinePath: string,
    threshold: number = 0.1
): Promise<{ match: boolean; diffPath?: string }> {
    const screenshot = await page.screenshot();
    
    if (!fs.existsSync(baselinePath)) {
        // Save as baseline
        fs.writeFileSync(baselinePath, screenshot);
        return { match: true };
    }
    
    // In real implementation, use image comparison library
    // like pixelmatch or resemblejs
    const baseline = fs.readFileSync(baselinePath);
    
    // Simplified comparison (real implementation would be more sophisticated)
    const match = Buffer.compare(screenshot, baseline) === 0;
    
    return { match };
}

// Solution 9: Screenshot Manager Class
class ScreenshotManager {
    private outputDir: string;
    private counter: number = 0;
    
    constructor(outputDir: string = 'reports/screenshots') {
        this.outputDir = outputDir;
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
    }
    
    async capture(page: any, name?: string): Promise<string> {
        this.counter++;
        const filename = name 
            ? `${name.replace(/[^a-zA-Z0-9]/g, '_')}.png`
            : `screenshot_${this.counter}.png`;
        
        const filepath = path.join(this.outputDir, filename);
        
        await page.screenshot({
            path: filepath,
            fullPage: true,
        });
        
        return filepath;
    }
    
    async captureElement(page: any, selector: string, name?: string): Promise<string> {
        this.counter++;
        const filename = name 
            ? `${name.replace(/[^a-zA-Z0-9]/g, '_')}.png`
            : `element_${this.counter}.png`;
        
        const filepath = path.join(this.outputDir, filename);
        
        await page.locator(selector).screenshot({ path: filepath });
        
        return filepath;
    }
    
    getOutputDir(): string {
        return this.outputDir;
    }
}

// Solution 10: Export
export { captureAndCompare, ScreenshotManager };

