/**
 * Lab 620: Custom World Object
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Creating custom World for Playwright:
 * 
 * - World class
 * - Shared state
 * - Helper methods
 * - Type safety
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create custom World
 * 2. Add helper methods
 * 3. Share state
 *
 * =====================
 * SOLUTION:
 * =====================
 */

import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { BrowserContext, Page, Browser, chromium } from '@playwright/test';

// Solution 1: Custom World Interface
interface CustomWorldParameters {
    baseUrl: string;
    browser: string;
    headless: boolean;
}

// Solution 2: Custom World Class
class PlaywrightWorld extends World<CustomWorldParameters> {
    browser!: Browser;
    context!: BrowserContext;
    page!: Page;
    
    // Shared test data
    testData: Record<string, any> = {};
    
    // API response storage
    lastResponse: any = null;
    
    constructor(options: IWorldOptions<CustomWorldParameters>) {
        super(options);
    }
    
    // Solution 3: Navigation Helper
    async goto(path: string): Promise<void> {
        const baseUrl = this.parameters.baseUrl || 'http://localhost:3000';
        const url = path.startsWith('http') ? path : `${baseUrl}${path}`;
        await this.page.goto(url);
    }
    
    // Solution 4: Wait Helper
    async waitForElement(selector: string, timeout: number = 30000): Promise<void> {
        await this.page.waitForSelector(selector, { timeout });
    }
    
    // Solution 5: Click Helper
    async click(selector: string): Promise<void> {
        await this.page.click(selector);
    }
    
    // Solution 6: Fill Helper
    async fill(selector: string, value: string): Promise<void> {
        await this.page.fill(selector, value);
    }
    
    // Solution 7: Screenshot Helper
    async takeScreenshot(name?: string): Promise<Buffer> {
        const screenshot = await this.page.screenshot({ fullPage: true });
        if (name) {
            await this.attach(screenshot, 'image/png');
        }
        return screenshot;
    }
    
    // Solution 8: Store Test Data
    setData(key: string, value: any): void {
        this.testData[key] = value;
    }
    
    getData(key: string): any {
        return this.testData[key];
    }
    
    // Solution 9: API Request Helper
    async apiGet(endpoint: string): Promise<any> {
        const baseUrl = this.parameters.baseUrl || 'http://localhost:3000';
        const response = await this.page.request.get(`${baseUrl}${endpoint}`);
        this.lastResponse = {
            status: response.status(),
            body: await response.json(),
        };
        return this.lastResponse;
    }
    
    async apiPost(endpoint: string, data: any): Promise<any> {
        const baseUrl = this.parameters.baseUrl || 'http://localhost:3000';
        const response = await this.page.request.post(`${baseUrl}${endpoint}`, {
            data,
        });
        this.lastResponse = {
            status: response.status(),
            body: await response.json(),
        };
        return this.lastResponse;
    }
    
    // Solution 10: Login Helper
    async login(email: string, password: string): Promise<void> {
        await this.goto('/login');
        await this.fill('#email', email);
        await this.fill('#password', password);
        await this.click('#login-btn');
        await this.page.waitForURL('**/dashboard');
    }
    
    // Solution 11: Logout Helper
    async logout(): Promise<void> {
        await this.click('#logout-btn');
        await this.page.waitForURL('**/login');
    }
    
    // Solution 12: Clear State
    clearData(): void {
        this.testData = {};
        this.lastResponse = null;
    }
}

// Solution 13: Register World
setWorldConstructor(PlaywrightWorld);

// Solution 14: Export
export { PlaywrightWorld, CustomWorldParameters };

