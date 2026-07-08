/**
 * Lab 501: Modal Component
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Creating modal components:
 * 
 * - Modal structure
 * - Open/close actions
 * - Modal content
 * - Confirmation dialogs
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create modal component
 * 2. Handle modal actions
 * 3. Implement confirmation
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { Locator, expect } from '@playwright/test';

// Solution 1: Basic Modal Component
class ModalComponent {
    readonly root: Locator;
    readonly title: Locator;
    readonly content: Locator;
    readonly closeButton: Locator;
    readonly overlay: Locator;
    
    constructor(root: Locator) {
        this.root = root;
        this.title = root.locator('.modal-title');
        this.content = root.locator('.modal-content');
        this.closeButton = root.locator('.modal-close');
        this.overlay = root.locator('.modal-overlay');
    }
    
    async close() {
        await this.closeButton.click();
    }
    
    async closeByOverlay() {
        await this.overlay.click();
    }
    
    async getTitle() {
        return await this.title.textContent();
    }
    
    async getContent() {
        return await this.content.textContent();
    }
    
    async isOpen() {
        return await this.root.isVisible();
    }
}

// Solution 2: Confirmation Modal
class ConfirmationModalComponent {
    readonly root: Locator;
    readonly message: Locator;
    readonly confirmButton: Locator;
    readonly cancelButton: Locator;
    
    constructor(root: Locator) {
        this.root = root;
        this.message = root.locator('.confirmation-message');
        this.confirmButton = root.locator('.confirm-btn');
        this.cancelButton = root.locator('.cancel-btn');
    }
    
    async confirm() {
        await this.confirmButton.click();
    }
    
    async cancel() {
        await this.cancelButton.click();
    }
    
    async getMessage() {
        return await this.message.textContent();
    }
}

// Solution 3: Form Modal
class FormModalComponent {
    readonly root: Locator;
    readonly form: Locator;
    readonly submitButton: Locator;
    readonly cancelButton: Locator;
    
    constructor(root: Locator) {
        this.root = root;
        this.form = root.locator('form');
        this.submitButton = root.locator('button[type="submit"]');
        this.cancelButton = root.locator('.cancel-btn');
    }
    
    async fillField(name: string, value: string) {
        await this.form.locator(`[name="${name}"]`).fill(value);
    }
    
    async submit() {
        await this.submitButton.click();
    }
    
    async cancel() {
        await this.cancelButton.click();
    }
}

// Solution 4: Alert Modal
class AlertModalComponent {
    readonly root: Locator;
    readonly icon: Locator;
    readonly message: Locator;
    readonly okButton: Locator;
    
    constructor(root: Locator) {
        this.root = root;
        this.icon = root.locator('.alert-icon');
        this.message = root.locator('.alert-message');
        this.okButton = root.locator('.ok-btn');
    }
    
    async acknowledge() {
        await this.okButton.click();
    }
    
    async getMessage() {
        return await this.message.textContent();
    }
    
    async getAlertType() {
        return await this.icon.getAttribute('data-type');
    }
}

// Solution 5: Modal with Tabs
class TabbedModalComponent {
    readonly root: Locator;
    readonly tabs: Locator;
    readonly tabPanels: Locator;
    
    constructor(root: Locator) {
        this.root = root;
        this.tabs = root.locator('.modal-tab');
        this.tabPanels = root.locator('.modal-tab-panel');
    }
    
    async selectTab(tabName: string) {
        await this.tabs.filter({ hasText: tabName }).click();
    }
    
    async getActiveTabContent() {
        return await this.tabPanels.filter({ has: root.page().locator('.active') }).textContent();
    }
}

// Solution 6: Modal Assertions
class ModalAssertions {
    static async assertModalOpen(modal: ModalComponent) {
        await expect(modal.root).toBeVisible();
    }
    
    static async assertModalClosed(modal: ModalComponent) {
        await expect(modal.root).toBeHidden();
    }
    
    static async assertModalTitle(modal: ModalComponent, title: string) {
        await expect(modal.title).toHaveText(title);
    }
}

// Solution 7: Export
export {
    ModalComponent,
    ConfirmationModalComponent,
    FormModalComponent,
    AlertModalComponent,
    TabbedModalComponent,
    ModalAssertions,
};

