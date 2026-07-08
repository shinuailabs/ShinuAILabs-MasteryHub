/**
 * Lab 568: Doc String Steps
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Handling doc strings in steps:
 * 
 * - Multi-line text
 * - JSON parsing
 * - Content types
 * - Formatting
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Handle doc strings
 * 2. Parse JSON content
 * 3. Process formatted text
 *
 * =====================
 * SOLUTION:
 * =====================
 */

import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

// Solution 1: Basic Doc String
When('I enter the following description:', async function (docString: string) {
    await this.page.fill('#description', docString);
});

// Solution 2: Doc String for Text Area
When('I write the following article:', async function (docString: string) {
    await this.page.fill('textarea#article-content', docString);
    this.articleContent = docString;
});

Then('the article should contain:', async function (docString: string) {
    const content = await this.page.locator('.article-body').textContent();
    expect(content).toContain(docString.trim());
});

// Solution 3: JSON Doc String
When('I send a POST request with body:', async function (docString: string) {
    const body = JSON.parse(docString);
    
    this.response = await this.page.request.post('/api/data', {
        data: body,
        headers: {
            'Content-Type': 'application/json',
        },
    });
});

Then('the response body should be:', async function (docString: string) {
    const expected = JSON.parse(docString);
    const actual = await this.response.json();
    
    expect(actual).toEqual(expected);
});

// Solution 4: HTML Doc String
When('I set the email template to:', async function (docString: string) {
    // Handle HTML content
    await this.page.evaluate((html) => {
        const editor = document.querySelector('.html-editor') as HTMLElement;
        if (editor) {
            editor.innerHTML = html;
        }
    }, docString);
    
    this.emailTemplate = docString;
});

// Solution 5: Code Doc String
When('I enter the following code:', async function (docString: string) {
    // Fill code editor
    await this.page.fill('.code-editor textarea', docString);
    this.codeContent = docString;
});

Then('the code output should be:', async function (docString: string) {
    const output = await this.page.locator('.code-output').textContent();
    expect(output?.trim()).toBe(docString.trim());
});

// Solution 6: Markdown Doc String
When('I write markdown content:', async function (docString: string) {
    await this.page.fill('#markdown-editor', docString);
});

Then('the preview should show:', async function (docString: string) {
    const preview = await this.page.locator('.markdown-preview').innerHTML();
    // Compare rendered HTML
    expect(preview).toContain(docString.trim());
});

// Solution 7: SQL Doc String
When('I execute the following query:', async function (docString: string) {
    await this.page.fill('#sql-editor', docString);
    await this.page.click('#execute-query');
    
    // Wait for results
    await this.page.locator('.query-results').waitFor();
});

// Solution 8: Configuration Doc String
Given('the configuration is:', async function (docString: string) {
    const config = JSON.parse(docString);
    this.testConfig = config;
    
    // Apply configuration
    await this.page.evaluate((cfg) => {
        (window as any).testConfig = cfg;
    }, config);
});

// Solution 9: Error Message Doc String
Then('I should see the following error:', async function (docString: string) {
    const errorText = await this.page.locator('.error-message').textContent();
    expect(errorText?.trim()).toBe(docString.trim());
});

// Solution 10: Multi-line Assertion
Then('the log should contain:', async function (docString: string) {
    const logContent = await this.page.locator('.log-output').textContent();
    const expectedLines = docString.trim().split('\n');
    
    for (const line of expectedLines) {
        expect(logContent).toContain(line.trim());
    }
});

// Solution 11: Template Doc String
When('I create email with template:', async function (docString: string) {
    // Replace placeholders
    const processedTemplate = docString
        .replace('{{name}}', this.userName || 'User')
        .replace('{{date}}', new Date().toLocaleDateString());
    
    await this.page.fill('#email-body', processedTemplate);
});

// Solution 12: Export
export {};

