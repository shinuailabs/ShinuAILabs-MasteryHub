/**
 * Lab 540: Reusability
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Creating reusable POM code:
 * 
 * - Reusable components
 * - Generic methods
 * - Shared utilities
 * - Cross-project reuse
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create reusable components
 * 2. Build generic methods
 * 3. Share utilities
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { Page, Locator } from '@playwright/test';

// Solution 1: Reusable Form Component
class FormComponent {
    constructor(readonly root: Locator) {}
    
    async fill(name: string, value: string) {
        await this.root.locator(`[name="${name}"]`).fill(value);
    }
    
    async select(name: string, value: string) {
        await this.root.locator(`[name="${name}"]`).selectOption(value);
    }
    
    async check(name: string) {
        await this.root.locator(`[name="${name}"]`).check();
    }
    
    async submit() {
        await this.root.locator('button[type="submit"]').click();
    }
    
    async fillAll(data: Record<string, string>) {
        for (const [name, value] of Object.entries(data)) {
            await this.fill(name, value);
        }
    }
}

// Solution 2: Reusable Table Component
class TableComponent<T> {
    constructor(readonly root: Locator) {}
    
    async getRowCount(): Promise<number> {
        return await this.root.locator('tbody tr').count();
    }
    
    async getRow(index: number): Promise<Locator> {
        return this.root.locator('tbody tr').nth(index);
    }
    
    async getCellText(row: number, col: number): Promise<string | null> {
        return await this.root.locator(`tbody tr:nth-child(${row + 1}) td:nth-child(${col + 1})`).textContent();
    }
    
    async clickRowAction(rowIndex: number, actionName: string) {
        const row = await this.getRow(rowIndex);
        await row.locator(`button:has-text("${actionName}")`).click();
    }
    
    async findRowByText(text: string): Promise<Locator> {
        return this.root.locator('tbody tr').filter({ hasText: text });
    }
}

// Solution 3: Reusable Modal Component
class ModalComponent {
    constructor(readonly root: Locator) {}
    
    async isOpen(): Promise<boolean> {
        return await this.root.isVisible();
    }
    
    async close() {
        await this.root.locator('.close-btn').click();
    }
    
    async confirm() {
        await this.root.locator('.confirm-btn').click();
    }
    
    async cancel() {
        await this.root.locator('.cancel-btn').click();
    }
    
    async getTitle(): Promise<string | null> {
        return await this.root.locator('.modal-title').textContent();
    }
}

// Solution 4: Generic Wait Utility
class WaitUtils {
    constructor(private page: Page) {}
    
    async waitForElement(selector: string, timeout: number = 30000) {
        await this.page.locator(selector).waitFor({ state: 'visible', timeout });
    }
    
    async waitForElementHidden(selector: string, timeout: number = 30000) {
        await this.page.locator(selector).waitFor({ state: 'hidden', timeout });
    }
    
    async waitForText(selector: string, text: string, timeout: number = 30000) {
        await this.page.locator(selector).filter({ hasText: text }).waitFor({ timeout });
    }
    
    async waitForNetworkIdle() {
        await this.page.waitForLoadState('networkidle');
    }
}

// Solution 5: Reusable Action Helpers
class ActionHelpers {
    constructor(private page: Page) {}
    
    async clickAndWaitForNavigation(selector: string) {
        await Promise.all([
            this.page.waitForNavigation(),
            this.page.click(selector),
        ]);
    }
    
    async fillAndTab(selector: string, value: string) {
        await this.page.fill(selector, value);
        await this.page.keyboard.press('Tab');
    }
    
    async selectByText(selector: string, text: string) {
        await this.page.locator(selector).selectOption({ label: text });
    }
    
    async scrollToElement(selector: string) {
        await this.page.locator(selector).scrollIntoViewIfNeeded();
    }
}

// Solution 6: Composable Page Builder
class PageBuilder {
    private components: Map<string, unknown> = new Map();
    
    constructor(private page: Page) {}
    
    withForm(selector: string): this {
        this.components.set('form', new FormComponent(this.page.locator(selector)));
        return this;
    }
    
    withTable(selector: string): this {
        this.components.set('table', new TableComponent(this.page.locator(selector)));
        return this;
    }
    
    withModal(selector: string): this {
        this.components.set('modal', new ModalComponent(this.page.locator(selector)));
        return this;
    }
    
    get form(): FormComponent {
        return this.components.get('form') as FormComponent;
    }
    
    get table(): TableComponent<unknown> {
        return this.components.get('table') as TableComponent<unknown>;
    }
    
    get modal(): ModalComponent {
        return this.components.get('modal') as ModalComponent;
    }
}

// Solution 7: Export
export {
    FormComponent,
    TableComponent,
    ModalComponent,
    WaitUtils,
    ActionHelpers,
    PageBuilder,
};

