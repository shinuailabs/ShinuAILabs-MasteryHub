/**
 * Lab 484: Scroll Actions
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Implementing scroll actions in POM:
 * 
 * - Scroll into view
 * - Scroll by amount
 * - Scroll to element
 * - Infinite scroll
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Implement scroll methods
 * 2. Handle infinite scroll
 * 3. Scroll to specific elements
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { Page, Locator } from '@playwright/test';

// Solution 1: Basic Scroll
class BasicScrollPage {
    readonly page: Page;
    readonly element: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.element = page.locator('.target-element');
    }
    
    async scrollToElement() {
        await this.element.scrollIntoViewIfNeeded();
    }
    
    async scrollToTop() {
        await this.page.evaluate(() => window.scrollTo(0, 0));
    }
    
    async scrollToBottom() {
        await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    }
}

// Solution 2: Scroll by Amount
class ScrollByAmountPage {
    readonly page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }
    
    async scrollDown(pixels: number) {
        await this.page.evaluate((px) => window.scrollBy(0, px), pixels);
    }
    
    async scrollUp(pixels: number) {
        await this.page.evaluate((px) => window.scrollBy(0, -px), pixels);
    }
    
    async scrollRight(pixels: number) {
        await this.page.evaluate((px) => window.scrollBy(px, 0), pixels);
    }
    
    async scrollLeft(pixels: number) {
        await this.page.evaluate((px) => window.scrollBy(-px, 0), pixels);
    }
}

// Solution 3: Scroll Container
class ScrollContainerPage {
    readonly page: Page;
    readonly container: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.container = page.locator('.scroll-container');
    }
    
    async scrollContainerToTop() {
        await this.container.evaluate((el) => el.scrollTop = 0);
    }
    
    async scrollContainerToBottom() {
        await this.container.evaluate((el) => el.scrollTop = el.scrollHeight);
    }
    
    async scrollContainerBy(amount: number) {
        await this.container.evaluate((el, amt) => el.scrollBy(0, amt), amount);
    }
}

// Solution 4: Infinite Scroll
class InfiniteScrollPage {
    readonly page: Page;
    readonly items: Locator;
    readonly loadingIndicator: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.items = page.locator('.item');
        this.loadingIndicator = page.locator('.loading');
    }
    
    async loadMoreItems(targetCount: number) {
        while (await this.items.count() < targetCount) {
            await this.page.evaluate(() => 
                window.scrollTo(0, document.body.scrollHeight)
            );
            await this.loadingIndicator.waitFor({ state: 'hidden' });
        }
    }
    
    async scrollUntilElementVisible(selector: string) {
        while (!(await this.page.locator(selector).isVisible())) {
            await this.page.evaluate(() => 
                window.scrollBy(0, 500)
            );
            await this.page.waitForTimeout(500);
        }
    }
}

// Solution 5: Scroll with Mouse Wheel
class MouseWheelScrollPage {
    readonly page: Page;
    readonly scrollArea: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.scrollArea = page.locator('.scroll-area');
    }
    
    async wheelScroll(deltaY: number) {
        await this.scrollArea.hover();
        await this.page.mouse.wheel(0, deltaY);
    }
    
    async smoothScroll(deltaY: number, steps: number) {
        const stepSize = deltaY / steps;
        for (let i = 0; i < steps; i++) {
            await this.page.mouse.wheel(0, stepSize);
            await this.page.waitForTimeout(50);
        }
    }
}

// Solution 6: Scroll Position
class ScrollPositionPage {
    readonly page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }
    
    async getScrollPosition() {
        return await this.page.evaluate(() => ({
            x: window.scrollX,
            y: window.scrollY,
        }));
    }
    
    async scrollToPosition(x: number, y: number) {
        await this.page.evaluate(({ x, y }) => window.scrollTo(x, y), { x, y });
    }
    
    async isAtBottom() {
        return await this.page.evaluate(() => 
            window.innerHeight + window.scrollY >= document.body.scrollHeight
        );
    }
}

// Solution 7: Export
export {
    BasicScrollPage,
    ScrollByAmountPage,
    ScrollContainerPage,
    InfiniteScrollPage,
    MouseWheelScrollPage,
    ScrollPositionPage,
};

