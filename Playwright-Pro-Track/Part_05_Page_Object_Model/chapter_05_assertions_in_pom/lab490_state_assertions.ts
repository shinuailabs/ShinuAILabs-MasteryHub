/**
 * Lab 490: State Assertions
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Implementing state assertions in POM:
 * 
 * - toBeEnabled/toBeDisabled
 * - toBeChecked
 * - toBeEditable
 * - toHaveValue
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Assert element states
 * 2. Check form field states
 * 3. Verify input values
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { Page, Locator, expect } from '@playwright/test';

// Solution 1: Enabled/Disabled Assertions
class EnabledDisabledPage {
    readonly page: Page;
    readonly submitButton: Locator;
    readonly cancelButton: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.submitButton = page.locator('#submit');
        this.cancelButton = page.locator('#cancel');
    }
    
    async assertSubmitEnabled() {
        await expect(this.submitButton).toBeEnabled();
    }
    
    async assertSubmitDisabled() {
        await expect(this.submitButton).toBeDisabled();
    }
    
    async assertCancelEnabled() {
        await expect(this.cancelButton).toBeEnabled();
    }
}

// Solution 2: Checked Assertions
class CheckedAssertionsPage {
    readonly page: Page;
    readonly checkbox: Locator;
    readonly radio: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.checkbox = page.locator('input[type="checkbox"]');
        this.radio = page.locator('input[type="radio"]');
    }
    
    async assertCheckboxChecked() {
        await expect(this.checkbox).toBeChecked();
    }
    
    async assertCheckboxUnchecked() {
        await expect(this.checkbox).not.toBeChecked();
    }
    
    async assertRadioSelected() {
        await expect(this.radio).toBeChecked();
    }
}

// Solution 3: Editable Assertions
class EditableAssertionsPage {
    readonly page: Page;
    readonly editableInput: Locator;
    readonly readonlyInput: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.editableInput = page.locator('#editable');
        this.readonlyInput = page.locator('#readonly');
    }
    
    async assertInputEditable() {
        await expect(this.editableInput).toBeEditable();
    }
    
    async assertInputNotEditable() {
        await expect(this.readonlyInput).not.toBeEditable();
    }
}

// Solution 4: Value Assertions
class ValueAssertionsPage {
    readonly page: Page;
    readonly textInput: Locator;
    readonly select: Locator;
    readonly textarea: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.textInput = page.locator('input[type="text"]');
        this.select = page.locator('select');
        this.textarea = page.locator('textarea');
    }
    
    async assertInputValue(value: string) {
        await expect(this.textInput).toHaveValue(value);
    }
    
    async assertSelectValue(value: string) {
        await expect(this.select).toHaveValue(value);
    }
    
    async assertTextareaValue(value: string) {
        await expect(this.textarea).toHaveValue(value);
    }
    
    async assertInputEmpty() {
        await expect(this.textInput).toHaveValue('');
    }
}

// Solution 5: Focus Assertions
class FocusAssertionsPage {
    readonly page: Page;
    readonly input: Locator;
    readonly button: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.input = page.locator('input');
        this.button = page.locator('button');
    }
    
    async assertInputFocused() {
        await expect(this.input).toBeFocused();
    }
    
    async assertButtonFocused() {
        await expect(this.button).toBeFocused();
    }
}

// Solution 6: Form State Assertions
class FormStateAssertionsPage {
    readonly page: Page;
    readonly form: Locator;
    readonly submitButton: Locator;
    readonly requiredFields: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.form = page.locator('form');
        this.submitButton = page.locator('button[type="submit"]');
        this.requiredFields = page.locator('[required]');
    }
    
    async assertFormValid() {
        await expect(this.submitButton).toBeEnabled();
    }
    
    async assertFormInvalid() {
        await expect(this.submitButton).toBeDisabled();
    }
    
    async assertAllFieldsFilled() {
        const count = await this.requiredFields.count();
        for (let i = 0; i < count; i++) {
            await expect(this.requiredFields.nth(i)).not.toHaveValue('');
        }
    }
}

// Solution 7: Export
export {
    EnabledDisabledPage,
    CheckedAssertionsPage,
    EditableAssertionsPage,
    ValueAssertionsPage,
    FocusAssertionsPage,
    FormStateAssertionsPage,
};

