/**
 * Lab 465: Page Properties
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Managing page properties:
 * 
 * - Locator properties
 * - Computed properties
 * - Readonly properties
 * - Dynamic properties
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Define page properties
 * 2. Use getters and setters
 * 3. Create computed properties
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { Page, Locator } from '@playwright/test';

// Solution 1: Basic Properties
class BasicPropertiesPage {
    readonly page: Page;
    readonly heading: Locator;
    readonly content: Locator;
    readonly footer: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.heading = page.locator('h1');
        this.content = page.locator('.content');
        this.footer = page.locator('footer');
    }
}

// Solution 2: Getter Properties
class GetterPropertiesPage {
    readonly page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }
    
    // Getter for locator
    get heading() {
        return this.page.locator('h1');
    }
    
    get submitButton() {
        return this.page.locator('button[type="submit"]');
    }
    
    get errorMessages() {
        return this.page.locator('.error');
    }
}

// Solution 3: Computed Properties
class ComputedPropertiesPage {
    readonly page: Page;
    private readonly baseSelector: string;
    
    constructor(page: Page, baseSelector: string = '.container') {
        this.page = page;
        this.baseSelector = baseSelector;
    }
    
    get container() {
        return this.page.locator(this.baseSelector);
    }
    
    get header() {
        return this.container.locator('header');
    }
    
    get main() {
        return this.container.locator('main');
    }
    
    get footer() {
        return this.container.locator('footer');
    }
}

// Solution 4: Dynamic Properties
class DynamicPropertiesPage {
    readonly page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }
    
    // Dynamic locator based on parameter
    getItemByIndex(index: number) {
        return this.page.locator(`.item:nth-child(${index + 1})`);
    }
    
    getButtonByText(text: string) {
        return this.page.locator(`button:has-text("${text}")`);
    }
    
    getInputByName(name: string) {
        return this.page.locator(`input[name="${name}"]`);
    }
}

// Solution 5: Grouped Properties
class GroupedPropertiesPage {
    readonly page: Page;
    
    // Form elements
    readonly form = {
        username: this.page.locator('#username'),
        password: this.page.locator('#password'),
        submit: this.page.locator('#submit'),
    };
    
    // Navigation elements
    readonly nav = {
        home: this.page.locator('nav a[href="/"]'),
        about: this.page.locator('nav a[href="/about"]'),
        contact: this.page.locator('nav a[href="/contact"]'),
    };
    
    constructor(page: Page) {
        this.page = page;
        
        // Re-initialize with page
        this.form = {
            username: page.locator('#username'),
            password: page.locator('#password'),
            submit: page.locator('#submit'),
        };
        
        this.nav = {
            home: page.locator('nav a[href="/"]'),
            about: page.locator('nav a[href="/about"]'),
            contact: page.locator('nav a[href="/contact"]'),
        };
    }
}

// Solution 6: Lazy Properties
class LazyPropertiesPage {
    readonly page: Page;
    private _heading?: Locator;
    private _content?: Locator;
    
    constructor(page: Page) {
        this.page = page;
    }
    
    get heading() {
        if (!this._heading) {
            this._heading = this.page.locator('h1');
        }
        return this._heading;
    }
    
    get content() {
        if (!this._content) {
            this._content = this.page.locator('.content');
        }
        return this._content;
    }
}

// Solution 7: Typed Properties
interface PageElements {
    heading: Locator;
    content: Locator;
    buttons: Locator;
}

class TypedPropertiesPage {
    readonly page: Page;
    readonly elements: PageElements;
    
    constructor(page: Page) {
        this.page = page;
        this.elements = {
            heading: page.locator('h1'),
            content: page.locator('.content'),
            buttons: page.locator('button'),
        };
    }
}

// Solution 8: Static Properties
class StaticPropertiesPage {
    readonly page: Page;
    
    static readonly SELECTORS = {
        HEADING: 'h1',
        CONTENT: '.content',
        SUBMIT: 'button[type="submit"]',
    };
    
    constructor(page: Page) {
        this.page = page;
    }
    
    get heading() {
        return this.page.locator(StaticPropertiesPage.SELECTORS.HEADING);
    }
    
    get content() {
        return this.page.locator(StaticPropertiesPage.SELECTORS.CONTENT);
    }
}

// Solution 9: Export
export {
    BasicPropertiesPage,
    GetterPropertiesPage,
    ComputedPropertiesPage,
    DynamicPropertiesPage,
    GroupedPropertiesPage,
    LazyPropertiesPage,
    TypedPropertiesPage,
    StaticPropertiesPage,
};

