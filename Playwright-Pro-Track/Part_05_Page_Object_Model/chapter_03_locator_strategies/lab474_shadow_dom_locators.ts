/**
 * Lab 474: Shadow DOM Locators
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Working with Shadow DOM:
 * 
 * - Piercing shadow DOM
 * - Shadow root access
 * - Nested shadow DOM
 * - Web components
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Access shadow DOM elements
 * 2. Work with web components
 * 3. Handle nested shadows
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { Page, Locator } from '@playwright/test';

// Solution 1: Basic Shadow DOM Access
class BasicShadowDOMPage {
    readonly page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }
    
    // Playwright automatically pierces shadow DOM
    get shadowButton() {
        return this.page.locator('my-component button');
    }
    
    get shadowInput() {
        return this.page.locator('custom-input input');
    }
    
    get shadowHeading() {
        return this.page.locator('my-header h1');
    }
}

// Solution 2: Web Component Page
class WebComponentPage {
    readonly page: Page;
    readonly customCard: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.customCard = page.locator('custom-card');
    }
    
    // Access elements inside custom card
    get cardTitle() {
        return this.customCard.locator('.card-title');
    }
    
    get cardContent() {
        return this.customCard.locator('.card-content');
    }
    
    get cardButton() {
        return this.customCard.locator('button');
    }
}

// Solution 3: Multiple Shadow Roots
class MultipleShadowPage {
    readonly page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }
    
    // Different web components
    get headerComponent() {
        return this.page.locator('app-header');
    }
    
    get footerComponent() {
        return this.page.locator('app-footer');
    }
    
    get sidebarComponent() {
        return this.page.locator('app-sidebar');
    }
    
    // Elements inside components
    get headerLogo() {
        return this.headerComponent.locator('.logo');
    }
    
    get footerLinks() {
        return this.footerComponent.locator('a');
    }
    
    get sidebarMenu() {
        return this.sidebarComponent.locator('.menu');
    }
}

// Solution 4: Nested Shadow DOM
class NestedShadowPage {
    readonly page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }
    
    // Outer component
    get outerComponent() {
        return this.page.locator('outer-component');
    }
    
    // Inner component inside outer
    get innerComponent() {
        return this.outerComponent.locator('inner-component');
    }
    
    // Element inside inner component
    get deepElement() {
        return this.innerComponent.locator('.deep-content');
    }
}

// Solution 5: Shadow DOM Form
class ShadowFormPage {
    readonly page: Page;
    readonly customForm: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.customForm = page.locator('custom-form');
    }
    
    get nameInput() {
        return this.customForm.locator('input[name="name"]');
    }
    
    get emailInput() {
        return this.customForm.locator('input[name="email"]');
    }
    
    get submitButton() {
        return this.customForm.locator('button[type="submit"]');
    }
    
    async fillForm(name: string, email: string) {
        await this.nameInput.fill(name);
        await this.emailInput.fill(email);
    }
    
    async submit() {
        await this.submitButton.click();
    }
}

// Solution 6: Shadow DOM with Slots
class ShadowSlotsPage {
    readonly page: Page;
    readonly slottedComponent: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.slottedComponent = page.locator('slotted-component');
    }
    
    // Access slotted content
    get slottedContent() {
        return this.slottedComponent.locator('slot');
    }
    
    // Access named slot
    get headerSlot() {
        return this.slottedComponent.locator('slot[name="header"]');
    }
    
    get footerSlot() {
        return this.slottedComponent.locator('slot[name="footer"]');
    }
}

// Solution 7: Dynamic Shadow Component
class DynamicShadowPage {
    readonly page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }
    
    getComponent(tagName: string) {
        return this.page.locator(tagName);
    }
    
    getElementInComponent(tagName: string, selector: string) {
        return this.page.locator(`${tagName} ${selector}`);
    }
}

// Solution 8: Export
export {
    BasicShadowDOMPage,
    WebComponentPage,
    MultipleShadowPage,
    NestedShadowPage,
    ShadowFormPage,
    ShadowSlotsPage,
    DynamicShadowPage,
};

