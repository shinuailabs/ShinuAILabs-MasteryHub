/**
 * Lab 545: Real World Examples
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Real-world POM implementations:
 * 
 * - E-commerce example
 * - Banking example
 * - Social media example
 * - Enterprise example
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Study real examples
 * 2. Apply patterns
 * 3. Adapt to your project
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { Page, Locator } from '@playwright/test';

// Solution 1: E-commerce - Product Page
class ProductPage {
    readonly productTitle: Locator;
    readonly productPrice: Locator;
    readonly addToCartButton: Locator;
    readonly quantityInput: Locator;
    readonly sizeSelector: Locator;
    
    constructor(readonly page: Page) {
        this.productTitle = page.locator('[data-testid="product-title"]');
        this.productPrice = page.locator('[data-testid="product-price"]');
        this.addToCartButton = page.locator('[data-testid="add-to-cart"]');
        this.quantityInput = page.locator('[data-testid="quantity"]');
        this.sizeSelector = page.locator('[data-testid="size-select"]');
    }
    
    async getTitle(): Promise<string | null> {
        return await this.productTitle.textContent();
    }
    
    async getPrice(): Promise<number> {
        const text = await this.productPrice.textContent();
        return parseFloat(text?.replace('$', '') || '0');
    }
    
    async selectSize(size: string) {
        await this.sizeSelector.selectOption(size);
    }
    
    async setQuantity(quantity: number) {
        await this.quantityInput.fill(String(quantity));
    }
    
    async addToCart(options?: { size?: string; quantity?: number }) {
        if (options?.size) await this.selectSize(options.size);
        if (options?.quantity) await this.setQuantity(options.quantity);
        await this.addToCartButton.click();
    }
}

// Solution 2: Banking - Transfer Page
class TransferPage {
    constructor(readonly page: Page) {}
    
    async selectFromAccount(accountNumber: string) {
        await this.page.selectOption('#from-account', accountNumber);
    }
    
    async selectToAccount(accountNumber: string) {
        await this.page.selectOption('#to-account', accountNumber);
    }
    
    async enterAmount(amount: number) {
        await this.page.fill('#amount', String(amount));
    }
    
    async enterDescription(description: string) {
        await this.page.fill('#description', description);
    }
    
    async submitTransfer() {
        await this.page.click('#submit-transfer');
    }
    
    async transfer(data: {
        from: string;
        to: string;
        amount: number;
        description?: string;
    }) {
        await this.selectFromAccount(data.from);
        await this.selectToAccount(data.to);
        await this.enterAmount(data.amount);
        if (data.description) {
            await this.enterDescription(data.description);
        }
        await this.submitTransfer();
    }
    
    async getConfirmationNumber(): Promise<string | null> {
        await this.page.waitForSelector('.confirmation');
        return await this.page.locator('.confirmation-number').textContent();
    }
}

// Solution 3: Social Media - Post Component
class PostComponent {
    constructor(readonly root: Locator) {}
    
    async getAuthor(): Promise<string | null> {
        return await this.root.locator('.post-author').textContent();
    }
    
    async getContent(): Promise<string | null> {
        return await this.root.locator('.post-content').textContent();
    }
    
    async getLikeCount(): Promise<number> {
        const text = await this.root.locator('.like-count').textContent();
        return parseInt(text || '0');
    }
    
    async like() {
        await this.root.locator('.like-button').click();
    }
    
    async comment(text: string) {
        await this.root.locator('.comment-input').fill(text);
        await this.root.locator('.comment-submit').click();
    }
    
    async share() {
        await this.root.locator('.share-button').click();
    }
}

// Solution 4: Enterprise - Dashboard Page
class DashboardPage {
    readonly widgets: Locator;
    readonly notifications: Locator;
    readonly quickActions: Locator;
    
    constructor(readonly page: Page) {
        this.widgets = page.locator('.dashboard-widget');
        this.notifications = page.locator('.notification-item');
        this.quickActions = page.locator('.quick-action');
    }
    
    async getWidgetData(widgetName: string): Promise<string | null> {
        const widget = this.widgets.filter({ hasText: widgetName });
        return await widget.locator('.widget-value').textContent();
    }
    
    async getNotificationCount(): Promise<number> {
        return await this.notifications.count();
    }
    
    async dismissNotification(index: number) {
        await this.notifications.nth(index).locator('.dismiss').click();
    }
    
    async executeQuickAction(actionName: string) {
        await this.quickActions.filter({ hasText: actionName }).click();
    }
    
    async refreshWidget(widgetName: string) {
        const widget = this.widgets.filter({ hasText: widgetName });
        await widget.locator('.refresh-btn').click();
    }
}

// Solution 5: Export
export {
    ProductPage,
    TransferPage,
    PostComponent,
    DashboardPage,
};

