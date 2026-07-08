/**
 * Lab 535: Logging and Debugging
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Logging and debugging in POM:
 * 
 * - Logging strategies
 * - Debug information
 * - Trace collection
 * - Performance logging
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Implement logging
 * 2. Add debug info
 * 3. Collect traces
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { Page } from '@playwright/test';

// Solution 1: Log Levels
enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
}

// Solution 2: Logger
class Logger {
    private level: LogLevel;
    private logs: { level: LogLevel; message: string; timestamp: Date }[] = [];
    
    constructor(level: LogLevel = LogLevel.INFO) {
        this.level = level;
    }
    
    private log(level: LogLevel, message: string) {
        if (level >= this.level) {
            const entry = { level, message, timestamp: new Date() };
            this.logs.push(entry);
            console.log(`[${LogLevel[level]}] ${message}`);
        }
    }
    
    debug(message: string) {
        this.log(LogLevel.DEBUG, message);
    }
    
    info(message: string) {
        this.log(LogLevel.INFO, message);
    }
    
    warn(message: string) {
        this.log(LogLevel.WARN, message);
    }
    
    error(message: string) {
        this.log(LogLevel.ERROR, message);
    }
    
    getLogs() {
        return [...this.logs];
    }
    
    clear() {
        this.logs = [];
    }
}

// Solution 3: Page Logger
class PageLogger {
    private logger: Logger;
    private pageName: string;
    
    constructor(pageName: string, level: LogLevel = LogLevel.INFO) {
        this.pageName = pageName;
        this.logger = new Logger(level);
    }
    
    action(action: string, details?: string) {
        this.logger.info(`[${this.pageName}] ${action}${details ? `: ${details}` : ''}`);
    }
    
    navigation(url: string) {
        this.logger.info(`[${this.pageName}] Navigating to: ${url}`);
    }
    
    click(selector: string) {
        this.logger.debug(`[${this.pageName}] Clicking: ${selector}`);
    }
    
    fill(selector: string, value: string) {
        this.logger.debug(`[${this.pageName}] Filling ${selector} with: ${value.substring(0, 20)}...`);
    }
    
    error(message: string, error?: Error) {
        this.logger.error(`[${this.pageName}] ${message}${error ? `: ${error.message}` : ''}`);
    }
}

// Solution 4: Logged Page
class LoggedPage {
    protected logger: PageLogger;
    
    constructor(readonly page: Page, pageName: string) {
        this.logger = new PageLogger(pageName, LogLevel.DEBUG);
    }
    
    async goto(url: string) {
        this.logger.navigation(url);
        await this.page.goto(url);
    }
    
    async click(selector: string) {
        this.logger.click(selector);
        await this.page.click(selector);
    }
    
    async fill(selector: string, value: string) {
        this.logger.fill(selector, value);
        await this.page.fill(selector, value);
    }
}

// Solution 5: Performance Logger
class PerformanceLogger {
    private timings: Map<string, { start: number; end?: number }> = new Map();
    
    start(operation: string) {
        this.timings.set(operation, { start: Date.now() });
    }
    
    end(operation: string) {
        const timing = this.timings.get(operation);
        if (timing) {
            timing.end = Date.now();
        }
    }
    
    getDuration(operation: string): number | undefined {
        const timing = this.timings.get(operation);
        if (timing && timing.end) {
            return timing.end - timing.start;
        }
        return undefined;
    }
    
    getReport(): Record<string, number> {
        const report: Record<string, number> = {};
        for (const [operation, timing] of this.timings) {
            if (timing.end) {
                report[operation] = timing.end - timing.start;
            }
        }
        return report;
    }
}

// Solution 6: Debug Helper
class DebugHelper {
    constructor(private page: Page) {}
    
    async captureState(): Promise<{
        url: string;
        title: string;
        html: string;
        cookies: unknown[];
    }> {
        return {
            url: this.page.url(),
            title: await this.page.title(),
            html: await this.page.content(),
            cookies: await this.page.context().cookies(),
        };
    }
    
    async highlightElement(selector: string) {
        await this.page.evaluate((sel) => {
            const element = document.querySelector(sel);
            if (element) {
                (element as HTMLElement).style.border = '3px solid red';
            }
        }, selector);
    }
    
    async pause() {
        await this.page.pause();
    }
    
    async screenshot(name: string) {
        await this.page.screenshot({ path: `debug-${name}-${Date.now()}.png` });
    }
}

// Solution 7: Trace Collector
class TraceCollector {
    private actions: { action: string; timestamp: number; details?: unknown }[] = [];
    
    record(action: string, details?: unknown) {
        this.actions.push({
            action,
            timestamp: Date.now(),
            details,
        });
    }
    
    getTrace() {
        return [...this.actions];
    }
    
    clear() {
        this.actions = [];
    }
    
    toJSON(): string {
        return JSON.stringify(this.actions, null, 2);
    }
}

// Solution 8: Export
export {
    LogLevel,
    Logger,
    PageLogger,
    LoggedPage,
    PerformanceLogger,
    DebugHelper,
    TraceCollector,
};

