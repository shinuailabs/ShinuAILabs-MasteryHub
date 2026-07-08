/**
 * Lab 473: Frame Locators
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Working with frames in POM:
 * 
 * - frameLocator method
 * - Nested frames
 * - Frame navigation
 * - Frame content access
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Access frame content
 * 2. Work with nested frames
 * 3. Interact with frame elements
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { Page, Locator, FrameLocator } from '@playwright/test';

// Solution 1: Basic Frame Access
class BasicFramePage {
    readonly page: Page;
    readonly iframe: FrameLocator;
    
    constructor(page: Page) {
        this.page = page;
        this.iframe = page.frameLocator('iframe');
    }
    
    // Get element inside frame
    get frameHeading() {
        return this.iframe.locator('h1');
    }
    
    get frameButton() {
        return this.iframe.locator('button');
    }
    
    async clickFrameButton() {
        await this.frameButton.click();
    }
}

// Solution 2: Named Frame Access
class NamedFramePage {
    readonly page: Page;
    readonly contentFrame: FrameLocator;
    readonly adFrame: FrameLocator;
    
    constructor(page: Page) {
        this.page = page;
        this.contentFrame = page.frameLocator('iframe[name="content"]');
        this.adFrame = page.frameLocator('iframe[name="advertisement"]');
    }
    
    get contentHeading() {
        return this.contentFrame.locator('h1');
    }
    
    get adBanner() {
        return this.adFrame.locator('.banner');
    }
}

// Solution 3: Frame by ID
class FrameByIdPage {
    readonly page: Page;
    readonly editorFrame: FrameLocator;
    readonly previewFrame: FrameLocator;
    
    constructor(page: Page) {
        this.page = page;
        this.editorFrame = page.frameLocator('#editor-frame');
        this.previewFrame = page.frameLocator('#preview-frame');
    }
    
    get editorContent() {
        return this.editorFrame.locator('.editor-content');
    }
    
    get previewContent() {
        return this.previewFrame.locator('.preview-content');
    }
}

// Solution 4: Nested Frames
class NestedFramesPage {
    readonly page: Page;
    readonly outerFrame: FrameLocator;
    
    constructor(page: Page) {
        this.page = page;
        this.outerFrame = page.frameLocator('#outer-frame');
    }
    
    get innerFrame() {
        return this.outerFrame.frameLocator('#inner-frame');
    }
    
    get deepContent() {
        return this.innerFrame.locator('.content');
    }
    
    async getDeepContentText() {
        return await this.deepContent.textContent();
    }
}

// Solution 5: Multiple Frames
class MultipleFramesPage {
    readonly page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }
    
    // Get frame by index
    getFrameByIndex(index: number) {
        return this.page.frameLocator('iframe').nth(index);
    }
    
    // Get first frame
    get firstFrame() {
        return this.page.frameLocator('iframe').first();
    }
    
    // Get last frame
    get lastFrame() {
        return this.page.frameLocator('iframe').last();
    }
}

// Solution 6: Frame with Form
class FrameFormPage {
    readonly page: Page;
    readonly formFrame: FrameLocator;
    
    constructor(page: Page) {
        this.page = page;
        this.formFrame = page.frameLocator('#form-frame');
    }
    
    get nameInput() {
        return this.formFrame.locator('#name');
    }
    
    get emailInput() {
        return this.formFrame.locator('#email');
    }
    
    get submitButton() {
        return this.formFrame.locator('button[type="submit"]');
    }
    
    async fillForm(name: string, email: string) {
        await this.nameInput.fill(name);
        await this.emailInput.fill(email);
    }
    
    async submitForm() {
        await this.submitButton.click();
    }
}

// Solution 7: Dynamic Frame Locator
class DynamicFramePage {
    readonly page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }
    
    getFrameByName(name: string) {
        return this.page.frameLocator(`iframe[name="${name}"]`);
    }
    
    getFrameById(id: string) {
        return this.page.frameLocator(`#${id}`);
    }
    
    getFrameBySrc(srcPattern: string) {
        return this.page.frameLocator(`iframe[src*="${srcPattern}"]`);
    }
}

// Solution 8: Export
export {
    BasicFramePage,
    NamedFramePage,
    FrameByIdPage,
    NestedFramesPage,
    MultipleFramesPage,
    FrameFormPage,
    DynamicFramePage,
};

