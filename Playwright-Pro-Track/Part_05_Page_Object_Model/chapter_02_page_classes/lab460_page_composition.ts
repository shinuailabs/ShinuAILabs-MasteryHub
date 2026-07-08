/**
 * Lab 460: Page Composition
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Using composition in page objects:
 * 
 * - Combining components
 * - Reusable parts
 * - Flexible structure
 * - Avoiding deep inheritance
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create component classes
 * 2. Compose pages from components
 * 3. Reuse components across pages
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { Page, Locator } from '@playwright/test';

// Solution 1: Header Component
class HeaderComponent {
    readonly page: Page;
    readonly logo: Locator;
    readonly navLinks: Locator;
    readonly searchInput: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.logo = page.locator('header .logo');
        this.navLinks = page.locator('header nav a');
        this.searchInput = page.locator('header #search');
    }
    
    async clickLogo() {
        await this.logo.click();
    }
    
    async search(query: string) {
        await this.searchInput.fill(query);
        await this.searchInput.press('Enter');
    }
}

// Solution 2: Footer Component
class FooterComponent {
    readonly page: Page;
    readonly links: Locator;
    readonly copyright: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.links = page.locator('footer a');
        this.copyright = page.locator('footer .copyright');
    }
    
    async getCopyrightText() {
        return await this.copyright.textContent();
    }
}

// Solution 3: Sidebar Component
class SidebarComponent {
    readonly page: Page;
    readonly menuItems: Locator;
    readonly toggleButton: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.menuItems = page.locator('.sidebar .menu-item');
        this.toggleButton = page.locator('.sidebar-toggle');
    }
    
    async clickMenuItem(text: string) {
        await this.menuItems.filter({ hasText: text }).click();
    }
    
    async toggle() {
        await this.toggleButton.click();
    }
}

// Solution 4: Page Composed of Components
class DashboardPage {
    readonly page: Page;
    readonly header: HeaderComponent;
    readonly footer: FooterComponent;
    readonly sidebar: SidebarComponent;
    readonly mainContent: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.header = new HeaderComponent(page);
        this.footer = new FooterComponent(page);
        this.sidebar = new SidebarComponent(page);
        this.mainContent = page.locator('.main-content');
    }
    
    async navigate() {
        await this.page.goto('/dashboard');
    }
}

// Solution 5: Another Page Using Same Components
class SettingsPage {
    readonly page: Page;
    readonly header: HeaderComponent;
    readonly footer: FooterComponent;
    readonly sidebar: SidebarComponent;
    readonly settingsForm: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.header = new HeaderComponent(page);
        this.footer = new FooterComponent(page);
        this.sidebar = new SidebarComponent(page);
        this.settingsForm = page.locator('.settings-form');
    }
    
    async navigate() {
        await this.page.goto('/settings');
    }
}

// Solution 6: Form Component
class FormComponent {
    readonly page: Page;
    readonly form: Locator;
    
    constructor(page: Page, formSelector: string) {
        this.page = page;
        this.form = page.locator(formSelector);
    }
    
    async fillField(name: string, value: string) {
        await this.form.locator(`[name="${name}"]`).fill(value);
    }
    
    async submit() {
        await this.form.locator('button[type="submit"]').click();
    }
}

// Solution 7: Page with Multiple Forms
class RegistrationPage {
    readonly page: Page;
    readonly personalInfoForm: FormComponent;
    readonly addressForm: FormComponent;
    readonly paymentForm: FormComponent;
    
    constructor(page: Page) {
        this.page = page;
        this.personalInfoForm = new FormComponent(page, '#personal-info');
        this.addressForm = new FormComponent(page, '#address');
        this.paymentForm = new FormComponent(page, '#payment');
    }
}

// Solution 8: Modal Component
class ModalComponent {
    readonly page: Page;
    readonly modal: Locator;
    readonly closeButton: Locator;
    readonly title: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.modal = page.locator('.modal');
        this.closeButton = page.locator('.modal .close');
        this.title = page.locator('.modal .title');
    }
    
    async close() {
        await this.closeButton.click();
    }
    
    async isVisible() {
        return await this.modal.isVisible();
    }
}

// Solution 9: Page with Modal
class ProductPage {
    readonly page: Page;
    readonly header: HeaderComponent;
    readonly confirmModal: ModalComponent;
    readonly addToCartButton: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.header = new HeaderComponent(page);
        this.confirmModal = new ModalComponent(page);
        this.addToCartButton = page.locator('#add-to-cart');
    }
    
    async addToCart() {
        await this.addToCartButton.click();
    }
}

// Solution 10: Export
export {
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    DashboardPage,
    SettingsPage,
    FormComponent,
    RegistrationPage,
    ModalComponent,
    ProductPage,
};

