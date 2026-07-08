/**
 * Lab 499: Footer Component
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Creating a footer component:
 * 
 * - Footer links
 * - Social media
 * - Copyright
 * - Newsletter
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create footer component
 * 2. Handle footer links
 * 3. Implement newsletter signup
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { Locator } from '@playwright/test';

// Solution 1: Basic Footer Component
class FooterComponent {
    readonly root: Locator;
    readonly links: Locator;
    readonly copyright: Locator;
    
    constructor(root: Locator) {
        this.root = root;
        this.links = root.locator('a');
        this.copyright = root.locator('.copyright');
    }
    
    async clickLink(text: string) {
        await this.links.filter({ hasText: text }).click();
    }
    
    async getCopyrightText() {
        return await this.copyright.textContent();
    }
    
    async getAllLinks() {
        return await this.links.allTextContents();
    }
}

// Solution 2: Footer with Sections
class SectionedFooterComponent {
    readonly root: Locator;
    readonly aboutSection: Locator;
    readonly supportSection: Locator;
    readonly legalSection: Locator;
    
    constructor(root: Locator) {
        this.root = root;
        this.aboutSection = root.locator('.footer-about');
        this.supportSection = root.locator('.footer-support');
        this.legalSection = root.locator('.footer-legal');
    }
    
    async clickAboutLink(text: string) {
        await this.aboutSection.locator(`text=${text}`).click();
    }
    
    async clickSupportLink(text: string) {
        await this.supportSection.locator(`text=${text}`).click();
    }
    
    async clickLegalLink(text: string) {
        await this.legalSection.locator(`text=${text}`).click();
    }
}

// Solution 3: Footer with Social Media
class SocialFooterComponent {
    readonly root: Locator;
    readonly socialLinks: Locator;
    
    constructor(root: Locator) {
        this.root = root;
        this.socialLinks = root.locator('.social-links a');
    }
    
    async clickFacebook() {
        await this.socialLinks.filter({ has: root.page().locator('[aria-label="Facebook"]') }).click();
    }
    
    async clickTwitter() {
        await this.socialLinks.filter({ has: root.page().locator('[aria-label="Twitter"]') }).click();
    }
    
    async clickLinkedIn() {
        await this.socialLinks.filter({ has: root.page().locator('[aria-label="LinkedIn"]') }).click();
    }
    
    async getSocialLinkCount() {
        return await this.socialLinks.count();
    }
}

// Solution 4: Footer with Newsletter
class NewsletterFooterComponent {
    readonly root: Locator;
    readonly emailInput: Locator;
    readonly subscribeButton: Locator;
    readonly successMessage: Locator;
    readonly errorMessage: Locator;
    
    constructor(root: Locator) {
        this.root = root;
        this.emailInput = root.locator('.newsletter-email');
        this.subscribeButton = root.locator('.newsletter-subscribe');
        this.successMessage = root.locator('.newsletter-success');
        this.errorMessage = root.locator('.newsletter-error');
    }
    
    async subscribe(email: string) {
        await this.emailInput.fill(email);
        await this.subscribeButton.click();
    }
    
    async isSubscriptionSuccessful() {
        return await this.successMessage.isVisible();
    }
    
    async getErrorMessage() {
        return await this.errorMessage.textContent();
    }
}

// Solution 5: Complete Footer
class CompleteFooterComponent {
    readonly root: Locator;
    readonly sections: Locator;
    readonly socialLinks: Locator;
    readonly newsletter: Locator;
    readonly copyright: Locator;
    readonly bottomLinks: Locator;
    
    constructor(root: Locator) {
        this.root = root;
        this.sections = root.locator('.footer-section');
        this.socialLinks = root.locator('.social-links');
        this.newsletter = root.locator('.newsletter');
        this.copyright = root.locator('.copyright');
        this.bottomLinks = root.locator('.bottom-links a');
    }
    
    async getSectionCount() {
        return await this.sections.count();
    }
    
    async clickBottomLink(text: string) {
        await this.bottomLinks.filter({ hasText: text }).click();
    }
}

// Solution 6: Export
export {
    FooterComponent,
    SectionedFooterComponent,
    SocialFooterComponent,
    NewsletterFooterComponent,
    CompleteFooterComponent,
};

