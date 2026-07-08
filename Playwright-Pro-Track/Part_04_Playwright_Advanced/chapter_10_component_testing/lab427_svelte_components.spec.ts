/**
 * Lab 427: Svelte Component Testing
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Testing Svelte components:
 * 
 * - Svelte reactivity
 * - Props and events
 * - Stores
 * - Transitions
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Test Svelte components
 * 2. Test reactivity
 * 3. Test stores
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Note: For actual Svelte component testing, use @playwright/experimental-ct-svelte
// These examples simulate Svelte-like component behavior

// Solution 1: Simulating Svelte Component
test('simulating Svelte component', async ({ page }) => {
    await page.setContent(`
        <html>
            <body>
                <div class="svelte-component">
                    <h1>Hello Svelte!</h1>
                    <p>Welcome to Svelte testing</p>
                </div>
            </body>
        </html>
    `);
    
    await expect(page.locator('.svelte-component h1')).toHaveText('Hello Svelte!');
});

// Solution 2: Testing Reactive Variables
test('testing reactive variables', async ({ page }) => {
    await page.setContent(`
        <html>
            <body>
                <div class="counter">
                    <span class="count">0</span>
                    <button class="increment">+</button>
                </div>
                <script>
                    let count = 0;
                    const countEl = document.querySelector('.count');
                    document.querySelector('.increment').onclick = () => {
                        count++;
                        countEl.textContent = count;
                    };
                </script>
            </body>
        </html>
    `);
    
    await expect(page.locator('.count')).toHaveText('0');
    await page.click('.increment');
    await expect(page.locator('.count')).toHaveText('1');
});

// Solution 3: Testing Props
test('testing props', async ({ page }) => {
    await page.setContent(`
        <html>
            <body>
                <div class="greeting" data-name="Svelte User">
                    <p>Hello, Svelte User!</p>
                </div>
            </body>
        </html>
    `);
    
    await expect(page.locator('.greeting p')).toContainText('Svelte User');
});

// Solution 4: Testing Event Dispatching
test('testing event dispatching', async ({ page }) => {
    await page.setContent(`
        <html>
            <body>
                <div class="child">
                    <button class="dispatch">Dispatch Event</button>
                </div>
                <p class="parent-message"></p>
                <script>
                    document.querySelector('.dispatch').onclick = () => {
                        document.querySelector('.parent-message').textContent = 'Event dispatched!';
                    };
                </script>
            </body>
        </html>
    `);
    
    await page.click('.dispatch');
    await expect(page.locator('.parent-message')).toHaveText('Event dispatched!');
});

// Solution 5: Testing Conditional Blocks
test('testing conditional blocks', async ({ page }) => {
    await page.setContent(`
        <html>
            <body>
                <div class="conditional">
                    <button class="toggle">Toggle</button>
                    <p class="if-block" style="display: none;">If block visible</p>
                    <p class="else-block">Else block visible</p>
                </div>
                <script>
                    let show = false;
                    document.querySelector('.toggle').onclick = () => {
                        show = !show;
                        document.querySelector('.if-block').style.display = show ? 'block' : 'none';
                        document.querySelector('.else-block').style.display = show ? 'none' : 'block';
                    };
                </script>
            </body>
        </html>
    `);
    
    await expect(page.locator('.else-block')).toBeVisible();
    await page.click('.toggle');
    await expect(page.locator('.if-block')).toBeVisible();
    await expect(page.locator('.else-block')).not.toBeVisible();
});

// Solution 6: Testing Each Blocks
test('testing each blocks', async ({ page }) => {
    await page.setContent(`
        <html>
            <body>
                <ul class="list">
                    <li class="item">Item 1</li>
                    <li class="item">Item 2</li>
                    <li class="item">Item 3</li>
                </ul>
            </body>
        </html>
    `);
    
    await expect(page.locator('.item')).toHaveCount(3);
});

// Solution 7: Testing Two-Way Binding
test('testing two-way binding', async ({ page }) => {
    await page.setContent(`
        <html>
            <body>
                <input type="text" class="input" bind:value="name">
                <p class="output"></p>
                <script>
                    const input = document.querySelector('.input');
                    const output = document.querySelector('.output');
                    input.addEventListener('input', () => {
                        output.textContent = input.value;
                    });
                </script>
            </body>
        </html>
    `);
    
    await page.fill('.input', 'Svelte Binding');
    await expect(page.locator('.output')).toHaveText('Svelte Binding');
});

// Solution 8: Testing Stores
test('testing stores', async ({ page }) => {
    await page.setContent(`
        <html>
            <body>
                <div class="store-demo">
                    <p class="store-value">0</p>
                    <button class="update-store">Update Store</button>
                </div>
                <script>
                    let storeValue = 0;
                    document.querySelector('.update-store').onclick = () => {
                        storeValue++;
                        document.querySelector('.store-value').textContent = storeValue;
                    };
                </script>
            </body>
        </html>
    `);
    
    await expect(page.locator('.store-value')).toHaveText('0');
    await page.click('.update-store');
    await expect(page.locator('.store-value')).toHaveText('1');
});

// Solution 9: Testing Slots
test('testing slots', async ({ page }) => {
    await page.setContent(`
        <html>
            <body>
                <div class="card">
                    <div class="card-header">
                        <slot name="header">Default Header</slot>
                    </div>
                    <div class="card-content">
                        <slot>Default Content</slot>
                    </div>
                </div>
            </body>
        </html>
    `);
    
    await expect(page.locator('.card-header')).toBeVisible();
    await expect(page.locator('.card-content')).toBeVisible();
});

// Solution 10: Svelte Component Testing Best Practices
test('Svelte component testing best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Test reactive variables
     * 2. Test props and events
     * 3. Test conditional/each blocks
     * 4. Test stores
     * 5. Test two-way binding
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

