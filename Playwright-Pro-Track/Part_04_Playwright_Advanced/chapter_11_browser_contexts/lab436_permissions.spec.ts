/**
 * Lab 436: Permissions
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Managing browser permissions:
 * 
 * - Geolocation permission
 * - Notification permission
 * - Camera/microphone
 * - Clipboard access
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Grant permissions
 * 2. Deny permissions
 * 3. Test permission-dependent features
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Geolocation Permission
test('geolocation permission', async ({ browser }) => {
    const context = await browser.newContext({
        geolocation: { latitude: 51.5074, longitude: -0.1278 }, // London
        permissions: ['geolocation'],
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    const position = await page.evaluate(() => {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (pos) => resolve({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                }),
                (err) => reject(err.message)
            );
        });
    });
    
    expect((position as any).lat).toBe(51.5074);
    expect((position as any).lng).toBe(-0.1278);
    
    await context.close();
});

// Solution 2: Notification Permission
test('notification permission', async ({ browser }) => {
    const context = await browser.newContext({
        permissions: ['notifications'],
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    const permission = await page.evaluate(() => {
        return Notification.permission;
    });
    
    expect(permission).toBe('granted');
    
    await context.close();
});

// Solution 3: Clipboard Permission
test('clipboard permission', async ({ browser }) => {
    const context = await browser.newContext({
        permissions: ['clipboard-read', 'clipboard-write'],
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    // Write to clipboard
    await page.evaluate(async () => {
        await navigator.clipboard.writeText('Test clipboard content');
    });
    
    // Read from clipboard
    const clipboardContent = await page.evaluate(async () => {
        return await navigator.clipboard.readText();
    });
    
    expect(clipboardContent).toBe('Test clipboard content');
    
    await context.close();
});

// Solution 4: Camera Permission
test('camera permission', async ({ browser }) => {
    const context = await browser.newContext({
        permissions: ['camera'],
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    const hasCamera = await page.evaluate(async () => {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            return devices.some(d => d.kind === 'videoinput');
        } catch {
            return false;
        }
    });
    
    console.log('Camera available:', hasCamera);
    
    await context.close();
});

// Solution 5: Microphone Permission
test('microphone permission', async ({ browser }) => {
    const context = await browser.newContext({
        permissions: ['microphone'],
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    const hasMicrophone = await page.evaluate(async () => {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            return devices.some(d => d.kind === 'audioinput');
        } catch {
            return false;
        }
    });
    
    console.log('Microphone available:', hasMicrophone);
    
    await context.close();
});

// Solution 6: Multiple Permissions
test('multiple permissions', async ({ browser }) => {
    const context = await browser.newContext({
        permissions: ['geolocation', 'notifications', 'clipboard-read'],
        geolocation: { latitude: 40.7128, longitude: -74.0060 }, // NYC
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    const permissions = await page.evaluate(() => {
        return {
            notification: Notification.permission,
        };
    });
    
    expect(permissions.notification).toBe('granted');
    
    await context.close();
});

// Solution 7: Granting Permission at Runtime
test('granting permission at runtime', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    
    await page.goto('https://playwright.dev');
    
    // Grant permission after page load
    await context.grantPermissions(['geolocation'], {
        origin: 'https://playwright.dev',
    });
    
    // Now geolocation should work
    console.log('Geolocation permission granted');
    
    await context.close();
});

// Solution 8: Clearing Permissions
test('clearing permissions', async ({ browser }) => {
    const context = await browser.newContext({
        permissions: ['geolocation', 'notifications'],
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    // Clear all permissions
    await context.clearPermissions();
    
    console.log('Permissions cleared');
    
    await context.close();
});

// Solution 9: Permission Denied Scenario
test('permission denied scenario', async ({ browser }) => {
    // Create context without permissions
    const context = await browser.newContext({
        permissions: [], // No permissions granted
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    // Notification permission should be default (not granted)
    const permission = await page.evaluate(() => {
        return Notification.permission;
    });
    
    expect(permission).toBe('default');
    
    await context.close();
});

// Solution 10: Permissions Best Practices
test('permissions best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Grant only needed permissions
     * 2. Test both granted and denied scenarios
     * 3. Use origin-specific permissions
     * 4. Clear permissions when done
     * 5. Test permission prompts
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

