/**
 * Lab 531: Page Composition
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Composing pages from components:
 * 
 * - Composition over inheritance
 * - Component injection
 * - Shared components
 * - Flexible structure
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Compose pages
 * 2. Inject components
 * 3. Share components
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { Page, Locator } from '@playwright/test';

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
    
    async getUserName() {
        return await this.root.locator('.user-name').textContent();
    }
}

class FooterComponent {
    constructor(readonly root: Locator) {}
    
    async clickLink(text: string) {
        await this.root.locator(`a:has-text("${text}")`).click();
    }
    
    async getCopyright() {
        return await this.root.locator('.copyright').textContent();
    }
}

class SidebarComponent {
    constructor(readonly root: Locator) {}
    
    async navigateTo(item: string) {
        await this.root.locator(`text=${item}`).click();
    }
    
    async isExpanded() {
        const classes = await this.root.getAttribute('class');
        return !classes?.includes('collapsed');
    }
    
    async toggle() {
        await this.root.locator('.toggle-btn').click();
    }
}

class BreadcrumbComponent {
    constructor(readonly root: Locator) {}
    
    async clickItem(text: string) {
        await this.root.locator(`text=${text}`).click();
    }
    
    async getCurrentPath() {
        return await this.root.locator('.breadcrumb-item').allTextContents();
    }
}

// Solution 2: Composed Page
class ComposedPage {
    readonly header: HeaderComponent;
    readonly footer: FooterComponent;
    
    constructor(readonly page: Page) {
        this.header = new HeaderComponent(page.locator('header'));
        this.footer = new FooterComponent(page.locator('footer'));
    }
}

// Solution 3: Page with Sidebar
class PageWithSidebar extends ComposedPage {
    readonly sidebar: SidebarComponent;
    readonly breadcrumb: BreadcrumbComponent;
    
    constructor(page: Page) {
        super(page);
        this.sidebar = new SidebarComponent(page.locator('.sidebar'));
        this.breadcrumb = new BreadcrumbComponent(page.locator('.breadcrumb'));
    }
}

// Solution 4: Dashboard Page (Composed)
class DashboardPage extends PageWithSidebar {
    readonly widgets: Locator;
    readonly notifications: Locator;
    
    constructor(page: Page) {
        super(page);
        this.widgets = page.locator('.dashboard-widget');
        this.notifications = page.locator('.notifications');
    }
    
    async getWidgetCount() {
        return await this.widgets.count();
    }
    
    async clickWidget(title: string) {
        await this.widgets.filter({ hasText: title }).click();
    }
}

// Solution 5: Component Factory
class ComponentFactory {
    constructor(private page: Page) {}
    
    createHeader(selector: string = 'header'): HeaderComponent {
        return new HeaderComponent(this.page.locator(selector));
    }
    
    createFooter(selector: string = 'footer'): FooterComponent {
        return new FooterComponent(this.page.locator(selector));
    }
    
    createSidebar(selector: string = '.sidebar'): SidebarComponent {
        return new SidebarComponent(this.page.locator(selector));
    }
}

// Solution 6: Dynamic Composition
class DynamicPage {
    private components: Map<string, unknown> = new Map();
    private factory: ComponentFactory;
    
    constructor(readonly page: Page) {
        this.factory = new ComponentFactory(page);
    }
    
    withHeader(selector?: string): this {
        this.components.set('header', this.factory.createHeader(selector));
        return this;
    }
    
    withFooter(selector?: string): this {
        this.components.set('footer', this.factory.createFooter(selector));
        return this;
    }
    
    withSidebar(selector?: string): this {
        this.components.set('sidebar', this.factory.createSidebar(selector));
        return this;
    }
    
    get header(): HeaderComponent {
        return this.components.get('header') as HeaderComponent;
    }
    
    get footer(): FooterComponent {
        return this.components.get('footer') as FooterComponent;
    }
    
    get sidebar(): SidebarComponent {
        return this.components.get('sidebar') as SidebarComponent;
    }
}

// Solution 7: Export
export {
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    BreadcrumbComponent,
    ComposedPage,
    PageWithSidebar,
    DashboardPage,
    ComponentFactory,
    DynamicPage,
};

