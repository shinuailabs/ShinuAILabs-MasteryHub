/**
 * Lab 500: Form Component
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Creating form components:
 * 
 * - Form fields
 * - Validation
 * - Submission
 * - Error handling
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create form component
 * 2. Handle form fields
 * 3. Implement validation
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { Locator, expect } from '@playwright/test';

// Solution 1: Basic Form Component
class FormComponent {
    readonly root: Locator;
    readonly submitButton: Locator;
    readonly resetButton: Locator;
    
    constructor(root: Locator) {
        this.root = root;
        this.submitButton = root.locator('button[type="submit"]');
        this.resetButton = root.locator('button[type="reset"]');
    }
    
    async fillField(name: string, value: string) {
        await this.root.locator(`[name="${name}"]`).fill(value);
    }
    
    async submit() {
        await this.submitButton.click();
    }
    
    async reset() {
        await this.resetButton.click();
    }
    
    async getFieldValue(name: string) {
        return await this.root.locator(`[name="${name}"]`).inputValue();
    }
}

// Solution 2: Login Form Component
class LoginFormComponent {
    readonly root: Locator;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly rememberMeCheckbox: Locator;
    readonly submitButton: Locator;
    readonly errorMessage: Locator;
    
    constructor(root: Locator) {
        this.root = root;
        this.usernameInput = root.locator('#username');
        this.passwordInput = root.locator('#password');
        this.rememberMeCheckbox = root.locator('#remember-me');
        this.submitButton = root.locator('button[type="submit"]');
        this.errorMessage = root.locator('.error-message');
    }
    
    async login(username: string, password: string, rememberMe: boolean = false) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        if (rememberMe) {
            await this.rememberMeCheckbox.check();
        }
        await this.submitButton.click();
    }
    
    async getErrorMessage() {
        return await this.errorMessage.textContent();
    }
}

// Solution 3: Registration Form Component
class RegistrationFormComponent {
    readonly root: Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly confirmPasswordInput: Locator;
    readonly termsCheckbox: Locator;
    readonly submitButton: Locator;
    
    constructor(root: Locator) {
        this.root = root;
        this.firstNameInput = root.locator('#firstName');
        this.lastNameInput = root.locator('#lastName');
        this.emailInput = root.locator('#email');
        this.passwordInput = root.locator('#password');
        this.confirmPasswordInput = root.locator('#confirmPassword');
        this.termsCheckbox = root.locator('#terms');
        this.submitButton = root.locator('button[type="submit"]');
    }
    
    async register(data: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
    }) {
        await this.firstNameInput.fill(data.firstName);
        await this.lastNameInput.fill(data.lastName);
        await this.emailInput.fill(data.email);
        await this.passwordInput.fill(data.password);
        await this.confirmPasswordInput.fill(data.password);
        await this.termsCheckbox.check();
        await this.submitButton.click();
    }
}

// Solution 4: Form with Validation
class ValidatedFormComponent {
    readonly root: Locator;
    readonly fields: Locator;
    readonly errors: Locator;
    
    constructor(root: Locator) {
        this.root = root;
        this.fields = root.locator('input, select, textarea');
        this.errors = root.locator('.field-error');
    }
    
    async getFieldError(fieldName: string) {
        return await this.root.locator(`[data-error-for="${fieldName}"]`).textContent();
    }
    
    async hasFieldError(fieldName: string) {
        return await this.root.locator(`[data-error-for="${fieldName}"]`).isVisible();
    }
    
    async getErrorCount() {
        return await this.errors.count();
    }
    
    async assertNoErrors() {
        await expect(this.errors).toHaveCount(0);
    }
}

// Solution 5: Dynamic Form Component
class DynamicFormComponent {
    readonly root: Locator;
    
    constructor(root: Locator) {
        this.root = root;
    }
    
    async fillAllFields(data: Record<string, string>) {
        for (const [name, value] of Object.entries(data)) {
            await this.root.locator(`[name="${name}"]`).fill(value);
        }
    }
    
    async getAllFieldValues() {
        const fields = await this.root.locator('input, select, textarea').all();
        const values: Record<string, string> = {};
        for (const field of fields) {
            const name = await field.getAttribute('name');
            if (name) {
                values[name] = await field.inputValue();
            }
        }
        return values;
    }
}

// Solution 6: Export
export {
    FormComponent,
    LoginFormComponent,
    RegistrationFormComponent,
    ValidatedFormComponent,
    DynamicFormComponent,
};

