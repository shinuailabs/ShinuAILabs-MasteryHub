/**
 * Lab 396: Sensors
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Emulating device sensors:
 * 
 * - Accelerometer
 * - Gyroscope
 * - Device orientation
 * - Motion events
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Emulate sensors
 * 2. Test motion events
 * 3. Test orientation
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect, devices } from '@playwright/test';

// Solution 1: Device Orientation
test('device orientation', async ({ browser }) => {
    const iPhone = devices['iPhone 13'];
    const context = await browser.newContext({ ...iPhone });
    const page = await context.newPage();
    
    await page.goto('https://playwright.dev');
    
    // Dispatch orientation event
    await page.evaluate(() => {
        window.dispatchEvent(new DeviceOrientationEvent('deviceorientation', {
            alpha: 0,
            beta: 45,
            gamma: 0,
        }));
    });
    
    await expect(page).toHaveTitle(/Playwright/);
    await context.close();
});

// Solution 2: Device Motion
test('device motion', async ({ browser }) => {
    const iPhone = devices['iPhone 13'];
    const context = await browser.newContext({ ...iPhone });
    const page = await context.newPage();
    
    await page.goto('https://playwright.dev');
    
    // Dispatch motion event
    await page.evaluate(() => {
        const event = new DeviceMotionEvent('devicemotion', {
            acceleration: { x: 0, y: 0, z: 9.8 },
            accelerationIncludingGravity: { x: 0, y: 0, z: 9.8 },
            rotationRate: { alpha: 0, beta: 0, gamma: 0 },
            interval: 16,
        });
        window.dispatchEvent(event);
    });
    
    await expect(page).toHaveTitle(/Playwright/);
    await context.close();
});

// Solution 3: Orientation Change
test('orientation change', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Portrait
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Dispatch orientation change
    await page.evaluate(() => {
        window.dispatchEvent(new Event('orientationchange'));
    });
    
    // Landscape
    await page.setViewportSize({ width: 667, height: 375 });
    
    await page.evaluate(() => {
        window.dispatchEvent(new Event('orientationchange'));
    });
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 4: Screen Orientation API
test('screen orientation API', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Check orientation
    const orientation = await page.evaluate(() => {
        return screen.orientation?.type || 'unknown';
    });
    
    console.log('Screen orientation:', orientation);
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 5: Shake Gesture
test('shake gesture', async ({ browser }) => {
    const iPhone = devices['iPhone 13'];
    const context = await browser.newContext({ ...iPhone });
    const page = await context.newPage();
    
    await page.goto('https://playwright.dev');
    
    // Simulate shake with multiple motion events
    for (let i = 0; i < 5; i++) {
        await page.evaluate((i) => {
            const x = i % 2 === 0 ? 10 : -10;
            window.dispatchEvent(new DeviceMotionEvent('devicemotion', {
                acceleration: { x, y: 0, z: 0 },
            }));
        }, i);
        await page.waitForTimeout(100);
    }
    
    await expect(page).toHaveTitle(/Playwright/);
    await context.close();
});

// Solution 6: Tilt Detection
test('tilt detection', async ({ browser }) => {
    const iPhone = devices['iPhone 13'];
    const context = await browser.newContext({ ...iPhone });
    const page = await context.newPage();
    
    await page.goto('https://playwright.dev');
    
    // Simulate tilt
    const tilts = [
        { beta: 0, gamma: 0 },
        { beta: 45, gamma: 0 },
        { beta: 0, gamma: 45 },
        { beta: -45, gamma: 0 },
    ];
    
    for (const tilt of tilts) {
        await page.evaluate((tilt) => {
            window.dispatchEvent(new DeviceOrientationEvent('deviceorientation', {
                alpha: 0,
                beta: tilt.beta,
                gamma: tilt.gamma,
            }));
        }, tilt);
        await page.waitForTimeout(200);
    }
    
    await expect(page).toHaveTitle(/Playwright/);
    await context.close();
});

// Solution 7: Compass Heading
test('compass heading', async ({ browser }) => {
    const iPhone = devices['iPhone 13'];
    const context = await browser.newContext({ ...iPhone });
    const page = await context.newPage();
    
    await page.goto('https://playwright.dev');
    
    // Simulate compass rotation
    for (let alpha = 0; alpha < 360; alpha += 45) {
        await page.evaluate((alpha) => {
            window.dispatchEvent(new DeviceOrientationEvent('deviceorientation', {
                alpha,
                beta: 0,
                gamma: 0,
            }));
        }, alpha);
        await page.waitForTimeout(100);
    }
    
    await expect(page).toHaveTitle(/Playwright/);
    await context.close();
});

// Solution 8: Ambient Light
test('ambient light', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Simulate ambient light sensor
    await page.evaluate(() => {
        // Note: AmbientLightSensor may not be available in all browsers
        window.dispatchEvent(new CustomEvent('ambientlight', {
            detail: { illuminance: 500 },
        }));
    });
    
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 9: Battery Status
test('battery status', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Check battery API (if available)
    const hasBattery = await page.evaluate(async () => {
        if ('getBattery' in navigator) {
            const battery = await (navigator as any).getBattery();
            return {
                level: battery.level,
                charging: battery.charging,
            };
        }
        return null;
    });
    
    console.log('Battery status:', hasBattery);
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 10: Sensors Best Practices
test('sensors best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Use mobile context
     * 2. Dispatch realistic events
     * 3. Test sensor permissions
     * 4. Handle unsupported sensors
     * 5. Test sensor-based features
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

