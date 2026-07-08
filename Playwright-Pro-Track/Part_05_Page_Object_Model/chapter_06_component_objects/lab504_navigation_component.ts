/**
 * Lab 504: Navigation Component
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Creating navigation components:
 * 
 * - Menu navigation
 * - Breadcrumbs
 * - Tabs
 * - Sidebar
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create navigation component
 * 2. Handle menu items
 * 3. Implement breadcrumbs
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { Locator } from '@playwright/test';

// Solution 1: Menu Navigation Component
class MenuNavigationComponent {
    readonly root: Locator;
    readonly menuItems: Locator;
    readonly activeItem: Locator;
    
    constructor(root: Locator) {
        this.root = root;
        this.menuItems = root.locator('.menu-item');
        this.activeItem = root.locator('.menu-item.active');
    }
    
    async navigateTo(itemText: string) {
        await this.menuItems.filter({ hasText: itemText }).click();
    }
    
    async getActiveItemText() {
        return await this.activeItem.textContent();
    }
    
    async getAllMenuItems() {
        return await this.menuItems.allTextContents();
    }
    
    async isItemActive(itemText: string) {
        const item = this.menuItems.filter({ hasText: itemText });
        const classes = await item.getAttribute('class');
        return classes?.includes('active') || false;
    }
}

// Solution 2: Breadcrumb Component
class BreadcrumbComponent {
    readonly root: Locator;
    readonly items: Locator;
    readonly separator: Locator;
    
    constructor(root: Locator) {
        this.root = root;
        this.items = root.locator('.breadcrumb-item');
        this.separator = root.locator('.breadcrumb-separator');
    }
    
    async clickItem(text: string) {
        await this.items.filter({ hasText: text }).click();
    }
    
    async clickItemByIndex(index: number) {
        await this.items.nth(index).click();
    }
    
    async getCurrentPage() {
        return await this.items.last().textContent();
    }
    
    async getBreadcrumbPath() {
        return await this.items.allTextContents();
    }
    
    async getLevel() {
        return await this.items.count();
    }
}

// Solution 3: Tab Navigation Component
class TabNavigationComponent {
    readonly root: Locator;
    readonly tabs: Locator;
    readonly activeTab: Locator;
    readonly tabPanels: Locator;
    
    constructor(root: Locator) {
        this.root = root;
        this.tabs = root.locator('[role="tab"]');
        this.activeTab = root.locator('[role="tab"][aria-selected="true"]');
        this.tabPanels = root.locator('[role="tabpanel"]');
    }
    
    async selectTab(tabName: string) {
        await this.tabs.filter({ hasText: tabName }).click();
    }
    
    async selectTabByIndex(index: number) {
        await this.tabs.nth(index).click();
    }
    
    async getActiveTabName() {
        return await this.activeTab.textContent();
    }
    
    async getActiveTabContent() {
        return await this.tabPanels.filter({ has: root.page().locator(':visible') }).textContent();
    }
    
    async getTabCount() {
        return await this.tabs.count();
    }
}

// Solution 4: Sidebar Navigation Component
class SidebarNavigationComponent {
    readonly root: Locator;
    readonly menuItems: Locator;
    readonly subMenus: Locator;
    readonly collapseButton: Locator;
    
    constructor(root: Locator) {
        this.root = root;
        this.menuItems = root.locator('.sidebar-item');
        this.subMenus = root.locator('.sidebar-submenu');
        this.collapseButton = root.locator('.sidebar-collapse');
    }
    
    async navigateTo(itemText: string) {
        await this.menuItems.filter({ hasText: itemText }).click();
    }
    
    async expandSubmenu(parentText: string) {
        await this.menuItems.filter({ hasText: parentText }).click();
    }
    
    async navigateToSubmenuItem(parentText: string, childText: string) {
        await this.expandSubmenu(parentText);
        await this.subMenus.locator(`text=${childText}`).click();
    }
    
    async collapse() {
        await this.collapseButton.click();
    }
    
    async isCollapsed() {
        const classes = await this.root.getAttribute('class');
        return classes?.includes('collapsed') || false;
    }
}

// Solution 5: Pagination Navigation Component
class PaginationNavigationComponent {
    readonly root: Locator;
    readonly prevButton: Locator;
    readonly nextButton: Locator;
    readonly pageButtons: Locator;
    readonly currentPage: Locator;
    
    constructor(root: Locator) {
        this.root = root;
        this.prevButton = root.locator('.prev');
        this.nextButton = root.locator('.next');
        this.pageButtons = root.locator('.page-btn');
        this.currentPage = root.locator('.page-btn.active');
    }
    
    async goToPage(page: number) {
        await this.pageButtons.filter({ hasText: String(page) }).click();
    }
    
    async goToNext() {
        await this.nextButton.click();
    }
    
    async goToPrev() {
        await this.prevButton.click();
    }
    
    async getCurrentPageNumber() {
        const text = await this.currentPage.textContent();
        return parseInt(text || '1');
    }
}

// Solution 6: Export
export {
    MenuNavigationComponent,
    BreadcrumbComponent,
    TabNavigationComponent,
    SidebarNavigationComponent,
    PaginationNavigationComponent,
};

