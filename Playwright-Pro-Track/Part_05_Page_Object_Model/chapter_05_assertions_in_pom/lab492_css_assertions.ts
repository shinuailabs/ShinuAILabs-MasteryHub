/**
 * Lab 492: CSS Assertions
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Implementing CSS assertions in POM:
 * 
 * - toHaveCSS
 * - Style verification
 * - Color assertions
 * - Layout assertions
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Assert CSS properties
 * 2. Verify styles
 * 3. Check layout properties
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { Page, Locator, expect } from '@playwright/test';

// Solution 1: Basic CSS Assertions
class BasicCSSPage {
    readonly page: Page;
    readonly element: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.element = page.locator('.styled-element');
    }
    
    async assertBackgroundColor(color: string) {
        await expect(this.element).toHaveCSS('background-color', color);
    }
    
    async assertColor(color: string) {
        await expect(this.element).toHaveCSS('color', color);
    }
    
    async assertFontSize(size: string) {
        await expect(this.element).toHaveCSS('font-size', size);
    }
}

// Solution 2: Layout CSS Assertions
class LayoutCSSPage {
    readonly page: Page;
    readonly element: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.element = page.locator('.layout-element');
    }
    
    async assertDisplay(display: string) {
        await expect(this.element).toHaveCSS('display', display);
    }
    
    async assertPosition(position: string) {
        await expect(this.element).toHaveCSS('position', position);
    }
    
    async assertWidth(width: string) {
        await expect(this.element).toHaveCSS('width', width);
    }
    
    async assertHeight(height: string) {
        await expect(this.element).toHaveCSS('height', height);
    }
}

// Solution 3: Spacing CSS Assertions
class SpacingCSSPage {
    readonly page: Page;
    readonly element: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.element = page.locator('.spaced-element');
    }
    
    async assertMargin(margin: string) {
        await expect(this.element).toHaveCSS('margin', margin);
    }
    
    async assertPadding(padding: string) {
        await expect(this.element).toHaveCSS('padding', padding);
    }
    
    async assertMarginTop(margin: string) {
        await expect(this.element).toHaveCSS('margin-top', margin);
    }
}

// Solution 4: Typography CSS Assertions
class TypographyCSSPage {
    readonly page: Page;
    readonly text: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.text = page.locator('.text-element');
    }
    
    async assertFontFamily(family: string) {
        await expect(this.text).toHaveCSS('font-family', family);
    }
    
    async assertFontWeight(weight: string) {
        await expect(this.text).toHaveCSS('font-weight', weight);
    }
    
    async assertTextAlign(align: string) {
        await expect(this.text).toHaveCSS('text-align', align);
    }
    
    async assertLineHeight(height: string) {
        await expect(this.text).toHaveCSS('line-height', height);
    }
}

// Solution 5: Border CSS Assertions
class BorderCSSPage {
    readonly page: Page;
    readonly element: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.element = page.locator('.bordered-element');
    }
    
    async assertBorderWidth(width: string) {
        await expect(this.element).toHaveCSS('border-width', width);
    }
    
    async assertBorderColor(color: string) {
        await expect(this.element).toHaveCSS('border-color', color);
    }
    
    async assertBorderRadius(radius: string) {
        await expect(this.element).toHaveCSS('border-radius', radius);
    }
}

// Solution 6: Visibility CSS Assertions
class VisibilityCSSPage {
    readonly page: Page;
    readonly element: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.element = page.locator('.visibility-element');
    }
    
    async assertOpacity(opacity: string) {
        await expect(this.element).toHaveCSS('opacity', opacity);
    }
    
    async assertVisibility(visibility: string) {
        await expect(this.element).toHaveCSS('visibility', visibility);
    }
    
    async assertOverflow(overflow: string) {
        await expect(this.element).toHaveCSS('overflow', overflow);
    }
}

// Solution 7: Multiple CSS Assertions
class MultipleCSSPage {
    readonly page: Page;
    readonly element: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.element = page.locator('.multi-styled');
    }
    
    async assertStyles(styles: Record<string, string>) {
        for (const [property, value] of Object.entries(styles)) {
            await expect(this.element).toHaveCSS(property, value);
        }
    }
}

// Solution 8: Export
export {
    BasicCSSPage,
    LayoutCSSPage,
    SpacingCSSPage,
    TypographyCSSPage,
    BorderCSSPage,
    VisibilityCSSPage,
    MultipleCSSPage,
};

