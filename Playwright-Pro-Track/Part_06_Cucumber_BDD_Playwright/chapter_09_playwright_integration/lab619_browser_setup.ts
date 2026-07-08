/**
 * Lab 619: Browser Setup Integration
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Setting up Playwright with Cucumber:
 * 
 * - Browser launch
 * - Context creation
 * - Page management
 * - Cleanup
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Set up browser
 * 2. Create contexts
 * 3. Manage pages
 *
 * =====================
 * SOLUTION:
 * =====================
 */

import { BeforeAll, AfterAll, Before, After } from '@cucumber/cucumber';
import { chromium, firefox, webkit, Browser, BrowserContext, Page } from '@playwright/test';

let browser: Browser;

// Solution 1: Browser Launch in BeforeAll
BeforeAll(async function () {
    const browserName = process.env.BROWSER || 'chromium';
    const headless = process.env.HEADLESS !== 'false';
    
    const launchOptions = {
        headless,
        slowMo: parseInt(process.env.SLOW_MO || '0'),
    };
    
    switch (browserName) {
        case 'firefox':
            browser = await firefox.launch(launchOptions);
            break;
        case 'webkit':
            browser = await webkit.launch(launchOptions);
            break;
        default:
            browser = await chromium.launch(launchOptions);
    }
    
    console.log(`Browser launched: ${browserName}`);
});

// Solution 2: Browser Close in AfterAll
AfterAll(async function () {
    if (browser) {
        await browser.close();
        console.log('Browser closed');
    }
});

// Solution 3: Context and Page in Before
Before(async function () {
    // Create new context for each scenario
    this.context = await browser.newContext({
        viewport: { width: 1280, height: 720 },
        ignoreHTTPSErrors: true,
    });
    
    // Create new page
    this.page = await this.context.newPage();
    
    // Set default timeout
    this.page.setDefaultTimeout(30000);
});

// Solution 4: Cleanup in After
After(async function () {
    if (this.page) {
        await this.page.close();
    }
    if (this.context) {
        await this.context.close();
    }
});

// Solution 5: Browser Factory
class BrowserFactory {
    private static browser: Browser | null = null;
    
    static async getBrowser(): Promise<Browser> {
        if (!this.browser) {
            const browserName = process.env.BROWSER || 'chromium';
            const headless = process.env.HEADLESS !== 'false';
            
            switch (browserName) {
                case 'firefox':
                    this.browser = await firefox.launch({ headless });
                    break;
                case 'webkit':
                    this.browser = await webkit.launch({ headless });
                    break;
                default:
                    this.browser = await chromium.launch({ headless });
            }
        }
        return this.browser;
    }
    
    static async closeBrowser(): Promise<void> {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
        }
    }
}

// Solution 6: Context Factory
interface ContextOptions {
    viewport?: { width: number; height: number };
    locale?: string;
    timezoneId?: string;
    geolocation?: { latitude: number; longitude: number };
    permissions?: string[];
    storageState?: string;
}

async function createContext(options: ContextOptions = {}): Promise<BrowserContext> {
    const browser = await BrowserFactory.getBrowser();
    
    return browser.newContext({
        viewport: options.viewport || { width: 1280, height: 720 },
        locale: options.locale || 'en-US',
        timezoneId: options.timezoneId || 'America/New_York',
        geolocation: options.geolocation,
        permissions: options.permissions || [],
        storageState: options.storageState,
        ignoreHTTPSErrors: true,
    });
}

// Solution 7: Mobile Context
async function createMobileContext(device: string): Promise<BrowserContext> {
    const browser = await BrowserFactory.getBrowser();
    const { devices } = await import('@playwright/test');
    
    const deviceConfig = devices[device];
    if (!deviceConfig) {
        throw new Error(`Unknown device: ${device}`);
    }
    
    return browser.newContext({
        ...deviceConfig,
        ignoreHTTPSErrors: true,
    });
}

// Solution 8: Export
export { BrowserFactory, createContext, createMobileContext, ContextOptions };

