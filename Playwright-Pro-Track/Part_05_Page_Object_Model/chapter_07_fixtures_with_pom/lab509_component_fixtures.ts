/**
 * Lab 509: Component Fixtures
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Creating component fixtures:
 * 
 * - Component fixture pattern
 * - Reusable components
 * - Component composition
 * - Shared components
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create component fixtures
 * 2. Compose components
 * 3. Share components
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test as base, Page, Locator } from '@playwright/test';

// Solution 1: Component Classes
class HeaderComponent {
    constructor(readonly root: Locator) {}
    
    async clickLogo() {
        await this.root.locator('.logo').click();
    }
    
    async search(query: string) {
        await this.root.locator('input[type="search"]').fill(query);
        await this.root.locator('.search-btn').click();
    }
}

class FooterComponent {
    constructor(readonly root: Locator) {}
    
    async clickLink(text: string) {
        await this.root.locator(`a:has-text("${text}")`).click();
    }
}

class ModalComponent {
    constructor(readonly root: Locator) {}
    
    async close() {
        await this.root.locator('.close-btn').click();
    }
    
    async confirm() {
        await this.root.locator('.confirm-btn').click();
    }
}

// Solution 2: Component Fixtures
type ComponentFixtures = {
    header: HeaderComponent;
    footer: FooterComponent;
    modal: ModalComponent;
};

const test = base.extend<ComponentFixtures>({
    header: async ({ page }, use) => {
        await use(new HeaderComponent(page.locator('header')));
    },
    
    footer: async ({ page }, use) => {
        await use(new FooterComponent(page.locator('footer')));
    },
    
    modal: async ({ page }, use) => {
        await use(new ModalComponent(page.locator('.modal')));
    },
});

// Solution 3: Page with Components
class PageWithComponents {
    readonly header: HeaderComponent;
    readonly footer: FooterComponent;
    
    constructor(readonly page: Page) {
        this.header = new HeaderComponent(page.locator('header'));
        this.footer = new FooterComponent(page.locator('footer'));
    }
}

type ComposedFixtures = {
    pageWithComponents: PageWithComponents;
};

const testComposed = base.extend<ComposedFixtures>({
    pageWithComponents: async ({ page }, use) => {
        await use(new PageWithComponents(page));
    },
});

// Solution 4: Dynamic Component Fixture
type DynamicComponentFixtures = {
    getModal: (selector: string) => ModalComponent;
};

const testDynamic = base.extend<DynamicComponentFixtures>({
    getModal: async ({ page }, use) => {
        const getModal = (selector: string) => new ModalComponent(page.locator(selector));
        await use(getModal);
    },
});

// Solution 5: Component Factory Fixture
class ComponentFactory {
    constructor(readonly page: Page) {}
    
    createHeader() {
        return new HeaderComponent(this.page.locator('header'));
    }
    
    createFooter() {
        return new FooterComponent(this.page.locator('footer'));
    }
    
    createModal(selector: string = '.modal') {
        return new ModalComponent(this.page.locator(selector));
    }
}

type FactoryFixtures = {
    componentFactory: ComponentFactory;
};

const testFactory = base.extend<FactoryFixtures>({
    componentFactory: async ({ page }, use) => {
        await use(new ComponentFactory(page));
    },
});

// Solution 6: Export
export { test, testComposed, testDynamic, testFactory };
export { HeaderComponent, FooterComponent, ModalComponent, PageWithComponents, ComponentFactory };

