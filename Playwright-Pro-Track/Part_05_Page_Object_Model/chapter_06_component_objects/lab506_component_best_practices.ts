/**
 * Lab 506: Component Best Practices
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Best practices for components:
 * 
 * - Component design
 * - Reusability
 * - Composition
 * - Testing components
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Apply component best practices
 * 2. Design reusable components
 * 3. Compose components
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { Locator, expect } from '@playwright/test';

// Solution 1: Single Responsibility
class SingleResponsibilityButton {
    readonly root: Locator;
    
    constructor(root: Locator) {
        this.root = root;
    }
    
    // GOOD: Focused on button actions only
    async click() {
        await this.root.click();
    }
    
    async getText() {
        return await this.root.textContent();
    }
    
    async isEnabled() {
        return await this.root.isEnabled();
    }
    
    // BAD: Don't add unrelated functionality
    // async navigateToPage() { ... }
}

// Solution 2: Composition Over Inheritance
class ComposedFormComponent {
    readonly root: Locator;
    readonly submitButton: SingleResponsibilityButton;
    readonly cancelButton: SingleResponsibilityButton;
    
    constructor(root: Locator) {
        this.root = root;
        // GOOD: Compose with other components
        this.submitButton = new SingleResponsibilityButton(root.locator('.submit'));
        this.cancelButton = new SingleResponsibilityButton(root.locator('.cancel'));
    }
    
    async submit() {
        await this.submitButton.click();
    }
    
    async cancel() {
        await this.cancelButton.click();
    }
}

// Solution 3: Encapsulation
class EncapsulatedComponent {
    readonly root: Locator;
    // GOOD: Private internal locators
    private readonly internalElement: Locator;
    
    constructor(root: Locator) {
        this.root = root;
        this.internalElement = root.locator('.internal');
    }
    
    // GOOD: Expose behavior, not implementation
    async performAction() {
        await this.internalElement.click();
    }
    
    // BAD: Don't expose internal locators
    // getInternalElement() { return this.internalElement; }
}

// Solution 4: Consistent Interface
interface IClickable {
    click(): Promise<void>;
    isEnabled(): Promise<boolean>;
}

interface ITextContent {
    getText(): Promise<string | null>;
}

class ConsistentButton implements IClickable, ITextContent {
    readonly root: Locator;
    
    constructor(root: Locator) {
        this.root = root;
    }
    
    async click() {
        await this.root.click();
    }
    
    async isEnabled() {
        return await this.root.isEnabled();
    }
    
    async getText() {
        return await this.root.textContent();
    }
}

// Solution 5: Self-Contained Assertions
class SelfContainedComponent {
    readonly root: Locator;
    readonly title: Locator;
    
    constructor(root: Locator) {
        this.root = root;
        this.title = root.locator('.title');
    }
    
    // GOOD: Component-specific assertions
    async assertVisible() {
        await expect(this.root).toBeVisible();
    }
    
    async assertTitle(expected: string) {
        await expect(this.title).toHaveText(expected);
    }
}

// Solution 6: Factory Pattern for Components
class ComponentFactory {
    static createButton(root: Locator): SingleResponsibilityButton {
        return new SingleResponsibilityButton(root);
    }
    
    static createForm(root: Locator): ComposedFormComponent {
        return new ComposedFormComponent(root);
    }
}

// Solution 7: Best Practices Summary
/*
 * Component Best Practices:
 * 
 * DO:
 * - Single responsibility
 * - Composition over inheritance
 * - Encapsulate implementation
 * - Consistent interfaces
 * - Self-contained assertions
 * - Use factory patterns
 * 
 * DON'T:
 * - Mix unrelated functionality
 * - Expose internal locators
 * - Create deep inheritance
 * - Duplicate code across components
 */

// Solution 8: Export
export {
    SingleResponsibilityButton,
    ComposedFormComponent,
    EncapsulatedComponent,
    ConsistentButton,
    SelfContainedComponent,
    ComponentFactory,
    IClickable,
    ITextContent,
};

