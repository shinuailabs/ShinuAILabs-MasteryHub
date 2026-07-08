/**
 * Lab 421: ARIA Testing
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Testing ARIA implementation:
 * 
 * - ARIA roles
 * - ARIA states
 * - ARIA properties
 * - ARIA patterns
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Validate ARIA roles
 * 2. Check ARIA states
 * 3. Test ARIA patterns
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Check ARIA Roles
test('check ARIA roles', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const roles = await page.evaluate(() => {
        const elementsWithRole = document.querySelectorAll('[role]');
        const roleCount: Record<string, number> = {};
        
        elementsWithRole.forEach(el => {
            const role = el.getAttribute('role') || '';
            roleCount[role] = (roleCount[role] || 0) + 1;
        });
        
        return roleCount;
    });
    
    console.log('ARIA roles:', roles);
});

// Solution 2: Check ARIA States
test('check ARIA states', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const states = await page.evaluate(() => {
        return {
            expanded: document.querySelectorAll('[aria-expanded]').length,
            selected: document.querySelectorAll('[aria-selected]').length,
            checked: document.querySelectorAll('[aria-checked]').length,
            pressed: document.querySelectorAll('[aria-pressed]').length,
            hidden: document.querySelectorAll('[aria-hidden]').length,
            disabled: document.querySelectorAll('[aria-disabled]').length,
        };
    });
    
    console.log('ARIA states:', states);
});

// Solution 3: Check ARIA Properties
test('check ARIA properties', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const properties = await page.evaluate(() => {
        return {
            label: document.querySelectorAll('[aria-label]').length,
            labelledby: document.querySelectorAll('[aria-labelledby]').length,
            describedby: document.querySelectorAll('[aria-describedby]').length,
            controls: document.querySelectorAll('[aria-controls]').length,
            owns: document.querySelectorAll('[aria-owns]').length,
            live: document.querySelectorAll('[aria-live]').length,
        };
    });
    
    console.log('ARIA properties:', properties);
});

// Solution 4: Validate ARIA References
test('validate ARIA references', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const invalidRefs = await page.evaluate(() => {
        const issues: string[] = [];
        
        // Check aria-labelledby references
        document.querySelectorAll('[aria-labelledby]').forEach(el => {
            const ids = el.getAttribute('aria-labelledby')?.split(' ') || [];
            ids.forEach(id => {
                if (!document.getElementById(id)) {
                    issues.push(`aria-labelledby references missing id: ${id}`);
                }
            });
        });
        
        // Check aria-describedby references
        document.querySelectorAll('[aria-describedby]').forEach(el => {
            const ids = el.getAttribute('aria-describedby')?.split(' ') || [];
            ids.forEach(id => {
                if (!document.getElementById(id)) {
                    issues.push(`aria-describedby references missing id: ${id}`);
                }
            });
        });
        
        return issues;
    });
    
    console.log('Invalid ARIA references:', invalidRefs);
    expect(invalidRefs.length).toBe(0);
});

// Solution 5: Check Button ARIA
test('check button ARIA', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const buttons = await page.evaluate(() => {
        const btns = document.querySelectorAll('button, [role="button"]');
        return Array.from(btns).map(btn => ({
            hasAccessibleName: !!(btn.textContent?.trim() || btn.getAttribute('aria-label')),
            ariaPressed: btn.getAttribute('aria-pressed'),
            ariaExpanded: btn.getAttribute('aria-expanded'),
            ariaDisabled: btn.getAttribute('aria-disabled'),
        }));
    });
    
    console.log('Buttons:', buttons.slice(0, 5));
});

// Solution 6: Check Menu ARIA
test('check menu ARIA', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const menus = await page.evaluate(() => {
        const menuElements = document.querySelectorAll('[role="menu"], [role="menubar"]');
        return Array.from(menuElements).map(menu => ({
            role: menu.getAttribute('role'),
            itemCount: menu.querySelectorAll('[role="menuitem"]').length,
            hasAriaLabel: !!menu.getAttribute('aria-label'),
        }));
    });
    
    console.log('Menus:', menus);
});

// Solution 7: Check Tab ARIA
test('check tab ARIA', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const tabs = await page.evaluate(() => {
        const tablist = document.querySelectorAll('[role="tablist"]');
        const tabElements = document.querySelectorAll('[role="tab"]');
        const tabpanels = document.querySelectorAll('[role="tabpanel"]');
        
        return {
            tablists: tablist.length,
            tabs: tabElements.length,
            tabpanels: tabpanels.length,
            tabDetails: Array.from(tabElements).map(tab => ({
                selected: tab.getAttribute('aria-selected'),
                controls: tab.getAttribute('aria-controls'),
            })),
        };
    });
    
    console.log('Tabs:', tabs);
});

// Solution 8: Check Dialog ARIA
test('check dialog ARIA', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const dialogs = await page.evaluate(() => {
        const dialogElements = document.querySelectorAll('[role="dialog"], [role="alertdialog"]');
        return Array.from(dialogElements).map(dialog => ({
            role: dialog.getAttribute('role'),
            ariaModal: dialog.getAttribute('aria-modal'),
            ariaLabel: dialog.getAttribute('aria-label'),
            ariaLabelledby: dialog.getAttribute('aria-labelledby'),
        }));
    });
    
    console.log('Dialogs:', dialogs);
});

// Solution 9: Check Live Regions
test('check live regions', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const liveRegions = await page.evaluate(() => {
        const regions = document.querySelectorAll('[aria-live], [role="alert"], [role="status"]');
        return Array.from(regions).map(region => ({
            role: region.getAttribute('role'),
            ariaLive: region.getAttribute('aria-live'),
            ariaAtomic: region.getAttribute('aria-atomic'),
            ariaRelevant: region.getAttribute('aria-relevant'),
        }));
    });
    
    console.log('Live regions:', liveRegions);
});

// Solution 10: ARIA Testing Best Practices
test('ARIA testing best practices', async ({ page }) => {
    /*
     * ARIA Best Practices:
     * 1. Use native HTML when possible
     * 2. Don't change native semantics
     * 3. All ARIA controls must be keyboard accessible
     * 4. Don't use role="presentation" on focusable elements
     * 5. All interactive elements must have accessible names
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

