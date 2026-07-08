/**
 * Lab 494: Custom Assertions
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Creating custom assertions in POM:
 * 
 * - Custom matchers
 * - Reusable assertions
 * - Domain-specific assertions
 * - Assertion helpers
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create custom assertions
 * 2. Build reusable matchers
 * 3. Implement domain assertions
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { Page, Locator, expect } from '@playwright/test';

// Solution 1: Custom Assertion Methods
class CustomAssertionsPage {
    readonly page: Page;
    readonly element: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.element = page.locator('.element');
    }
    
    // Custom assertion for valid email
    async assertValidEmail(emailLocator: Locator) {
        const email = await emailLocator.inputValue();
        const emailRegex = /^[\w.-]+@[\w.-]+\.\w+$/;
        expect(email).toMatch(emailRegex);
    }
    
    // Custom assertion for valid phone
    async assertValidPhone(phoneLocator: Locator) {
        const phone = await phoneLocator.inputValue();
        const phoneRegex = /^\+?[\d\s-]{10,}$/;
        expect(phone).toMatch(phoneRegex);
    }
}

// Solution 2: Domain-Specific Assertions
class DomainAssertionsPage {
    readonly page: Page;
    readonly price: Locator;
    readonly quantity: Locator;
    readonly total: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.price = page.locator('.price');
        this.quantity = page.locator('.quantity');
        this.total = page.locator('.total');
    }
    
    // Assert valid price format
    async assertValidPrice() {
        const priceText = await this.price.textContent();
        expect(priceText).toMatch(/^\$\d+\.\d{2}$/);
    }
    
    // Assert total calculation
    async assertTotalCorrect() {
        const priceText = await this.price.textContent();
        const quantityText = await this.quantity.textContent();
        const totalText = await this.total.textContent();
        
        const price = parseFloat(priceText?.replace('$', '') || '0');
        const quantity = parseInt(quantityText || '0');
        const expectedTotal = (price * quantity).toFixed(2);
        
        expect(totalText).toContain(expectedTotal);
    }
}

// Solution 3: Assertion Helper Class
class AssertionHelpers {
    static async assertElementHasValidDate(locator: Locator) {
        const text = await locator.textContent();
        const date = new Date(text || '');
        expect(date.toString()).not.toBe('Invalid Date');
    }
    
    static async assertElementIsNumber(locator: Locator) {
        const text = await locator.textContent();
        expect(Number(text)).not.toBeNaN();
    }
    
    static async assertElementIsPositive(locator: Locator) {
        const text = await locator.textContent();
        expect(Number(text)).toBeGreaterThan(0);
    }
}

// Solution 4: Form Validation Assertions
class FormValidationAssertionsPage {
    readonly page: Page;
    readonly form: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.form = page.locator('form');
    }
    
    async assertFieldHasError(fieldName: string) {
        const field = this.form.locator(`[name="${fieldName}"]`);
        const errorMessage = this.form.locator(`[data-error-for="${fieldName}"]`);
        await expect(errorMessage).toBeVisible();
    }
    
    async assertFieldNoError(fieldName: string) {
        const errorMessage = this.form.locator(`[data-error-for="${fieldName}"]`);
        await expect(errorMessage).toBeHidden();
    }
    
    async assertFormHasErrors() {
        const errors = this.form.locator('.error-message');
        const count = await errors.count();
        expect(count).toBeGreaterThan(0);
    }
}

// Solution 5: Table Assertions
class TableAssertionsPage {
    readonly page: Page;
    readonly table: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.table = page.locator('table');
    }
    
    async assertRowContainsData(rowIndex: number, data: string[]) {
        const row = this.table.locator('tbody tr').nth(rowIndex);
        const cells = row.locator('td');
        
        for (let i = 0; i < data.length; i++) {
            await expect(cells.nth(i)).toContainText(data[i]);
        }
    }
    
    async assertColumnSorted(columnIndex: number, ascending: boolean = true) {
        const cells = this.table.locator(`tbody tr td:nth-child(${columnIndex + 1})`);
        const values = await cells.allTextContents();
        
        const sorted = [...values].sort((a, b) => 
            ascending ? a.localeCompare(b) : b.localeCompare(a)
        );
        
        expect(values).toEqual(sorted);
    }
}

// Solution 6: Soft Assertions
class SoftAssertionsPage {
    readonly page: Page;
    private errors: string[] = [];
    
    constructor(page: Page) {
        this.page = page;
    }
    
    async softAssertVisible(locator: Locator, name: string) {
        try {
            await expect(locator).toBeVisible({ timeout: 1000 });
        } catch {
            this.errors.push(`${name} is not visible`);
        }
    }
    
    async softAssertText(locator: Locator, text: string, name: string) {
        try {
            await expect(locator).toHaveText(text, { timeout: 1000 });
        } catch {
            this.errors.push(`${name} does not have text: ${text}`);
        }
    }
    
    assertNoErrors() {
        if (this.errors.length > 0) {
            throw new Error(`Soft assertion failures:\n${this.errors.join('\n')}`);
        }
    }
}

// Solution 7: Export
export {
    CustomAssertionsPage,
    DomainAssertionsPage,
    AssertionHelpers,
    FormValidationAssertionsPage,
    TableAssertionsPage,
    SoftAssertionsPage,
};

