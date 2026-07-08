/**
 * Lab 475: Locator Assertions
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Using assertions with locators:
 * 
 * - Visibility assertions
 * - Text assertions
 * - Attribute assertions
 * - State assertions
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Assert locator states
 * 2. Verify element properties
 * 3. Use in page objects
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { Page, Locator, expect } from '@playwright/test';

// Solution 1: Visibility Assertions
class VisibilityAssertionsPage {
    readonly page: Page;
    readonly element: Locator;
    readonly hiddenElement: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.element = page.locator('.visible-element');
        this.hiddenElement = page.locator('.hidden-element');
    }
    
    async assertElementVisible() {
        await expect(this.element).toBeVisible();
    }
    
    async assertElementHidden() {
        await expect(this.hiddenElement).toBeHidden();
    }
    
    async assertElementAttached() {
        await expect(this.element).toBeAttached();
    }
}

// Solution 2: Text Assertions
class TextAssertionsPage {
    readonly page: Page;
    readonly heading: Locator;
    readonly paragraph: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.heading = page.locator('h1');
        this.paragraph = page.locator('p');
    }
    
    async assertHeadingText(text: string) {
        await expect(this.heading).toHaveText(text);
    }
    
    async assertHeadingContains(text: string) {
        await expect(this.heading).toContainText(text);
    }
    
    async assertParagraphMatches(pattern: RegExp) {
        await expect(this.paragraph).toHaveText(pattern);
    }
}

// Solution 3: Attribute Assertions
class AttributeAssertionsPage {
    readonly page: Page;
    readonly input: Locator;
    readonly link: Locator;
    readonly image: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.input = page.locator('input');
        this.link = page.locator('a');
        this.image = page.locator('img');
    }
    
    async assertInputValue(value: string) {
        await expect(this.input).toHaveValue(value);
    }
    
    async assertLinkHref(href: string) {
        await expect(this.link).toHaveAttribute('href', href);
    }
    
    async assertImageSrc(src: string) {
        await expect(this.image).toHaveAttribute('src', src);
    }
    
    async assertInputPlaceholder(placeholder: string) {
        await expect(this.input).toHaveAttribute('placeholder', placeholder);
    }
}

// Solution 4: State Assertions
class StateAssertionsPage {
    readonly page: Page;
    readonly button: Locator;
    readonly checkbox: Locator;
    readonly input: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.button = page.locator('button');
        this.checkbox = page.locator('input[type="checkbox"]');
        this.input = page.locator('input[type="text"]');
    }
    
    async assertButtonEnabled() {
        await expect(this.button).toBeEnabled();
    }
    
    async assertButtonDisabled() {
        await expect(this.button).toBeDisabled();
    }
    
    async assertCheckboxChecked() {
        await expect(this.checkbox).toBeChecked();
    }
    
    async assertInputEditable() {
        await expect(this.input).toBeEditable();
    }
}

// Solution 5: Count Assertions
class CountAssertionsPage {
    readonly page: Page;
    readonly items: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.items = page.locator('.item');
    }
    
    async assertItemCount(count: number) {
        await expect(this.items).toHaveCount(count);
    }
    
    async assertHasItems() {
        await expect(this.items).not.toHaveCount(0);
    }
    
    async assertNoItems() {
        await expect(this.items).toHaveCount(0);
    }
}

// Solution 6: CSS Assertions
class CSSAssertionsPage {
    readonly page: Page;
    readonly element: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.element = page.locator('.styled-element');
    }
    
    async assertHasClass(className: string) {
        await expect(this.element).toHaveClass(new RegExp(className));
    }
    
    async assertHasCSS(property: string, value: string) {
        await expect(this.element).toHaveCSS(property, value);
    }
    
    async assertHasId(id: string) {
        await expect(this.element).toHaveId(id);
    }
}

// Solution 7: Combined Assertions
class CombinedAssertionsPage {
    readonly page: Page;
    readonly form: Locator;
    readonly submitButton: Locator;
    readonly errorMessage: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.form = page.locator('form');
        this.submitButton = page.locator('button[type="submit"]');
        this.errorMessage = page.locator('.error');
    }
    
    async assertFormValid() {
        await expect(this.submitButton).toBeEnabled();
        await expect(this.errorMessage).toBeHidden();
    }
    
    async assertFormInvalid(errorText: string) {
        await expect(this.submitButton).toBeDisabled();
        await expect(this.errorMessage).toBeVisible();
        await expect(this.errorMessage).toContainText(errorText);
    }
}

// Solution 8: Export
export {
    VisibilityAssertionsPage,
    TextAssertionsPage,
    AttributeAssertionsPage,
    StateAssertionsPage,
    CountAssertionsPage,
    CSSAssertionsPage,
    CombinedAssertionsPage,
};

