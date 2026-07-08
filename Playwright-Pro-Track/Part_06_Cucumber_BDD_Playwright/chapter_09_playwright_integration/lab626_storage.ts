/**
 * Lab 626: Storage State Management
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Managing storage state:
 * 
 * - Save/restore state
 * - Authentication reuse
 * - Cookies management
 * - Local storage
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Save storage state
 * 2. Restore state
 * 3. Manage cookies
 *
 * =====================
 * SOLUTION:
 * =====================
 */

import { Given, When, Then, Before } from '@cucumber/cucumber';
import { expect, BrowserContext } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Solution 1: Save Storage State
When('I save the storage state as {string}', async function (name: string) {
    const stateDir = '.auth';
    if (!fs.existsSync(stateDir)) {
        fs.mkdirSync(stateDir, { recursive: true });
    }
    
    const statePath = path.join(stateDir, `${name}.json`);
    await this.context.storageState({ path: statePath });
    console.log(`Storage state saved to: ${statePath}`);
});

// Solution 2: Load Storage State
Given('I load the storage state {string}', async function (name: string) {
    const statePath = path.join('.auth', `${name}.json`);
    
    if (!fs.existsSync(statePath)) {
        throw new Error(`Storage state not found: ${statePath}`);
    }
    
    // Close current context and create new one with state
    await this.page.close();
    await this.context.close();
    
    this.context = await this.browser.newContext({
        storageState: statePath,
    });
    this.page = await this.context.newPage();
});

// Solution 3: Set Cookie
When('I set cookie {string} to {string}', async function (name: string, value: string) {
    await this.context.addCookies([{
        name,
        value,
        domain: new URL(this.page.url()).hostname,
        path: '/',
    }]);
});

When('I set cookie {string} with:', async function (name: string, docString: string) {
    const cookieData = JSON.parse(docString);
    await this.context.addCookies([{
        name,
        ...cookieData,
    }]);
});

// Solution 4: Get Cookie
Then('the cookie {string} should have value {string}', async function (name: string, expectedValue: string) {
    const cookies = await this.context.cookies();
    const cookie = cookies.find(c => c.name === name);
    
    expect(cookie).toBeDefined();
    expect(cookie?.value).toBe(expectedValue);
});

Then('the cookie {string} should exist', async function (name: string) {
    const cookies = await this.context.cookies();
    const cookie = cookies.find(c => c.name === name);
    expect(cookie).toBeDefined();
});

Then('the cookie {string} should not exist', async function (name: string) {
    const cookies = await this.context.cookies();
    const cookie = cookies.find(c => c.name === name);
    expect(cookie).toBeUndefined();
});

// Solution 5: Clear Cookies
When('I clear all cookies', async function () {
    await this.context.clearCookies();
});

When('I clear cookie {string}', async function (name: string) {
    const cookies = await this.context.cookies();
    const filteredCookies = cookies.filter(c => c.name !== name);
    
    await this.context.clearCookies();
    await this.context.addCookies(filteredCookies);
});

// Solution 6: Local Storage
When('I set local storage {string} to {string}', async function (key: string, value: string) {
    await this.page.evaluate(([k, v]) => {
        localStorage.setItem(k, v);
    }, [key, value]);
});

Then('the local storage {string} should be {string}', async function (key: string, expectedValue: string) {
    const value = await this.page.evaluate((k) => localStorage.getItem(k), key);
    expect(value).toBe(expectedValue);
});

When('I clear local storage', async function () {
    await this.page.evaluate(() => localStorage.clear());
});

// Solution 7: Session Storage
When('I set session storage {string} to {string}', async function (key: string, value: string) {
    await this.page.evaluate(([k, v]) => {
        sessionStorage.setItem(k, v);
    }, [key, value]);
});

Then('the session storage {string} should be {string}', async function (key: string, expectedValue: string) {
    const value = await this.page.evaluate((k) => sessionStorage.getItem(k), key);
    expect(value).toBe(expectedValue);
});

// Solution 8: Authentication State Helper
async function setupAuthenticatedState(
    context: BrowserContext,
    userType: string
): Promise<void> {
    const statePath = path.join('.auth', `${userType}.json`);
    
    if (fs.existsSync(statePath)) {
        // State exists, load it
        const state = JSON.parse(fs.readFileSync(statePath, 'utf-8'));
        await context.addCookies(state.cookies || []);
    } else {
        throw new Error(`Auth state not found for: ${userType}`);
    }
}

// Solution 9: Before Hook with Auth State
Before({ tags: '@authenticated' }, async function (scenario) {
    const tags = scenario.pickle.tags.map(t => t.name);
    const authTag = tags.find(t => t.startsWith('@auth:'));
    
    if (authTag) {
        const userType = authTag.replace('@auth:', '');
        await setupAuthenticatedState(this.context, userType);
    }
});

// Solution 10: Export
export { setupAuthenticatedState };

