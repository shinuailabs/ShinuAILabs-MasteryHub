/**
 * Lab 543: Scalability
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Scaling POM for large projects:
 * 
 * - Modular architecture
 * - Plugin system
 * - Configuration management
 * - Team collaboration
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Design modular architecture
 * 2. Create plugin system
 * 3. Manage configuration
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { Page, Locator } from '@playwright/test';

// Solution 1: Module Interface
interface PageModule {
    name: string;
    initialize(page: Page): void;
}

// Solution 2: Plugin System
interface Plugin {
    name: string;
    beforeAction?(action: string): Promise<void>;
    afterAction?(action: string): Promise<void>;
}

class PluginManager {
    private plugins: Plugin[] = [];
    
    register(plugin: Plugin) {
        this.plugins.push(plugin);
    }
    
    async executeBeforeHooks(action: string) {
        for (const plugin of this.plugins) {
            await plugin.beforeAction?.(action);
        }
    }
    
    async executeAfterHooks(action: string) {
        for (const plugin of this.plugins) {
            await plugin.afterAction?.(action);
        }
    }
}

// Solution 3: Logging Plugin
class LoggingPlugin implements Plugin {
    name = 'logging';
    
    async beforeAction(action: string) {
        console.log(`[START] ${action}`);
    }
    
    async afterAction(action: string) {
        console.log(`[END] ${action}`);
    }
}

// Solution 4: Scalable Base Page
class ScalablePage {
    protected plugins: PluginManager;
    
    constructor(readonly page: Page) {
        this.plugins = new PluginManager();
    }
    
    usePlugin(plugin: Plugin): this {
        this.plugins.register(plugin);
        return this;
    }
    
    protected async executeAction(name: string, action: () => Promise<void>) {
        await this.plugins.executeBeforeHooks(name);
        await action();
        await this.plugins.executeAfterHooks(name);
    }
    
    async click(selector: string) {
        await this.executeAction(`click:${selector}`, async () => {
            await this.page.click(selector);
        });
    }
}

// Solution 5: Configuration Management
interface PageConfig {
    baseUrl: string;
    timeout: number;
    retries: number;
    selectors: Record<string, string>;
}

class ConfigurablePage {
    private config: PageConfig;
    
    constructor(readonly page: Page, config: Partial<PageConfig> = {}) {
        this.config = {
            baseUrl: config.baseUrl || '',
            timeout: config.timeout || 30000,
            retries: config.retries || 3,
            selectors: config.selectors || {},
        };
    }
    
    getSelector(name: string): string {
        return this.config.selectors[name] || name;
    }
    
    async goto(path: string) {
        await this.page.goto(`${this.config.baseUrl}${path}`);
    }
}

// Solution 6: Feature Modules
class AuthModule implements PageModule {
    name = 'auth';
    private page!: Page;
    
    initialize(page: Page) {
        this.page = page;
    }
    
    async login(username: string, password: string) {
        await this.page.fill('#username', username);
        await this.page.fill('#password', password);
        await this.page.click('#submit');
    }
    
    async logout() {
        await this.page.click('#logout');
    }
}

class CartModule implements PageModule {
    name = 'cart';
    private page!: Page;
    
    initialize(page: Page) {
        this.page = page;
    }
    
    async addItem(productId: string) {
        await this.page.click(`[data-product="${productId}"] .add-to-cart`);
    }
    
    async getItemCount(): Promise<number> {
        return await this.page.locator('.cart-item').count();
    }
}

// Solution 7: Modular Page
class ModularPage {
    private modules: Map<string, PageModule> = new Map();
    
    constructor(readonly page: Page) {}
    
    use<T extends PageModule>(module: T): T {
        module.initialize(this.page);
        this.modules.set(module.name, module);
        return module;
    }
    
    getModule<T extends PageModule>(name: string): T | undefined {
        return this.modules.get(name) as T | undefined;
    }
}

// Solution 8: Scalability Guidelines
/*
 * Scalability Best Practices:
 * 
 * 1. Use modular architecture
 * 2. Implement plugin system for extensibility
 * 3. Centralize configuration
 * 4. Create feature-based modules
 * 5. Use dependency injection
 * 6. Document public APIs
 * 7. Version your page objects
 * 8. Create shared component library
 */

// Solution 9: Export
export {
    PageModule,
    Plugin,
    PluginManager,
    LoggingPlugin,
    ScalablePage,
    ConfigurablePage,
    PageConfig,
    AuthModule,
    CartModule,
    ModularPage,
};

