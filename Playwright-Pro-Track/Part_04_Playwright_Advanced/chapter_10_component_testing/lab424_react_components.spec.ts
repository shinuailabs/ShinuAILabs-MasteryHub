/**
 * Lab 424: React Component Testing
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Testing React components:
 * 
 * - React component mounting
 * - Props testing
 * - State testing
 * - Event handling
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Test React components
 * 2. Test props and state
 * 3. Test event handlers
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Note: For actual React component testing, use @playwright/experimental-ct-react
// These examples simulate React-like component behavior

// Solution 1: Simulating React Button Component
test('simulating React button component', async ({ page }) => {
    await page.setContent(`
        <html>
            <body>
                <div id="root">
                    <button class="react-button" data-variant="primary">
                        Click Me
                    </button>
                </div>
            </body>
        </html>
    `);
    
    const button = page.locator('.react-button');
    await expect(button).toBeVisible();
    await expect(button).toHaveAttribute('data-variant', 'primary');
});

// Solution 2: Testing Component with Props
test('testing component with props', async ({ page }) => {
    await page.setContent(`
        <html>
            <body>
                <div id="root">
                    <div class="card" data-title="My Card" data-description="Card description">
                        <h3 class="card-title">My Card</h3>
                        <p class="card-description">Card description</p>
                    </div>
                </div>
            </body>
        </html>
    `);
    
    const card = page.locator('.card');
    await expect(card.locator('.card-title')).toHaveText('My Card');
    await expect(card.locator('.card-description')).toHaveText('Card description');
});

// Solution 3: Testing Component State Changes
test('testing component state changes', async ({ page }) => {
    await page.setContent(`
        <html>
            <body>
                <div id="root">
                    <div class="counter">
                        <span class="count">0</span>
                        <button class="increment">+</button>
                        <button class="decrement">-</button>
                    </div>
                </div>
                <script>
                    let count = 0;
                    const countEl = document.querySelector('.count');
                    document.querySelector('.increment').onclick = () => {
                        count++;
                        countEl.textContent = count;
                    };
                    document.querySelector('.decrement').onclick = () => {
                        count--;
                        countEl.textContent = count;
                    };
                </script>
            </body>
        </html>
    `);
    
    const count = page.locator('.count');
    await expect(count).toHaveText('0');
    
    await page.click('.increment');
    await expect(count).toHaveText('1');
    
    await page.click('.increment');
    await expect(count).toHaveText('2');
    
    await page.click('.decrement');
    await expect(count).toHaveText('1');
});

// Solution 4: Testing Event Handlers
test('testing event handlers', async ({ page }) => {
    await page.setContent(`
        <html>
            <body>
                <div id="root">
                    <input type="text" class="input" placeholder="Type here">
                    <p class="output"></p>
                </div>
                <script>
                    document.querySelector('.input').oninput = (e) => {
                        document.querySelector('.output').textContent = e.target.value;
                    };
                </script>
            </body>
        </html>
    `);
    
    const input = page.locator('.input');
    const output = page.locator('.output');
    
    await input.fill('Hello React');
    await expect(output).toHaveText('Hello React');
});

// Solution 5: Testing Conditional Rendering
test('testing conditional rendering', async ({ page }) => {
    await page.setContent(`
        <html>
            <body>
                <div id="root">
                    <button class="toggle">Toggle</button>
                    <div class="content" style="display: none;">
                        Conditional Content
                    </div>
                </div>
                <script>
                    document.querySelector('.toggle').onclick = () => {
                        const content = document.querySelector('.content');
                        content.style.display = content.style.display === 'none' ? 'block' : 'none';
                    };
                </script>
            </body>
        </html>
    `);
    
    const content = page.locator('.content');
    
    await expect(content).not.toBeVisible();
    await page.click('.toggle');
    await expect(content).toBeVisible();
    await page.click('.toggle');
    await expect(content).not.toBeVisible();
});

// Solution 6: Testing List Rendering
test('testing list rendering', async ({ page }) => {
    await page.setContent(`
        <html>
            <body>
                <div id="root">
                    <ul class="list">
                        <li class="list-item">Item 1</li>
                        <li class="list-item">Item 2</li>
                        <li class="list-item">Item 3</li>
                    </ul>
                </div>
            </body>
        </html>
    `);
    
    const items = page.locator('.list-item');
    await expect(items).toHaveCount(3);
    await expect(items.first()).toHaveText('Item 1');
    await expect(items.last()).toHaveText('Item 3');
});

// Solution 7: Testing Form Component
test('testing form component', async ({ page }) => {
    await page.setContent(`
        <html>
            <body>
                <div id="root">
                    <form class="form">
                        <input type="text" name="name" class="name-input">
                        <input type="email" name="email" class="email-input">
                        <button type="submit">Submit</button>
                    </form>
                    <div class="result"></div>
                </div>
                <script>
                    document.querySelector('.form').onsubmit = (e) => {
                        e.preventDefault();
                        const name = document.querySelector('.name-input').value;
                        const email = document.querySelector('.email-input').value;
                        document.querySelector('.result').textContent = name + ' - ' + email;
                    };
                </script>
            </body>
        </html>
    `);
    
    await page.fill('.name-input', 'John Doe');
    await page.fill('.email-input', 'john@example.com');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('.result')).toHaveText('John Doe - john@example.com');
});

// Solution 8: Testing Loading States
test('testing loading states', async ({ page }) => {
    await page.setContent(`
        <html>
            <body>
                <div id="root">
                    <button class="load-btn">Load Data</button>
                    <div class="loading" style="display: none;">Loading...</div>
                    <div class="data" style="display: none;">Data Loaded!</div>
                </div>
                <script>
                    document.querySelector('.load-btn').onclick = async () => {
                        document.querySelector('.loading').style.display = 'block';
                        await new Promise(r => setTimeout(r, 500));
                        document.querySelector('.loading').style.display = 'none';
                        document.querySelector('.data').style.display = 'block';
                    };
                </script>
            </body>
        </html>
    `);
    
    await page.click('.load-btn');
    await expect(page.locator('.loading')).toBeVisible();
    await expect(page.locator('.data')).toBeVisible({ timeout: 2000 });
    await expect(page.locator('.loading')).not.toBeVisible();
});

// Solution 9: Testing Error States
test('testing error states', async ({ page }) => {
    await page.setContent(`
        <html>
            <body>
                <div id="root">
                    <input type="email" class="email-input">
                    <span class="error" style="display: none; color: red;">Invalid email</span>
                </div>
                <script>
                    document.querySelector('.email-input').onblur = (e) => {
                        const isValid = e.target.value.includes('@');
                        document.querySelector('.error').style.display = isValid ? 'none' : 'inline';
                    };
                </script>
            </body>
        </html>
    `);
    
    const input = page.locator('.email-input');
    const error = page.locator('.error');
    
    await input.fill('invalid');
    await input.blur();
    await expect(error).toBeVisible();
    
    await input.fill('valid@email.com');
    await input.blur();
    await expect(error).not.toBeVisible();
});

// Solution 10: React Component Testing Best Practices
test('React component testing best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Test component rendering
     * 2. Test props handling
     * 3. Test state changes
     * 4. Test event handlers
     * 5. Test conditional rendering
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

