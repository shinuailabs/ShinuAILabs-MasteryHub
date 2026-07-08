/**
 * Lab 528: Page Factory
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Implementing page factory pattern:
 * 
 * - Factory pattern
 * - Page creation
 * - Lazy initialization
 * - Page caching
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create page factory
 * 2. Implement lazy loading
 * 3. Cache pages
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { Page } from '@playwright/test';

// Solution 1: Page Classes
class LoginPage {
    constructor(readonly page: Page) {}
    
    async login(username: string, password: string) {
        await this.page.fill('#username', username);
        await this.page.fill('#password', password);
        await this.page.click('#submit');
    }
}

class DashboardPage {
    constructor(readonly page: Page) {}
    
    async getWelcomeMessage() {
        return await this.page.locator('.welcome').textContent();
    }
}

class ProfilePage {
    constructor(readonly page: Page) {}
    
    async updateProfile(data: { name: string; email: string }) {
        await this.page.fill('#name', data.name);
        await this.page.fill('#email', data.email);
        await this.page.click('#save');
    }
}

class SettingsPage {
    constructor(readonly page: Page) {}
    
    async toggleDarkMode() {
        await this.page.click('#dark-mode-toggle');
    }
}

// Solution 2: Simple Page Factory
class PageFactory {
    constructor(private page: Page) {}
    
    createLoginPage(): LoginPage {
        return new LoginPage(this.page);
    }
    
    createDashboardPage(): DashboardPage {
        return new DashboardPage(this.page);
    }
    
    createProfilePage(): ProfilePage {
        return new ProfilePage(this.page);
    }
    
    createSettingsPage(): SettingsPage {
        return new SettingsPage(this.page);
    }
}

// Solution 3: Cached Page Factory
class CachedPageFactory {
    private cache: Map<string, unknown> = new Map();
    
    constructor(private page: Page) {}
    
    private getOrCreate<T>(key: string, creator: () => T): T {
        if (!this.cache.has(key)) {
            this.cache.set(key, creator());
        }
        return this.cache.get(key) as T;
    }
    
    get loginPage(): LoginPage {
        return this.getOrCreate('login', () => new LoginPage(this.page));
    }
    
    get dashboardPage(): DashboardPage {
        return this.getOrCreate('dashboard', () => new DashboardPage(this.page));
    }
    
    get profilePage(): ProfilePage {
        return this.getOrCreate('profile', () => new ProfilePage(this.page));
    }
    
    clearCache() {
        this.cache.clear();
    }
}

// Solution 4: Generic Page Factory
type PageConstructor<T> = new (page: Page) => T;

class GenericPageFactory {
    private cache: Map<PageConstructor<unknown>, unknown> = new Map();
    
    constructor(private page: Page) {}
    
    get<T>(PageClass: PageConstructor<T>): T {
        if (!this.cache.has(PageClass)) {
            this.cache.set(PageClass, new PageClass(this.page));
        }
        return this.cache.get(PageClass) as T;
    }
    
    create<T>(PageClass: PageConstructor<T>): T {
        return new PageClass(this.page);
    }
}

// Solution 5: Page Factory with Navigation
class NavigatingPageFactory {
    private factory: GenericPageFactory;
    
    constructor(private page: Page) {
        this.factory = new GenericPageFactory(page);
    }
    
    async goToLogin(): Promise<LoginPage> {
        await this.page.goto('/login');
        return this.factory.get(LoginPage);
    }
    
    async goToDashboard(): Promise<DashboardPage> {
        await this.page.goto('/dashboard');
        return this.factory.get(DashboardPage);
    }
    
    async goToProfile(): Promise<ProfilePage> {
        await this.page.goto('/profile');
        return this.factory.get(ProfilePage);
    }
}

// Solution 6: Page Registry
class PageRegistry {
    private static pages: Map<string, PageConstructor<unknown>> = new Map();
    
    static register<T>(name: string, PageClass: PageConstructor<T>) {
        this.pages.set(name, PageClass);
    }
    
    static get<T>(name: string): PageConstructor<T> | undefined {
        return this.pages.get(name) as PageConstructor<T> | undefined;
    }
    
    static create<T>(name: string, page: Page): T | undefined {
        const PageClass = this.get<T>(name);
        if (PageClass) {
            return new PageClass(page);
        }
        return undefined;
    }
}

// Register pages
PageRegistry.register('login', LoginPage);
PageRegistry.register('dashboard', DashboardPage);
PageRegistry.register('profile', ProfilePage);

// Solution 7: Export
export {
    LoginPage,
    DashboardPage,
    ProfilePage,
    SettingsPage,
    PageFactory,
    CachedPageFactory,
    GenericPageFactory,
    NavigatingPageFactory,
    PageRegistry,
};

