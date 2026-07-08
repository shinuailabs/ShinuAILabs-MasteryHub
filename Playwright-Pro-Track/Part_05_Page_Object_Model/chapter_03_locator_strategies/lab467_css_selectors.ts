/**
 * Lab 467: CSS Selectors
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Using CSS selectors in POM:
 * 
 * - Basic selectors
 * - Attribute selectors
 * - Pseudo-selectors
 * - Combinators
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Use various CSS selectors
 * 2. Combine selectors
 * 3. Apply in page objects
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { Page, Locator } from '@playwright/test';

// Solution 1: Basic CSS Selectors
class BasicSelectorsPage {
    readonly page: Page;
    
    // By tag
    readonly heading: Locator;
    // By class
    readonly container: Locator;
    // By ID
    readonly submitButton: Locator;
    // By multiple classes
    readonly primaryButton: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.heading = page.locator('h1');
        this.container = page.locator('.container');
        this.submitButton = page.locator('#submit');
        this.primaryButton = page.locator('.btn.primary');
    }
}

// Solution 2: Attribute Selectors
class AttributeSelectorsPage {
    readonly page: Page;
    
    // Exact match
    readonly emailInput: Locator;
    // Contains
    readonly partialMatch: Locator;
    // Starts with
    readonly startsWithMatch: Locator;
    // Ends with
    readonly endsWithMatch: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.emailInput = page.locator('input[type="email"]');
        this.partialMatch = page.locator('[class*="button"]');
        this.startsWithMatch = page.locator('[id^="user-"]');
        this.endsWithMatch = page.locator('[id$="-btn"]');
    }
}

// Solution 3: Pseudo-selectors
class PseudoSelectorsPage {
    readonly page: Page;
    
    // First child
    readonly firstItem: Locator;
    // Last child
    readonly lastItem: Locator;
    // Nth child
    readonly thirdItem: Locator;
    // Not selector
    readonly notDisabled: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.firstItem = page.locator('li:first-child');
        this.lastItem = page.locator('li:last-child');
        this.thirdItem = page.locator('li:nth-child(3)');
        this.notDisabled = page.locator('button:not([disabled])');
    }
}

// Solution 4: Combinators
class CombinatorSelectorsPage {
    readonly page: Page;
    
    // Descendant
    readonly navLinks: Locator;
    // Child
    readonly directChild: Locator;
    // Adjacent sibling
    readonly adjacentSibling: Locator;
    // General sibling
    readonly generalSibling: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.navLinks = page.locator('nav a');
        this.directChild = page.locator('ul > li');
        this.adjacentSibling = page.locator('h1 + p');
        this.generalSibling = page.locator('h1 ~ p');
    }
}

// Solution 5: Complex Selectors
class ComplexSelectorsPage {
    readonly page: Page;
    
    // Multiple conditions
    readonly submitBtn: Locator;
    // Nested elements
    readonly formInput: Locator;
    // Multiple selectors
    readonly headings: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.submitBtn = page.locator('button[type="submit"].primary');
        this.formInput = page.locator('form .input-group input');
        this.headings = page.locator('h1, h2, h3');
    }
}

// Solution 6: Data Attribute Selectors
class DataAttributeSelectorsPage {
    readonly page: Page;
    
    // Data-testid
    readonly loginButton: Locator;
    // Data-cy
    readonly submitForm: Locator;
    // Custom data attribute
    readonly userCard: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.loginButton = page.locator('[data-testid="login-btn"]');
        this.submitForm = page.locator('[data-cy="submit-form"]');
        this.userCard = page.locator('[data-user-id="123"]');
    }
}

// Solution 7: Dynamic CSS Selectors
class DynamicCSSPage {
    readonly page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }
    
    getItemByIndex(index: number) {
        return this.page.locator(`li:nth-child(${index})`);
    }
    
    getInputByName(name: string) {
        return this.page.locator(`input[name="${name}"]`);
    }
    
    getButtonByClass(className: string) {
        return this.page.locator(`button.${className}`);
    }
}

// Solution 8: CSS Selector Best Practices
/*
 * Best Practices:
 * 
 * 1. Prefer data-testid attributes
 * 2. Avoid overly complex selectors
 * 3. Use IDs when available
 * 4. Avoid position-based selectors
 * 5. Keep selectors maintainable
 */

// Solution 9: Export
export {
    BasicSelectorsPage,
    AttributeSelectorsPage,
    PseudoSelectorsPage,
    CombinatorSelectorsPage,
    ComplexSelectorsPage,
    DataAttributeSelectorsPage,
    DynamicCSSPage,
};

