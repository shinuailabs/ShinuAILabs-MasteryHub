/**
 * Lab 553: World Object
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Cucumber World object:
 * 
 * - Shared state
 * - Custom world
 * - Dependency injection
 * - Context management
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create custom world
 * 2. Share state between steps
 * 3. Manage context
 *
 * =====================
 * SOLUTION:
 * =====================
 */

import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { Browser, Page, BrowserContext, chromium } from '@playwright/test';

// Solution 1: Basic Custom World
interface ICustomWorld extends World {
    browser: Browser;
    context: BrowserContext;
    page: Page;
    testData: Record<string, unknown>;
}

class BasicWorld extends World implements ICustomWorld {
    browser!: Browser;
    context!: BrowserContext;
    page!: Page;
    testData: Record<string, unknown> = {};
    
    constructor(options: IWorldOptions) {
        super(options);
    }
}

// Solution 2: Extended World with Helpers
class ExtendedWorld extends BasicWorld {
    private baseUrl: string = process.env.BASE_URL || 'http://localhost:3000';
    
    // Navigation helper
    async navigateTo(path: string) {
        await this.page.goto(`${this.baseUrl}${path}`);
    }
    
    // Storage helpers
    setData(key: string, value: unknown) {
        this.testData[key] = value;
    }
    
    getData<T>(key: string): T {
        return this.testData[key] as T;
    }
    
    // Screenshot helper
    async takeScreenshot(name: string) {
        await this.page.screenshot({ path: `screenshots/${name}.png` });
    }
    
    // Wait helper
    async waitForElement(selector: string, timeout: number = 30000) {
        await this.page.locator(selector).waitFor({ state: 'visible', timeout });
    }
}

// Solution 3: World with Page Objects
class PageObjectWorld extends ExtendedWorld {
    private _loginPage?: LoginPageObject;
    private _dashboardPage?: DashboardPageObject;
    
    get loginPage(): LoginPageObject {
        if (!this._loginPage) {
            this._loginPage = new LoginPageObject(this.page);
        }
        return this._loginPage;
    }
    
    get dashboardPage(): DashboardPageObject {
        if (!this._dashboardPage) {
            this._dashboardPage = new DashboardPageObject(this.page);
        }
        return this._dashboardPage;
    }
}

// Page Objects
class LoginPageObject {
    constructor(private page: Page) {}
    
    async login(username: string, password: string) {
        await this.page.fill('#username', username);
        await this.page.fill('#password', password);
        await this.page.click('#login-btn');
    }
}

class DashboardPageObject {
    constructor(private page: Page) {}
    
    async getWelcomeMessage() {
        return await this.page.locator('.welcome').textContent();
    }
}

// Solution 4: World with API Client
class ApiWorld extends PageObjectWorld {
    private apiBaseUrl: string = process.env.API_URL || 'http://localhost:3000/api';
    
    async apiGet(endpoint: string) {
        const response = await this.page.request.get(`${this.apiBaseUrl}${endpoint}`);
        return await response.json();
    }
    
    async apiPost(endpoint: string, data: unknown) {
        const response = await this.page.request.post(`${this.apiBaseUrl}${endpoint}`, {
            data,
        });
        return await response.json();
    }
    
    async apiDelete(endpoint: string) {
        const response = await this.page.request.delete(`${this.apiBaseUrl}${endpoint}`);
        return response.status();
    }
}

// Solution 5: World with Logging
class LoggingWorld extends ApiWorld {
    private logs: string[] = [];
    
    log(message: string) {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] ${message}`;
        this.logs.push(logEntry);
        console.log(logEntry);
    }
    
    getLogs(): string[] {
        return [...this.logs];
    }
    
    clearLogs() {
        this.logs = [];
    }
}

// Solution 6: Set World Constructor
setWorldConstructor(LoggingWorld);

// Solution 7: Export Types
export {
    ICustomWorld,
    BasicWorld,
    ExtendedWorld,
    PageObjectWorld,
    ApiWorld,
    LoggingWorld,
    LoginPageObject,
    DashboardPageObject,
};

