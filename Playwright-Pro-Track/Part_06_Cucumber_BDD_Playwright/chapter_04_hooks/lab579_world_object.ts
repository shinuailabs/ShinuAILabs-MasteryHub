/**
 * Lab 579: World Object
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Using the World object:
 * 
 * - Shared state
 * - Custom World class
 * - Context management
 * - Data sharing
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create custom World
 * 2. Share state between steps
 * 3. Manage context
 *
 * =====================
 * SOLUTION:
 * =====================
 */

import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, APIRequestContext } from '@playwright/test';

// Solution 1: Custom World Interface
interface ICustomWorld extends World {
    // Browser
    browser?: Browser;
    context?: BrowserContext;
    page?: Page;
    
    // API
    apiContext?: APIRequestContext;
    
    // Test Data
    testData: Record<string, any>;
    
    // User
    currentUser?: {
        email: string;
        password: string;
        token?: string;
    };
    
    // Scenario Info
    scenarioName?: string;
    scenarioTags?: string[];
    
    // Utilities
    attach: (data: any, mediaType: string) => void;
}

// Solution 2: Custom World Class
class CustomWorld extends World implements ICustomWorld {
    browser?: Browser;
    context?: BrowserContext;
    page?: Page;
    apiContext?: APIRequestContext;
    testData: Record<string, any> = {};
    currentUser?: { email: string; password: string; token?: string };
    scenarioName?: string;
    scenarioTags?: string[];
    
    constructor(options: IWorldOptions) {
        super(options);
        this.testData = {};
    }
    
    // Solution 3: Helper Methods
    async login(email: string, password: string): Promise<void> {
        if (!this.page) throw new Error('Page not initialized');
        
        await this.page.goto('/login');
        await this.page.fill('#email', email);
        await this.page.fill('#password', password);
        await this.page.click('#login-btn');
        await this.page.waitForURL(/dashboard/);
        
        this.currentUser = { email, password };
    }
    
    async logout(): Promise<void> {
        if (!this.page) return;
        
        await this.page.click('.user-menu');
        await this.page.click('#logout');
        this.currentUser = undefined;
    }
    
    // Solution 4: Data Management
    setTestData(key: string, value: any): void {
        this.testData[key] = value;
    }
    
    getTestData(key: string): any {
        return this.testData[key];
    }
    
    clearTestData(): void {
        this.testData = {};
    }
    
    // Solution 5: Screenshot Helper
    async takeScreenshot(name: string): Promise<void> {
        if (!this.page) return;
        
        const screenshot = await this.page.screenshot({ fullPage: true });
        this.attach(screenshot, 'image/png');
    }
    
    // Solution 6: API Helper
    async apiRequest(method: string, endpoint: string, data?: any): Promise<any> {
        if (!this.page) throw new Error('Page not initialized');
        
        const response = await this.page.request[method as 'get' | 'post' | 'put' | 'delete'](
            endpoint,
            data ? { data } : undefined
        );
        
        return response.json();
    }
    
    // Solution 7: Wait Helper
    async waitForElement(selector: string, timeout: number = 30000): Promise<void> {
        if (!this.page) throw new Error('Page not initialized');
        
        await this.page.locator(selector).waitFor({ state: 'visible', timeout });
    }
    
    // Solution 8: Storage Helper
    async setLocalStorage(key: string, value: string): Promise<void> {
        if (!this.page) return;
        
        await this.page.evaluate(([k, v]) => {
            localStorage.setItem(k, v);
        }, [key, value]);
    }
    
    async getLocalStorage(key: string): Promise<string | null> {
        if (!this.page) return null;
        
        return await this.page.evaluate((k) => {
            return localStorage.getItem(k);
        }, key);
    }
    
    // Solution 9: Cookie Helper
    async setCookie(name: string, value: string): Promise<void> {
        if (!this.context) return;
        
        await this.context.addCookies([{
            name,
            value,
            domain: 'localhost',
            path: '/',
        }]);
    }
    
    async getCookie(name: string): Promise<string | undefined> {
        if (!this.context) return undefined;
        
        const cookies = await this.context.cookies();
        return cookies.find(c => c.name === name)?.value;
    }
}

// Solution 10: Set World Constructor
setWorldConstructor(CustomWorld);

// Solution 11: Export
export { CustomWorld, ICustomWorld };

