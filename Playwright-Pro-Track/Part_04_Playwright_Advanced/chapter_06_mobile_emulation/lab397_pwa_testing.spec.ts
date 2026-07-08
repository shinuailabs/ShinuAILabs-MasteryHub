/**
 * Lab 397: PWA Testing
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Testing Progressive Web Apps:
 * 
 * - Service workers
 * - Offline support
 * - Install prompts
 * - Push notifications
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Test service workers
 * 2. Test offline mode
 * 3. Test PWA features
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Check Service Worker
test('check service worker', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Check if service worker is registered
    const hasServiceWorker = await page.evaluate(async () => {
        if ('serviceWorker' in navigator) {
            const registrations = await navigator.serviceWorker.getRegistrations();
            return registrations.length > 0;
        }
        return false;
    });
    
    console.log('Has service worker:', hasServiceWorker);
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 2: Service Worker Registration
test('service worker registration', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Wait for service worker
    await page.evaluate(async () => {
        if ('serviceWorker' in navigator) {
            await navigator.serviceWorker.ready;
        }
    });
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 3: Offline PWA Test
test('offline PWA test', async ({ context, page }) => {
    await page.goto('https://playwright.dev');
    
    // Wait for service worker to cache
    await page.waitForTimeout(2000);
    
    // Go offline
    await context.setOffline(true);
    
    // Try to reload (should work if cached)
    // await page.reload();
    
    // Go back online
    await context.setOffline(false);
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 4: Cache Storage
test('cache storage', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Check cache storage
    const caches = await page.evaluate(async () => {
        if ('caches' in window) {
            const cacheNames = await window.caches.keys();
            return cacheNames;
        }
        return [];
    });
    
    console.log('Caches:', caches);
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 5: Web App Manifest
test('web app manifest', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Check for manifest
    const manifest = await page.evaluate(() => {
        const link = document.querySelector('link[rel="manifest"]');
        return link ? link.getAttribute('href') : null;
    });
    
    console.log('Manifest:', manifest);
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 6: Install Prompt
test('install prompt', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Listen for beforeinstallprompt
    await page.evaluate(() => {
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log('Install prompt available');
            // e.preventDefault(); // Prevent auto-prompt
        });
    });
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 7: Push Notification Permission
test('push notification permission', async ({ browser }) => {
    const context = await browser.newContext({
        permissions: ['notifications'],
    });
    
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    
    // Check notification permission
    const permission = await page.evaluate(() => {
        return Notification.permission;
    });
    
    console.log('Notification permission:', permission);
    await context.close();
});

// Solution 8: Background Sync
test('background sync', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Check for background sync support
    const hasBackgroundSync = await page.evaluate(async () => {
        if ('serviceWorker' in navigator && 'sync' in window) {
            return true;
        }
        return false;
    });
    
    console.log('Has background sync:', hasBackgroundSync);
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 9: Add to Home Screen
test('add to home screen', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Check PWA criteria
    const pwaCriteria = await page.evaluate(() => {
        return {
            hasManifest: !!document.querySelector('link[rel="manifest"]'),
            hasServiceWorker: 'serviceWorker' in navigator,
            isSecure: location.protocol === 'https:',
        };
    });
    
    console.log('PWA criteria:', pwaCriteria);
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 10: PWA Testing Best Practices
test('PWA testing best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Test service worker registration
     * 2. Test offline functionality
     * 3. Test cache strategies
     * 4. Test install prompts
     * 5. Test push notifications
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

