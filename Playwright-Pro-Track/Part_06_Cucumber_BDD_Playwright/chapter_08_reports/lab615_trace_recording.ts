/**
 * Lab 615: Playwright Trace Recording
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Recording Playwright traces:
 * 
 * - Trace configuration
 * - Trace on failure
 * - Trace viewer
 * - Report integration
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Enable tracing
 * 2. Save traces
 * 3. View traces
 *
 * =====================
 * SOLUTION:
 * =====================
 */

import { Before, After, Status } from '@cucumber/cucumber';
import { chromium, Browser, BrowserContext } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

let browser: Browser;

// Solution 1: Browser Setup
Before(async function () {
    if (!browser) {
        browser = await chromium.launch({ headless: true });
    }
});

// Solution 2: Start Tracing
Before(async function (scenario) {
    this.context = await browser.newContext();
    this.page = await this.context.newPage();
    this.scenarioName = scenario.pickle.name;
    
    // Start tracing
    await this.context.tracing.start({
        screenshots: true,
        snapshots: true,
        sources: true,
    });
});

// Solution 3: Stop Tracing and Save
After(async function (scenario) {
    const traceDir = 'reports/traces';
    
    if (!fs.existsSync(traceDir)) {
        fs.mkdirSync(traceDir, { recursive: true });
    }
    
    const sanitizedName = this.scenarioName.replace(/[^a-zA-Z0-9]/g, '_');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    if (scenario.result?.status === Status.FAILED) {
        // Save trace for failed tests
        const tracePath = path.join(traceDir, `${sanitizedName}_${timestamp}.zip`);
        
        await this.context.tracing.stop({ path: tracePath });
        console.log(`Trace saved: ${tracePath}`);
        
        // Attach trace info to report
        await this.attach(
            `Trace file: ${tracePath}\nView with: npx playwright show-trace ${tracePath}`,
            'text/plain'
        );
    } else {
        // Discard trace for passed tests
        await this.context.tracing.stop();
    }
    
    await this.page?.close();
    await this.context?.close();
});

// Solution 4: Conditional Tracing
Before(async function (scenario) {
    const tags = scenario.pickle.tags.map(t => t.name);
    const shouldTrace = tags.includes('@trace') || 
                        process.env.ENABLE_TRACING === 'true';
    
    this.context = await browser.newContext();
    this.page = await this.context.newPage();
    this.scenarioName = scenario.pickle.name;
    this.tracingEnabled = shouldTrace;
    
    if (shouldTrace) {
        await this.context.tracing.start({
            screenshots: true,
            snapshots: true,
            sources: true,
        });
    }
});

After(async function (scenario) {
    if (this.tracingEnabled) {
        const traceDir = 'reports/traces';
        
        if (!fs.existsSync(traceDir)) {
            fs.mkdirSync(traceDir, { recursive: true });
        }
        
        const sanitizedName = this.scenarioName.replace(/[^a-zA-Z0-9]/g, '_');
        const tracePath = path.join(traceDir, `${sanitizedName}.zip`);
        
        if (scenario.result?.status === Status.FAILED) {
            await this.context.tracing.stop({ path: tracePath });
        } else {
            await this.context.tracing.stop();
        }
    }
    
    await this.page?.close();
    await this.context?.close();
});

// Solution 5: Trace Manager Class
class TraceManager {
    private traceDir: string;
    private retainOnPass: boolean;
    
    constructor(options: { traceDir?: string; retainOnPass?: boolean } = {}) {
        this.traceDir = options.traceDir || 'reports/traces';
        this.retainOnPass = options.retainOnPass || false;
        
        if (!fs.existsSync(this.traceDir)) {
            fs.mkdirSync(this.traceDir, { recursive: true });
        }
    }
    
    async startTracing(context: BrowserContext): Promise<void> {
        await context.tracing.start({
            screenshots: true,
            snapshots: true,
            sources: true,
        });
    }
    
    async stopTracing(
        context: BrowserContext,
        scenarioName: string,
        status: string
    ): Promise<string | null> {
        const sanitizedName = scenarioName.replace(/[^a-zA-Z0-9]/g, '_');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const tracePath = path.join(this.traceDir, `${sanitizedName}_${timestamp}.zip`);
        
        if (status === 'FAILED' || this.retainOnPass) {
            await context.tracing.stop({ path: tracePath });
            return tracePath;
        } else {
            await context.tracing.stop();
            return null;
        }
    }
    
    getViewCommand(tracePath: string): string {
        return `npx playwright show-trace ${tracePath}`;
    }
    
    cleanup(maxAgeDays: number = 7): void {
        const files = fs.readdirSync(this.traceDir);
        const now = Date.now();
        const maxAge = maxAgeDays * 24 * 60 * 60 * 1000;
        
        for (const file of files) {
            if (file.endsWith('.zip')) {
                const filepath = path.join(this.traceDir, file);
                const stats = fs.statSync(filepath);
                
                if (now - stats.mtimeMs > maxAge) {
                    fs.unlinkSync(filepath);
                    console.log(`Deleted old trace: ${file}`);
                }
            }
        }
    }
}

// Solution 6: Trace Configuration
interface TraceConfig {
    enabled: boolean;
    dir: string;
    screenshots: boolean;
    snapshots: boolean;
    sources: boolean;
    retainOnPass: boolean;
}

function getTraceConfig(): TraceConfig {
    return {
        enabled: process.env.ENABLE_TRACING === 'true',
        dir: process.env.TRACE_DIR || 'reports/traces',
        screenshots: process.env.TRACE_SCREENSHOTS !== 'false',
        snapshots: process.env.TRACE_SNAPSHOTS !== 'false',
        sources: process.env.TRACE_SOURCES !== 'false',
        retainOnPass: process.env.RETAIN_TRACE_ON_PASS === 'true',
    };
}

// Solution 7: Export
export { TraceManager, getTraceConfig, TraceConfig };

