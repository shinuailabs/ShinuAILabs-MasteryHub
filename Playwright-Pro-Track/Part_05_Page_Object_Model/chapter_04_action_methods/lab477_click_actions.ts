/**
 * Lab 477: Click Actions
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Implementing click actions in POM:
 * 
 * - Single click
 * - Double click
 * - Right click
 * - Click options
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Implement click methods
 * 2. Use click options
 * 3. Handle different click types
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { Page, Locator } from '@playwright/test';

// Solution 1: Basic Click Actions
class BasicClickPage {
    readonly page: Page;
    readonly button: Locator;
    readonly link: Locator;
    readonly checkbox: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.button = page.locator('button');
        this.link = page.locator('a');
        this.checkbox = page.locator('input[type="checkbox"]');
    }
    
    async clickButton() {
        await this.button.click();
    }
    
    async clickLink() {
        await this.link.click();
    }
    
    async clickCheckbox() {
        await this.checkbox.click();
    }
}

// Solution 2: Click with Options
class ClickOptionsPage {
    readonly page: Page;
    readonly element: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.element = page.locator('.clickable');
    }
    
    // Click with position
    async clickAtPosition(x: number, y: number) {
        await this.element.click({ position: { x, y } });
    }
    
    // Click with modifier
    async clickWithCtrl() {
        await this.element.click({ modifiers: ['Control'] });
    }
    
    // Click with delay
    async clickWithDelay(delay: number) {
        await this.element.click({ delay });
    }
    
    // Force click
    async forceClick() {
        await this.element.click({ force: true });
    }
}

// Solution 3: Double Click
class DoubleClickPage {
    readonly page: Page;
    readonly editableText: Locator;
    readonly item: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.editableText = page.locator('.editable');
        this.item = page.locator('.item');
    }
    
    async doubleClickToEdit() {
        await this.editableText.dblclick();
    }
    
    async doubleClickItem() {
        await this.item.dblclick();
    }
}

// Solution 4: Right Click (Context Menu)
class RightClickPage {
    readonly page: Page;
    readonly contextArea: Locator;
    readonly contextMenu: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.contextArea = page.locator('.context-area');
        this.contextMenu = page.locator('.context-menu');
    }
    
    async openContextMenu() {
        await this.contextArea.click({ button: 'right' });
    }
    
    async selectContextMenuItem(item: string) {
        await this.openContextMenu();
        await this.contextMenu.locator(`text=${item}`).click();
    }
}

// Solution 5: Click and Hold
class ClickHoldPage {
    readonly page: Page;
    readonly holdButton: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.holdButton = page.locator('.hold-button');
    }
    
    async clickAndHold(duration: number) {
        await this.holdButton.click({ delay: duration });
    }
}

// Solution 6: Multiple Clicks
class MultipleClicksPage {
    readonly page: Page;
    readonly items: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.items = page.locator('.item');
    }
    
    async clickAllItems() {
        const count = await this.items.count();
        for (let i = 0; i < count; i++) {
            await this.items.nth(i).click();
        }
    }
    
    async clickItemByIndex(index: number) {
        await this.items.nth(index).click();
    }
}

// Solution 7: Conditional Click
class ConditionalClickPage {
    readonly page: Page;
    readonly button: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.button = page.locator('button');
    }
    
    async clickIfVisible() {
        if (await this.button.isVisible()) {
            await this.button.click();
        }
    }
    
    async clickIfEnabled() {
        if (await this.button.isEnabled()) {
            await this.button.click();
        }
    }
}

// Solution 8: Export
export {
    BasicClickPage,
    ClickOptionsPage,
    DoubleClickPage,
    RightClickPage,
    ClickHoldPage,
    MultipleClicksPage,
    ConditionalClickPage,
};

