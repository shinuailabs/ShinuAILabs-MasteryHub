/**
 * Lab 425: Vue Component Testing
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Testing Vue components:
 * 
 * - Vue component mounting
 * - Props and data testing
 * - Computed properties
 * - Vue events
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Test Vue components
 * 2. Test reactive data
 * 3. Test Vue events
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Note: For actual Vue component testing, use @playwright/experimental-ct-vue
// These examples simulate Vue-like component behavior

// Solution 1: Simulating Vue Component
test('simulating Vue component', async ({ page }) => {
    await page.setContent(`
        <html>
            <body>
                <div id="app">
                    <div class="vue-component">
                        <h1>{{ title }}</h1>
                        <p>Message: Hello Vue!</p>
                    </div>
                </div>
            </body>
        </html>
    `);
    
    await expect(page.locator('.vue-component p')).toContainText('Hello Vue!');
});

// Solution 2: Testing Reactive Data
test('testing reactive data', async ({ page }) => {
    await page.setContent(`
        <html>
            <body>
                <div id="app">
                    <input type="text" class="input" value="">
                    <p class="output"></p>
                </div>
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
    
    await page.fill('.input', 'Vue Reactive');
    await expect(page.locator('.output')).toHaveText('Vue Reactive');
});

// Solution 3: Testing Computed Properties
test('testing computed properties', async ({ page }) => {
    await page.setContent(`
        <html>
            <body>
                <div id="app">
                    <input type="text" class="first-name" placeholder="First Name">
                    <input type="text" class="last-name" placeholder="Last Name">
                    <p class="full-name"></p>
                </div>
                <script>
                    const firstName = document.querySelector('.first-name');
                    const lastName = document.querySelector('.last-name');
                    const fullName = document.querySelector('.full-name');
                    
                    function updateFullName() {
                        fullName.textContent = firstName.value + ' ' + lastName.value;
                    }
                    
                    firstName.addEventListener('input', updateFullName);
                    lastName.addEventListener('input', updateFullName);
                </script>
            </body>
        </html>
    `);
    
    await page.fill('.first-name', 'John');
    await page.fill('.last-name', 'Doe');
    await expect(page.locator('.full-name')).toHaveText('John Doe');
});

// Solution 4: Testing v-if Directive
test('testing v-if directive', async ({ page }) => {
    await page.setContent(`
        <html>
            <body>
                <div id="app">
                    <button class="toggle">Toggle</button>
                    <div class="conditional" style="display: none;">
                        Conditional Content
                    </div>
                </div>
                <script>
                    let show = false;
                    document.querySelector('.toggle').onclick = () => {
                        show = !show;
                        document.querySelector('.conditional').style.display = show ? 'block' : 'none';
                    };
                </script>
            </body>
        </html>
    `);
    
    await expect(page.locator('.conditional')).not.toBeVisible();
    await page.click('.toggle');
    await expect(page.locator('.conditional')).toBeVisible();
});

// Solution 5: Testing v-for Directive
test('testing v-for directive', async ({ page }) => {
    await page.setContent(`
        <html>
            <body>
                <div id="app">
                    <ul class="list">
                        <li class="item">Apple</li>
                        <li class="item">Banana</li>
                        <li class="item">Cherry</li>
                    </ul>
                    <button class="add-item">Add Item</button>
                </div>
                <script>
                    document.querySelector('.add-item').onclick = () => {
                        const li = document.createElement('li');
                        li.className = 'item';
                        li.textContent = 'New Item';
                        document.querySelector('.list').appendChild(li);
                    };
                </script>
            </body>
        </html>
    `);
    
    await expect(page.locator('.item')).toHaveCount(3);
    await page.click('.add-item');
    await expect(page.locator('.item')).toHaveCount(4);
});

// Solution 6: Testing v-model
test('testing v-model', async ({ page }) => {
    await page.setContent(`
        <html>
            <body>
                <div id="app">
                    <input type="text" class="model-input">
                    <p class="model-output"></p>
                </div>
                <script>
                    const input = document.querySelector('.model-input');
                    const output = document.querySelector('.model-output');
                    input.addEventListener('input', () => {
                        output.textContent = input.value;
                    });
                </script>
            </body>
        </html>
    `);
    
    await page.fill('.model-input', 'Two-way binding');
    await expect(page.locator('.model-output')).toHaveText('Two-way binding');
});

// Solution 7: Testing Event Emitting
test('testing event emitting', async ({ page }) => {
    await page.setContent(`
        <html>
            <body>
                <div id="app">
                    <div class="child-component">
                        <button class="emit-btn">Emit Event</button>
                    </div>
                    <p class="parent-message"></p>
                </div>
                <script>
                    document.querySelector('.emit-btn').onclick = () => {
                        document.querySelector('.parent-message').textContent = 'Event received!';
                    };
                </script>
            </body>
        </html>
    `);
    
    await page.click('.emit-btn');
    await expect(page.locator('.parent-message')).toHaveText('Event received!');
});

// Solution 8: Testing Slots
test('testing slots', async ({ page }) => {
    await page.setContent(`
        <html>
            <body>
                <div id="app">
                    <div class="card-component">
                        <div class="card-header">
                            <slot name="header">Default Header</slot>
                        </div>
                        <div class="card-body">
                            <slot>Default Content</slot>
                        </div>
                        <div class="card-footer">
                            <slot name="footer">Default Footer</slot>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    `);
    
    await expect(page.locator('.card-header')).toBeVisible();
    await expect(page.locator('.card-body')).toBeVisible();
    await expect(page.locator('.card-footer')).toBeVisible();
});

// Solution 9: Testing Watchers
test('testing watchers', async ({ page }) => {
    await page.setContent(`
        <html>
            <body>
                <div id="app">
                    <input type="number" class="quantity" value="1">
                    <p class="total">Total: $10</p>
                </div>
                <script>
                    const price = 10;
                    const quantity = document.querySelector('.quantity');
                    const total = document.querySelector('.total');
                    
                    quantity.addEventListener('input', () => {
                        const qty = parseInt(quantity.value) || 0;
                        total.textContent = 'Total: $' + (qty * price);
                    });
                </script>
            </body>
        </html>
    `);
    
    await page.fill('.quantity', '5');
    await expect(page.locator('.total')).toHaveText('Total: $50');
});

// Solution 10: Vue Component Testing Best Practices
test('Vue component testing best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Test reactive data
     * 2. Test computed properties
     * 3. Test directives (v-if, v-for, v-model)
     * 4. Test event handling
     * 5. Test slots and props
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

