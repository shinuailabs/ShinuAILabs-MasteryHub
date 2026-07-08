/**
 * Lab 542: Performance
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Performance optimization in POM:
 * 
 * - Lazy initialization
 * - Caching
 * - Parallel operations
 * - Efficient selectors
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Implement lazy loading
 * 2. Add caching
 * 3. Optimize operations
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { Page, Locator } from '@playwright/test';

// Solution 1: Lazy Initialization
class LazyPage {
    private _header?: Locator;
    private _footer?: Locator;
    private _sidebar?: Locator;
    
    constructor(readonly page: Page) {}
    
    // Lazy getters - only create when needed
    get header(): Locator {
        if (!this._header) {
            this._header = this.page.locator('header');
        }
        return this._header;
    }
    
    get footer(): Locator {
        if (!this._footer) {
            this._footer = this.page.locator('footer');
        }
        return this._footer;
    }
    
    get sidebar(): Locator {
        if (!this._sidebar) {
            this._sidebar = this.page.locator('.sidebar');
        }
        return this._sidebar;
    }
}

// Solution 2: Caching Results
class CachedPage {
    private cache: Map<string, unknown> = new Map();
    
    constructor(readonly page: Page) {}
    
    async getCachedText(selector: string): Promise<string | null> {
        const cacheKey = `text:${selector}`;
        
        if (!this.cache.has(cacheKey)) {
            const text = await this.page.locator(selector).textContent();
            this.cache.set(cacheKey, text);
        }
        
        return this.cache.get(cacheKey) as string | null;
    }
    
    async getCachedCount(selector: string): Promise<number> {
        const cacheKey = `count:${selector}`;
        
        if (!this.cache.has(cacheKey)) {
            const count = await this.page.locator(selector).count();
            this.cache.set(cacheKey, count);
        }
        
        return this.cache.get(cacheKey) as number;
    }
    
    clearCache() {
        this.cache.clear();
    }
    
    invalidate(selector: string) {
        this.cache.delete(`text:${selector}`);
        this.cache.delete(`count:${selector}`);
    }
}

// Solution 3: Parallel Operations
class ParallelPage {
    constructor(readonly page: Page) {}
    
    // Parallel data collection
    async collectAllData(): Promise<{
        title: string;
        headerText: string | null;
        itemCount: number;
    }> {
        const [title, headerText, itemCount] = await Promise.all([
            this.page.title(),
            this.page.locator('h1').textContent(),
            this.page.locator('.item').count(),
        ]);
        
        return { title, headerText, itemCount };
    }
    
    // Parallel visibility checks
    async checkAllVisible(selectors: string[]): Promise<boolean[]> {
        return await Promise.all(
            selectors.map(selector => this.page.locator(selector).isVisible())
        );
    }
    
    // Parallel text collection
    async getAllTexts(selectors: string[]): Promise<(string | null)[]> {
        return await Promise.all(
            selectors.map(selector => this.page.locator(selector).textContent())
        );
    }
}

// Solution 4: Efficient Selectors
class EfficientPage {
    constructor(readonly page: Page) {}
    
    // GOOD: Specific selectors
    readonly submitButton = this.page.locator('button[type="submit"]');
    readonly usernameInput = this.page.locator('#username');
    
    // GOOD: Data-testid selectors (fastest)
    readonly loginForm = this.page.locator('[data-testid="login-form"]');
    
    // GOOD: Role-based selectors
    readonly mainHeading = this.page.getByRole('heading', { level: 1 });
    
    // AVOID: Complex XPath (slower)
    // readonly badSelector = this.page.locator('//div[@class="container"]//form//button');
}

// Solution 5: Batch Operations
class BatchPage {
    constructor(readonly page: Page) {}
    
    // Batch fill instead of individual fills
    async batchFill(fields: { selector: string; value: string }[]) {
        for (const { selector, value } of fields) {
            await this.page.fill(selector, value);
        }
    }
    
    // Single evaluate for multiple DOM operations
    async batchGetAttributes(selector: string, attributes: string[]): Promise<Record<string, string | null>> {
        return await this.page.evaluate(
            ({ sel, attrs }) => {
                const element = document.querySelector(sel);
                const result: Record<string, string | null> = {};
                for (const attr of attrs) {
                    result[attr] = element?.getAttribute(attr) || null;
                }
                return result;
            },
            { sel: selector, attrs: attributes }
        );
    }
}

// Solution 6: Performance Tips
/*
 * Performance Best Practices:
 * 
 * 1. Use lazy initialization for locators
 * 2. Cache frequently accessed data
 * 3. Use parallel operations when possible
 * 4. Prefer data-testid selectors
 * 5. Avoid complex XPath expressions
 * 6. Batch DOM operations
 * 7. Minimize page.evaluate calls
 * 8. Use waitForLoadState wisely
 */

// Solution 7: Export
export {
    LazyPage,
    CachedPage,
    ParallelPage,
    EfficientPage,
    BatchPage,
};

