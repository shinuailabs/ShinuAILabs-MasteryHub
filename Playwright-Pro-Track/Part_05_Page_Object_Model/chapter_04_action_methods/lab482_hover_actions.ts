/**
 * Lab 482: Hover Actions
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Implementing hover actions in POM:
 * 
 * - Basic hover
 * - Hover menus
 * - Tooltips
 * - Hover states
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Implement hover methods
 * 2. Handle hover menus
 * 3. Work with tooltips
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { Page, Locator } from '@playwright/test';

// Solution 1: Basic Hover
class BasicHoverPage {
    readonly page: Page;
    readonly hoverElement: Locator;
    readonly hiddenContent: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.hoverElement = page.locator('.hover-trigger');
        this.hiddenContent = page.locator('.hover-content');
    }
    
    async hoverOverElement() {
        await this.hoverElement.hover();
    }
    
    async hoverAndGetContent() {
        await this.hoverElement.hover();
        return await this.hiddenContent.textContent();
    }
}

// Solution 2: Hover Menu
class HoverMenuPage {
    readonly page: Page;
    readonly menuTrigger: Locator;
    readonly submenu: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.menuTrigger = page.locator('.menu-item');
        this.submenu = page.locator('.submenu');
    }
    
    async openSubmenu() {
        await this.menuTrigger.hover();
        await this.submenu.waitFor({ state: 'visible' });
    }
    
    async clickSubmenuItem(text: string) {
        await this.openSubmenu();
        await this.submenu.locator(`text=${text}`).click();
    }
}

// Solution 3: Tooltip
class TooltipPage {
    readonly page: Page;
    readonly tooltipTrigger: Locator;
    readonly tooltip: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.tooltipTrigger = page.locator('[data-tooltip]');
        this.tooltip = page.locator('.tooltip');
    }
    
    async showTooltip() {
        await this.tooltipTrigger.hover();
        await this.tooltip.waitFor({ state: 'visible' });
    }
    
    async getTooltipText() {
        await this.showTooltip();
        return await this.tooltip.textContent();
    }
    
    async hideTooltip() {
        await this.page.mouse.move(0, 0);
        await this.tooltip.waitFor({ state: 'hidden' });
    }
}

// Solution 4: Hover Card
class HoverCardPage {
    readonly page: Page;
    readonly userLink: Locator;
    readonly hoverCard: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.userLink = page.locator('.user-link');
        this.hoverCard = page.locator('.hover-card');
    }
    
    async showUserCard() {
        await this.userLink.hover();
        await this.hoverCard.waitFor({ state: 'visible' });
    }
    
    async getUserInfo() {
        await this.showUserCard();
        return {
            name: await this.hoverCard.locator('.name').textContent(),
            email: await this.hoverCard.locator('.email').textContent(),
        };
    }
}

// Solution 5: Hover with Position
class HoverPositionPage {
    readonly page: Page;
    readonly element: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.element = page.locator('.hover-area');
    }
    
    async hoverAtCenter() {
        await this.element.hover();
    }
    
    async hoverAtPosition(x: number, y: number) {
        await this.element.hover({ position: { x, y } });
    }
    
    async hoverAtCorner(corner: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight') {
        const box = await this.element.boundingBox();
        if (box) {
            const positions = {
                topLeft: { x: 0, y: 0 },
                topRight: { x: box.width, y: 0 },
                bottomLeft: { x: 0, y: box.height },
                bottomRight: { x: box.width, y: box.height },
            };
            await this.element.hover({ position: positions[corner] });
        }
    }
}

// Solution 6: Multiple Hover Actions
class MultipleHoverPage {
    readonly page: Page;
    readonly items: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.items = page.locator('.hover-item');
    }
    
    async hoverItem(index: number) {
        await this.items.nth(index).hover();
    }
    
    async hoverAllItems() {
        const count = await this.items.count();
        for (let i = 0; i < count; i++) {
            await this.items.nth(i).hover();
            await this.page.waitForTimeout(500);
        }
    }
}

// Solution 7: Export
export {
    BasicHoverPage,
    HoverMenuPage,
    TooltipPage,
    HoverCardPage,
    HoverPositionPage,
    MultipleHoverPage,
};

