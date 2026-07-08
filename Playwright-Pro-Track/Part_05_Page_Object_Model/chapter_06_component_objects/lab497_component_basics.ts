/**
 * Lab 497: Component Basics
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Understanding component objects:
 * 
 * - What are components
 * - Component vs Page
 * - Reusable components
 * - Component structure
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create basic components
 * 2. Understand component scope
 * 3. Use components in pages
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { Page, Locator } from '@playwright/test';

// Solution 1: Basic Component
class ButtonComponent {
    readonly root: Locator;
    
    constructor(root: Locator) {
        this.root = root;
    }
    
    async click() {
        await this.root.click();
    }
    
    async getText() {
        return await this.root.textContent();
    }
    
    async isEnabled() {
        return await this.root.isEnabled();
    }
    
    async isVisible() {
        return await this.root.isVisible();
    }
}

// Solution 2: Input Component
class InputComponent {
    readonly root: Locator;
    
    constructor(root: Locator) {
        this.root = root;
    }
    
    async fill(value: string) {
        await this.root.fill(value);
    }
    
    async clear() {
        await this.root.clear();
    }
    
    async getValue() {
        return await this.root.inputValue();
    }
    
    async getPlaceholder() {
        return await this.root.getAttribute('placeholder');
    }
}

// Solution 3: Card Component
class CardComponent {
    readonly root: Locator;
    readonly title: Locator;
    readonly content: Locator;
    readonly actions: Locator;
    
    constructor(root: Locator) {
        this.root = root;
        this.title = root.locator('.card-title');
        this.content = root.locator('.card-content');
        this.actions = root.locator('.card-actions');
    }
    
    async getTitle() {
        return await this.title.textContent();
    }
    
    async getContent() {
        return await this.content.textContent();
    }
    
    async clickAction(actionText: string) {
        await this.actions.locator(`text=${actionText}`).click();
    }
}

// Solution 4: Using Components in Page
class ProductPage {
    readonly page: Page;
    readonly addToCartButton: ButtonComponent;
    readonly quantityInput: InputComponent;
    readonly productCard: CardComponent;
    
    constructor(page: Page) {
        this.page = page;
        this.addToCartButton = new ButtonComponent(page.locator('#add-to-cart'));
        this.quantityInput = new InputComponent(page.locator('#quantity'));
        this.productCard = new CardComponent(page.locator('.product-card'));
    }
    
    async addToCart(quantity: number) {
        await this.quantityInput.fill(String(quantity));
        await this.addToCartButton.click();
    }
    
    async getProductTitle() {
        return await this.productCard.getTitle();
    }
}

// Solution 5: Component vs Page
/*
 * Component:
 * - Represents a reusable UI element
 * - Has a root locator
 * - Can be used across pages
 * - Focused on single responsibility
 * 
 * Page:
 * - Represents a full page
 * - Has page reference
 * - Contains multiple components
 * - Handles page-level actions
 */

// Solution 6: Export
export {
    ButtonComponent,
    InputComponent,
    CardComponent,
    ProductPage,
};

