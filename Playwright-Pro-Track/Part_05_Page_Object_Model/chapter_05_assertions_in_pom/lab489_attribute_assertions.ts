/**
 * Lab 489: Attribute Assertions
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Implementing attribute assertions in POM:
 * 
 * - toHaveAttribute
 * - toHaveClass
 * - toHaveId
 * - Custom attribute checks
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Assert element attributes
 * 2. Check CSS classes
 * 3. Verify IDs
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { Page, Locator, expect } from '@playwright/test';

// Solution 1: Basic Attribute Assertions
class BasicAttributePage {
    readonly page: Page;
    readonly link: Locator;
    readonly image: Locator;
    readonly input: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.link = page.locator('a');
        this.image = page.locator('img');
        this.input = page.locator('input');
    }
    
    async assertLinkHref(href: string) {
        await expect(this.link).toHaveAttribute('href', href);
    }
    
    async assertImageSrc(src: string) {
        await expect(this.image).toHaveAttribute('src', src);
    }
    
    async assertInputType(type: string) {
        await expect(this.input).toHaveAttribute('type', type);
    }
}

// Solution 2: Class Assertions
class ClassAssertionsPage {
    readonly page: Page;
    readonly element: Locator;
    readonly button: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.element = page.locator('.element');
        this.button = page.locator('button');
    }
    
    async assertHasClass(className: string) {
        await expect(this.element).toHaveClass(new RegExp(className));
    }
    
    async assertButtonActive() {
        await expect(this.button).toHaveClass(/active/);
    }
    
    async assertButtonDisabledClass() {
        await expect(this.button).toHaveClass(/disabled/);
    }
}

// Solution 3: ID Assertions
class IdAssertionsPage {
    readonly page: Page;
    readonly form: Locator;
    readonly container: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.form = page.locator('form');
        this.container = page.locator('.container');
    }
    
    async assertFormId(id: string) {
        await expect(this.form).toHaveId(id);
    }
    
    async assertContainerId(id: string) {
        await expect(this.container).toHaveId(id);
    }
}

// Solution 4: Data Attribute Assertions
class DataAttributePage {
    readonly page: Page;
    readonly element: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.element = page.locator('[data-testid]');
    }
    
    async assertTestId(testId: string) {
        await expect(this.element).toHaveAttribute('data-testid', testId);
    }
    
    async assertDataValue(name: string, value: string) {
        await expect(this.element).toHaveAttribute(`data-${name}`, value);
    }
}

// Solution 5: Partial Attribute Assertions
class PartialAttributePage {
    readonly page: Page;
    readonly link: Locator;
    readonly image: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.link = page.locator('a');
        this.image = page.locator('img');
    }
    
    async assertHrefContains(text: string) {
        await expect(this.link).toHaveAttribute('href', new RegExp(text));
    }
    
    async assertSrcContains(text: string) {
        await expect(this.image).toHaveAttribute('src', new RegExp(text));
    }
}

// Solution 6: Aria Attribute Assertions
class AriaAttributePage {
    readonly page: Page;
    readonly button: Locator;
    readonly dialog: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.button = page.locator('button');
        this.dialog = page.locator('[role="dialog"]');
    }
    
    async assertAriaLabel(label: string) {
        await expect(this.button).toHaveAttribute('aria-label', label);
    }
    
    async assertAriaExpanded(expanded: boolean) {
        await expect(this.button).toHaveAttribute('aria-expanded', String(expanded));
    }
    
    async assertDialogRole() {
        await expect(this.dialog).toHaveAttribute('role', 'dialog');
    }
}

// Solution 7: Multiple Attribute Assertions
class MultipleAttributePage {
    readonly page: Page;
    readonly input: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.input = page.locator('input');
    }
    
    async assertInputAttributes(attrs: Record<string, string>) {
        for (const [name, value] of Object.entries(attrs)) {
            await expect(this.input).toHaveAttribute(name, value);
        }
    }
}

// Solution 8: Export
export {
    BasicAttributePage,
    ClassAssertionsPage,
    IdAssertionsPage,
    DataAttributePage,
    PartialAttributePage,
    AriaAttributePage,
    MultipleAttributePage,
};

