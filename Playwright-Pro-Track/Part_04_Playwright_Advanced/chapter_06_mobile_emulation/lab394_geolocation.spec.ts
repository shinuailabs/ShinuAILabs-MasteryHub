/**
 * Lab 394: Geolocation
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Testing with geolocation:
 * 
 * - Set location
 * - Location permissions
 * - Location changes
 * - Location errors
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Set geolocation
 * 2. Test location features
 * 3. Handle permissions
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Set Geolocation
test('set geolocation', async ({ browser }) => {
    const context = await browser.newContext({
        geolocation: { latitude: 40.7128, longitude: -74.0060 }, // New York
        permissions: ['geolocation'],
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    await expect(page).toHaveTitle(/Playwright/);
    await context.close();
});

// Solution 2: Different Locations
test('different locations', async ({ browser }) => {
    const locations = [
        { name: 'New York', latitude: 40.7128, longitude: -74.0060 },
        { name: 'London', latitude: 51.5074, longitude: -0.1278 },
        { name: 'Tokyo', latitude: 35.6762, longitude: 139.6503 },
    ];
    
    for (const location of locations) {
        const context = await browser.newContext({
            geolocation: { latitude: location.latitude, longitude: location.longitude },
            permissions: ['geolocation'],
        });
        
        const page = await context.newPage();
        await page.goto('https://playwright.dev');
        
        console.log(`Testing from ${location.name}`);
        await expect(page).toHaveTitle(/Playwright/);
        
        await context.close();
    }
});

// Solution 3: Change Location
test('change location', async ({ browser }) => {
    const context = await browser.newContext({
        geolocation: { latitude: 40.7128, longitude: -74.0060 },
        permissions: ['geolocation'],
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    // Change location
    await context.setGeolocation({ latitude: 51.5074, longitude: -0.1278 });
    
    await expect(page).toHaveTitle(/Playwright/);
    await context.close();
});

// Solution 4: Get Current Location
test('get current location', async ({ browser }) => {
    const context = await browser.newContext({
        geolocation: { latitude: 40.7128, longitude: -74.0060 },
        permissions: ['geolocation'],
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    // Get location via Geolocation API
    const position = await page.evaluate(() => {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                pos => resolve({
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude,
                }),
                err => reject(err)
            );
        });
    });
    
    console.log('Position:', position);
    await context.close();
});

// Solution 5: Location with Accuracy
test('location with accuracy', async ({ browser }) => {
    const context = await browser.newContext({
        geolocation: {
            latitude: 40.7128,
            longitude: -74.0060,
            accuracy: 100, // meters
        },
        permissions: ['geolocation'],
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    await expect(page).toHaveTitle(/Playwright/);
    await context.close();
});

// Solution 6: Deny Geolocation
test('deny geolocation', async ({ browser }) => {
    const context = await browser.newContext({
        // No geolocation permission
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    // Geolocation requests will be denied
    await expect(page).toHaveTitle(/Playwright/);
    await context.close();
});

// Solution 7: Watch Position
test('watch position', async ({ browser }) => {
    const context = await browser.newContext({
        geolocation: { latitude: 40.7128, longitude: -74.0060 },
        permissions: ['geolocation'],
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    // Set up watch
    await page.evaluate(() => {
        navigator.geolocation.watchPosition(
            pos => console.log('Position update:', pos.coords),
            err => console.log('Error:', err)
        );
    });
    
    // Change location to trigger update
    await context.setGeolocation({ latitude: 40.7200, longitude: -74.0100 });
    
    await expect(page).toHaveTitle(/Playwright/);
    await context.close();
});

// Solution 8: Location Error Handling
test('location error handling', async ({ browser }) => {
    const context = await browser.newContext({
        // No geolocation set
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    // Test error handling
    const result = await page.evaluate(() => {
        return new Promise((resolve) => {
            navigator.geolocation.getCurrentPosition(
                pos => resolve({ success: true }),
                err => resolve({ success: false, error: err.message })
            );
        });
    });
    
    console.log('Geolocation result:', result);
    await context.close();
});

// Solution 9: Mobile with Geolocation
test('mobile with geolocation', async ({ browser }) => {
    const context = await browser.newContext({
        viewport: { width: 375, height: 667 },
        isMobile: true,
        hasTouch: true,
        geolocation: { latitude: 40.7128, longitude: -74.0060 },
        permissions: ['geolocation'],
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    await expect(page).toHaveTitle(/Playwright/);
    await context.close();
});

// Solution 10: Geolocation Best Practices
test('geolocation best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Set permissions with geolocation
     * 2. Test multiple locations
     * 3. Test location changes
     * 4. Test permission denied
     * 5. Include accuracy when needed
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

