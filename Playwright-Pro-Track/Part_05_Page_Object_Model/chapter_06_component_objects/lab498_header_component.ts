/**
 * Lab 498: Header Component
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Creating a header component:
 * 
 * - Navigation elements
 * - Logo
 * - Search
 * - User menu
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create header component
 * 2. Handle navigation
 * 3. Implement search
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { Locator } from '@playwright/test';

// Solution 1: Basic Header Component
class HeaderComponent {
    readonly root: Locator;
    readonly logo: Locator;
    readonly navigation: Locator;
    readonly searchInput: Locator;
    readonly searchButton: Locator;
    
    constructor(root: Locator) {
        this.root = root;
        this.logo = root.locator('.logo');
        this.navigation = root.locator('nav');
        this.searchInput = root.locator('input[type="search"]');
        this.searchButton = root.locator('.search-btn');
    }
    
    async clickLogo() {
        await this.logo.click();
    }
    
    async search(query: string) {
        await this.searchInput.fill(query);
        await this.searchButton.click();
    }
    
    async navigateTo(linkText: string) {
        await this.navigation.locator(`text=${linkText}`).click();
    }
}

// Solution 2: Header with User Menu
class HeaderWithUserMenuComponent {
    readonly root: Locator;
    readonly userMenuTrigger: Locator;
    readonly userMenu: Locator;
    readonly userName: Locator;
    
    constructor(root: Locator) {
        this.root = root;
        this.userMenuTrigger = root.locator('.user-menu-trigger');
        this.userMenu = root.locator('.user-menu');
        this.userName = root.locator('.user-name');
    }
    
    async openUserMenu() {
        await this.userMenuTrigger.click();
        await this.userMenu.waitFor({ state: 'visible' });
    }
    
    async selectUserMenuItem(item: string) {
        await this.openUserMenu();
        await this.userMenu.locator(`text=${item}`).click();
    }
    
    async getUserName() {
        return await this.userName.textContent();
    }
    
    async logout() {
        await this.selectUserMenuItem('Logout');
    }
}

// Solution 3: Header with Cart
class HeaderWithCartComponent {
    readonly root: Locator;
    readonly cartIcon: Locator;
    readonly cartCount: Locator;
    readonly cartDropdown: Locator;
    
    constructor(root: Locator) {
        this.root = root;
        this.cartIcon = root.locator('.cart-icon');
        this.cartCount = root.locator('.cart-count');
        this.cartDropdown = root.locator('.cart-dropdown');
    }
    
    async getCartCount() {
        const text = await this.cartCount.textContent();
        return parseInt(text || '0');
    }
    
    async openCartDropdown() {
        await this.cartIcon.hover();
        await this.cartDropdown.waitFor({ state: 'visible' });
    }
    
    async goToCart() {
        await this.cartIcon.click();
    }
}

// Solution 4: Responsive Header
class ResponsiveHeaderComponent {
    readonly root: Locator;
    readonly mobileMenuButton: Locator;
    readonly mobileMenu: Locator;
    readonly desktopNav: Locator;
    
    constructor(root: Locator) {
        this.root = root;
        this.mobileMenuButton = root.locator('.mobile-menu-btn');
        this.mobileMenu = root.locator('.mobile-menu');
        this.desktopNav = root.locator('.desktop-nav');
    }
    
    async openMobileMenu() {
        await this.mobileMenuButton.click();
        await this.mobileMenu.waitFor({ state: 'visible' });
    }
    
    async closeMobileMenu() {
        await this.mobileMenuButton.click();
        await this.mobileMenu.waitFor({ state: 'hidden' });
    }
    
    async isMobileMenuVisible() {
        return await this.mobileMenu.isVisible();
    }
}

// Solution 5: Complete Header
class CompleteHeaderComponent {
    readonly root: Locator;
    readonly logo: Locator;
    readonly nav: Locator;
    readonly search: Locator;
    readonly userMenu: Locator;
    readonly cart: Locator;
    
    constructor(root: Locator) {
        this.root = root;
        this.logo = root.locator('.logo');
        this.nav = root.locator('nav');
        this.search = root.locator('.search');
        this.userMenu = root.locator('.user-menu');
        this.cart = root.locator('.cart');
    }
}

// Solution 6: Export
export {
    HeaderComponent,
    HeaderWithUserMenuComponent,
    HeaderWithCartComponent,
    ResponsiveHeaderComponent,
    CompleteHeaderComponent,
};

