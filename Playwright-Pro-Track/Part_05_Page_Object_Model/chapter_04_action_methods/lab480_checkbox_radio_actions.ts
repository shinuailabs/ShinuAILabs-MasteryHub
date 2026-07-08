/**
 * Lab 480: Checkbox and Radio Actions
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Implementing checkbox and radio actions:
 * 
 * - Check/uncheck
 * - Radio selection
 * - State verification
 * - Toggle actions
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Implement checkbox methods
 * 2. Handle radio buttons
 * 3. Verify states
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { Page, Locator, expect } from '@playwright/test';

// Solution 1: Basic Checkbox Actions
class BasicCheckboxPage {
    readonly page: Page;
    readonly agreeCheckbox: Locator;
    readonly subscribeCheckbox: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.agreeCheckbox = page.locator('#agree');
        this.subscribeCheckbox = page.locator('#subscribe');
    }
    
    async checkAgree() {
        await this.agreeCheckbox.check();
    }
    
    async uncheckAgree() {
        await this.agreeCheckbox.uncheck();
    }
    
    async toggleSubscribe() {
        await this.subscribeCheckbox.click();
    }
    
    async isAgreeChecked() {
        return await this.agreeCheckbox.isChecked();
    }
}

// Solution 2: Multiple Checkboxes
class MultipleCheckboxPage {
    readonly page: Page;
    readonly checkboxes: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.checkboxes = page.locator('input[type="checkbox"]');
    }
    
    async checkAll() {
        const count = await this.checkboxes.count();
        for (let i = 0; i < count; i++) {
            await this.checkboxes.nth(i).check();
        }
    }
    
    async uncheckAll() {
        const count = await this.checkboxes.count();
        for (let i = 0; i < count; i++) {
            await this.checkboxes.nth(i).uncheck();
        }
    }
    
    async checkByValue(value: string) {
        await this.page.locator(`input[type="checkbox"][value="${value}"]`).check();
    }
    
    async getCheckedValues() {
        const checked: string[] = [];
        const count = await this.checkboxes.count();
        for (let i = 0; i < count; i++) {
            if (await this.checkboxes.nth(i).isChecked()) {
                const value = await this.checkboxes.nth(i).getAttribute('value');
                if (value) checked.push(value);
            }
        }
        return checked;
    }
}

// Solution 3: Radio Button Actions
class RadioButtonPage {
    readonly page: Page;
    readonly genderRadios: Locator;
    readonly paymentRadios: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.genderRadios = page.locator('input[name="gender"]');
        this.paymentRadios = page.locator('input[name="payment"]');
    }
    
    async selectGender(value: string) {
        await this.page.locator(`input[name="gender"][value="${value}"]`).check();
    }
    
    async selectPayment(value: string) {
        await this.page.locator(`input[name="payment"][value="${value}"]`).check();
    }
    
    async getSelectedGender() {
        const count = await this.genderRadios.count();
        for (let i = 0; i < count; i++) {
            if (await this.genderRadios.nth(i).isChecked()) {
                return await this.genderRadios.nth(i).getAttribute('value');
            }
        }
        return null;
    }
}

// Solution 4: Checkbox with Label
class LabeledCheckboxPage {
    readonly page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }
    
    async checkByLabel(label: string) {
        await this.page.getByLabel(label).check();
    }
    
    async uncheckByLabel(label: string) {
        await this.page.getByLabel(label).uncheck();
    }
    
    async isCheckedByLabel(label: string) {
        return await this.page.getByLabel(label).isChecked();
    }
}

// Solution 5: Conditional Check
class ConditionalCheckPage {
    readonly page: Page;
    readonly checkbox: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.checkbox = page.locator('input[type="checkbox"]');
    }
    
    async setChecked(checked: boolean) {
        if (checked) {
            await this.checkbox.check();
        } else {
            await this.checkbox.uncheck();
        }
    }
    
    async ensureChecked() {
        if (!(await this.checkbox.isChecked())) {
            await this.checkbox.check();
        }
    }
    
    async ensureUnchecked() {
        if (await this.checkbox.isChecked()) {
            await this.checkbox.uncheck();
        }
    }
}

// Solution 6: Verify Checkbox State
class VerifyCheckboxPage {
    readonly page: Page;
    readonly checkbox: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.checkbox = page.locator('input[type="checkbox"]');
    }
    
    async assertChecked() {
        await expect(this.checkbox).toBeChecked();
    }
    
    async assertUnchecked() {
        await expect(this.checkbox).not.toBeChecked();
    }
}

// Solution 7: Export
export {
    BasicCheckboxPage,
    MultipleCheckboxPage,
    RadioButtonPage,
    LabeledCheckboxPage,
    ConditionalCheckPage,
    VerifyCheckboxPage,
};

