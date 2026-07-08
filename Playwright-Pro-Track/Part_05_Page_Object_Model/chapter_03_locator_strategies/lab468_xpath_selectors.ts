/**
 * Lab 468: XPath Selectors
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Using XPath selectors in POM:
 * 
 * - Basic XPath
 * - Axes
 * - Functions
 * - Predicates
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Use XPath selectors
 * 2. Navigate DOM with axes
 * 3. Apply XPath functions
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { Page, Locator } from '@playwright/test';

// Solution 1: Basic XPath
class BasicXPathPage {
    readonly page: Page;
    
    // Absolute path
    readonly absoluteHeading: Locator;
    // Relative path
    readonly relativeHeading: Locator;
    // By attribute
    readonly byAttribute: Locator;
    // By ID
    readonly byId: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.absoluteHeading = page.locator('xpath=/html/body/h1');
        this.relativeHeading = page.locator('xpath=//h1');
        this.byAttribute = page.locator('xpath=//input[@type="text"]');
        this.byId = page.locator('xpath=//*[@id="submit"]');
    }
}

// Solution 2: XPath Axes
class XPathAxesPage {
    readonly page: Page;
    
    // Parent
    readonly parent: Locator;
    // Child
    readonly child: Locator;
    // Following sibling
    readonly followingSibling: Locator;
    // Preceding sibling
    readonly precedingSibling: Locator;
    // Ancestor
    readonly ancestor: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.parent = page.locator('xpath=//span/parent::div');
        this.child = page.locator('xpath=//div/child::span');
        this.followingSibling = page.locator('xpath=//h1/following-sibling::p');
        this.precedingSibling = page.locator('xpath=//p/preceding-sibling::h1');
        this.ancestor = page.locator('xpath=//span/ancestor::form');
    }
}

// Solution 3: XPath Functions
class XPathFunctionsPage {
    readonly page: Page;
    
    // Contains
    readonly containsText: Locator;
    // Starts-with
    readonly startsWithId: Locator;
    // Text
    readonly exactText: Locator;
    // Normalize-space
    readonly normalizedText: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.containsText = page.locator('xpath=//button[contains(text(), "Submit")]');
        this.startsWithId = page.locator('xpath=//div[starts-with(@id, "user-")]');
        this.exactText = page.locator('xpath=//span[text()="Hello"]');
        this.normalizedText = page.locator('xpath=//p[normalize-space()="Hello World"]');
    }
}

// Solution 4: XPath Predicates
class XPathPredicatesPage {
    readonly page: Page;
    
    // Position
    readonly firstItem: Locator;
    readonly lastItem: Locator;
    // Multiple conditions
    readonly multiCondition: Locator;
    // Index
    readonly thirdItem: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.firstItem = page.locator('xpath=(//li)[1]');
        this.lastItem = page.locator('xpath=(//li)[last()]');
        this.multiCondition = page.locator('xpath=//input[@type="text" and @name="email"]');
        this.thirdItem = page.locator('xpath=(//li)[3]');
    }
}

// Solution 5: XPath with OR/AND
class XPathLogicalPage {
    readonly page: Page;
    
    // OR condition
    readonly orCondition: Locator;
    // AND condition
    readonly andCondition: Locator;
    // NOT condition
    readonly notCondition: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.orCondition = page.locator('xpath=//input[@type="text" or @type="email"]');
        this.andCondition = page.locator('xpath=//button[@type="submit" and @class="primary"]');
        this.notCondition = page.locator('xpath=//button[not(@disabled)]');
    }
}

// Solution 6: Complex XPath
class ComplexXPathPage {
    readonly page: Page;
    
    // Following text
    readonly afterLabel: Locator;
    // Contains class
    readonly containsClass: Locator;
    // Multiple attributes
    readonly multiAttribute: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.afterLabel = page.locator('xpath=//label[text()="Email"]/following::input[1]');
        this.containsClass = page.locator('xpath=//div[contains(@class, "container")]');
        this.multiAttribute = page.locator('xpath=//input[@type="text"][@placeholder="Search"]');
    }
}

// Solution 7: Dynamic XPath
class DynamicXPathPage {
    readonly page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }
    
    getItemByText(text: string) {
        return this.page.locator(`xpath=//li[text()="${text}"]`);
    }
    
    getInputAfterLabel(label: string) {
        return this.page.locator(`xpath=//label[text()="${label}"]/following::input[1]`);
    }
    
    getRowByIndex(index: number) {
        return this.page.locator(`xpath=(//tr)[${index}]`);
    }
}

// Solution 8: XPath Best Practices
/*
 * Best Practices:
 * 
 * 1. Prefer CSS over XPath when possible
 * 2. Use relative paths (// not /)
 * 3. Avoid long absolute paths
 * 4. Use functions for flexibility
 * 5. Keep XPath readable
 */

// Solution 9: Export
export {
    BasicXPathPage,
    XPathAxesPage,
    XPathFunctionsPage,
    XPathPredicatesPage,
    XPathLogicalPage,
    ComplexXPathPage,
    DynamicXPathPage,
};

