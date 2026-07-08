/**
 * Lab 478: Input Actions
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Implementing input actions in POM:
 * 
 * - Fill text
 * - Type text
 * - Clear input
 * - Press keys
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Implement input methods
 * 2. Handle different input types
 * 3. Use keyboard actions
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { Page, Locator } from '@playwright/test';

// Solution 1: Basic Input Actions
class BasicInputPage {
    readonly page: Page;
    readonly textInput: Locator;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.textInput = page.locator('input[type="text"]');
        this.emailInput = page.locator('input[type="email"]');
        this.passwordInput = page.locator('input[type="password"]');
    }
    
    async fillText(text: string) {
        await this.textInput.fill(text);
    }
    
    async fillEmail(email: string) {
        await this.emailInput.fill(email);
    }
    
    async fillPassword(password: string) {
        await this.passwordInput.fill(password);
    }
}

// Solution 2: Type vs Fill
class TypeVsFillPage {
    readonly page: Page;
    readonly input: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.input = page.locator('input');
    }
    
    // Fill - clears and sets value instantly
    async fillInput(text: string) {
        await this.input.fill(text);
    }
    
    // Type - simulates typing character by character
    async typeInput(text: string) {
        await this.input.pressSequentially(text);
    }
    
    // Type with delay
    async typeSlowly(text: string, delay: number) {
        await this.input.pressSequentially(text, { delay });
    }
}

// Solution 3: Clear Input
class ClearInputPage {
    readonly page: Page;
    readonly input: Locator;
    readonly textarea: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.input = page.locator('input');
        this.textarea = page.locator('textarea');
    }
    
    async clearInput() {
        await this.input.clear();
    }
    
    async clearTextarea() {
        await this.textarea.clear();
    }
    
    async clearAndFill(text: string) {
        await this.input.clear();
        await this.input.fill(text);
    }
}

// Solution 4: Keyboard Actions
class KeyboardActionsPage {
    readonly page: Page;
    readonly input: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.input = page.locator('input');
    }
    
    async pressEnter() {
        await this.input.press('Enter');
    }
    
    async pressTab() {
        await this.input.press('Tab');
    }
    
    async pressEscape() {
        await this.input.press('Escape');
    }
    
    async selectAll() {
        await this.input.press('Control+a');
    }
    
    async copy() {
        await this.input.press('Control+c');
    }
    
    async paste() {
        await this.input.press('Control+v');
    }
}

// Solution 5: Textarea Actions
class TextareaActionsPage {
    readonly page: Page;
    readonly textarea: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.textarea = page.locator('textarea');
    }
    
    async fillTextarea(text: string) {
        await this.textarea.fill(text);
    }
    
    async appendText(text: string) {
        const current = await this.textarea.inputValue();
        await this.textarea.fill(current + text);
    }
    
    async getTextareaValue() {
        return await this.textarea.inputValue();
    }
}

// Solution 6: Form Input Actions
class FormInputActionsPage {
    readonly page: Page;
    readonly form: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.form = page.locator('form');
    }
    
    async fillField(name: string, value: string) {
        await this.form.locator(`[name="${name}"]`).fill(value);
    }
    
    async fillAllFields(data: Record<string, string>) {
        for (const [name, value] of Object.entries(data)) {
            await this.fillField(name, value);
        }
    }
    
    async getFieldValue(name: string) {
        return await this.form.locator(`[name="${name}"]`).inputValue();
    }
}

// Solution 7: Export
export {
    BasicInputPage,
    TypeVsFillPage,
    ClearInputPage,
    KeyboardActionsPage,
    TextareaActionsPage,
    FormInputActionsPage,
};

