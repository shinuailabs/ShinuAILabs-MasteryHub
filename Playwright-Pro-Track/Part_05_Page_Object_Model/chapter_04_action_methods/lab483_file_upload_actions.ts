/**
 * Lab 483: File Upload Actions
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Implementing file upload in POM:
 * 
 * - setInputFiles method
 * - Multiple files
 * - File chooser
 * - Drag and drop upload
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Implement file upload
 * 2. Handle multiple files
 * 3. Work with file chooser
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { Page, Locator } from '@playwright/test';

// Solution 1: Basic File Upload
class BasicFileUploadPage {
    readonly page: Page;
    readonly fileInput: Locator;
    readonly uploadButton: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.fileInput = page.locator('input[type="file"]');
        this.uploadButton = page.locator('#upload-btn');
    }
    
    async uploadFile(filePath: string) {
        await this.fileInput.setInputFiles(filePath);
    }
    
    async uploadAndSubmit(filePath: string) {
        await this.uploadFile(filePath);
        await this.uploadButton.click();
    }
}

// Solution 2: Multiple File Upload
class MultipleFileUploadPage {
    readonly page: Page;
    readonly fileInput: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.fileInput = page.locator('input[type="file"][multiple]');
    }
    
    async uploadMultipleFiles(filePaths: string[]) {
        await this.fileInput.setInputFiles(filePaths);
    }
    
    async clearFiles() {
        await this.fileInput.setInputFiles([]);
    }
}

// Solution 3: File Chooser Dialog
class FileChooserPage {
    readonly page: Page;
    readonly uploadButton: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.uploadButton = page.locator('#upload-trigger');
    }
    
    async uploadViaDialog(filePath: string) {
        const fileChooserPromise = this.page.waitForEvent('filechooser');
        await this.uploadButton.click();
        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles(filePath);
    }
    
    async uploadMultipleViaDialog(filePaths: string[]) {
        const fileChooserPromise = this.page.waitForEvent('filechooser');
        await this.uploadButton.click();
        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles(filePaths);
    }
}

// Solution 4: Drag and Drop Upload
class DragDropUploadPage {
    readonly page: Page;
    readonly dropzone: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.dropzone = page.locator('.dropzone');
    }
    
    async dropFile(filePath: string) {
        // Create a DataTransfer-like event
        const dataTransfer = await this.page.evaluateHandle(() => new DataTransfer());
        
        // Dispatch drop event
        await this.dropzone.dispatchEvent('drop', { dataTransfer });
    }
}

// Solution 5: Upload with Validation
class ValidatedUploadPage {
    readonly page: Page;
    readonly fileInput: Locator;
    readonly errorMessage: Locator;
    readonly successMessage: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.fileInput = page.locator('input[type="file"]');
        this.errorMessage = page.locator('.upload-error');
        this.successMessage = page.locator('.upload-success');
    }
    
    async uploadFile(filePath: string) {
        await this.fileInput.setInputFiles(filePath);
    }
    
    async isUploadSuccessful() {
        return await this.successMessage.isVisible();
    }
    
    async getErrorMessage() {
        if (await this.errorMessage.isVisible()) {
            return await this.errorMessage.textContent();
        }
        return null;
    }
}

// Solution 6: Image Upload Preview
class ImageUploadPage {
    readonly page: Page;
    readonly imageInput: Locator;
    readonly preview: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.imageInput = page.locator('input[type="file"][accept="image/*"]');
        this.preview = page.locator('.image-preview img');
    }
    
    async uploadImage(imagePath: string) {
        await this.imageInput.setInputFiles(imagePath);
    }
    
    async waitForPreview() {
        await this.preview.waitFor({ state: 'visible' });
    }
    
    async getPreviewSrc() {
        return await this.preview.getAttribute('src');
    }
}

// Solution 7: Buffer Upload
class BufferUploadPage {
    readonly page: Page;
    readonly fileInput: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.fileInput = page.locator('input[type="file"]');
    }
    
    async uploadFromBuffer(name: string, mimeType: string, buffer: Buffer) {
        await this.fileInput.setInputFiles({
            name,
            mimeType,
            buffer,
        });
    }
}

// Solution 8: Export
export {
    BasicFileUploadPage,
    MultipleFileUploadPage,
    FileChooserPage,
    DragDropUploadPage,
    ValidatedUploadPage,
    ImageUploadPage,
    BufferUploadPage,
};

