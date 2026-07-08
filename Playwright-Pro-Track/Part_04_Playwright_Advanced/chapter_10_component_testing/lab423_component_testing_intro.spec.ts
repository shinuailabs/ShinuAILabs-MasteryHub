/**
 * Lab 423: Component Testing Introduction
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Introduction to component testing:
 * 
 * - What is component testing
 * - Benefits of component testing
 * - Playwright component testing
 * - Setup and configuration
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Understand component testing
 * 2. Set up component tests
 * 3. Write basic component tests
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Note: For actual component testing, use @playwright/experimental-ct-react
// or similar packages for your framework

// Solution 1: Understanding Component Testing
test('understanding component testing', async ({ page }) => {
    /*
     * Component Testing vs E2E Testing:
     * 
     * Component Testing:
     * - Tests individual components in isolation
     * - Faster execution
     * - Easier to debug
     * - Better for unit-level testing
     * 
     * E2E Testing:
     * - Tests full application flow
     * - More realistic scenarios
     * - Slower execution
     * - Better for integration testing
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 2: Simulating Component Isolation
test('simulating component isolation', async ({ page }) => {
    // Create an isolated HTML page with a component
    await page.setContent(`
        <html>
            <body>
                <button id="myButton" onclick="this.textContent = 'Clicked!'">
                    Click Me
                </button>
            </body>
        </html>
    `);
    
    const button = page.locator('#myButton');
    await expect(button).toHaveText('Click Me');
    
    await button.click();
    await expect(button).toHaveText('Clicked!');
});

// Solution 3: Testing Button Component
test('testing button component', async ({ page }) => {
    await page.setContent(`
        <html>
            <head>
                <style>
                    .btn { padding: 10px 20px; cursor: pointer; }
                    .btn-primary { background: blue; color: white; }
                    .btn-disabled { opacity: 0.5; cursor: not-allowed; }
                </style>
            </head>
            <body>
                <button class="btn btn-primary" id="primaryBtn">Primary</button>
                <button class="btn btn-disabled" id="disabledBtn" disabled>Disabled</button>
            </body>
        </html>
    `);
    
    const primaryBtn = page.locator('#primaryBtn');
    const disabledBtn = page.locator('#disabledBtn');
    
    await expect(primaryBtn).toBeVisible();
    await expect(primaryBtn).toBeEnabled();
    await expect(disabledBtn).toBeDisabled();
});

// Solution 4: Testing Input Component
test('testing input component', async ({ page }) => {
    await page.setContent(`
        <html>
            <body>
                <input type="text" id="textInput" placeholder="Enter text">
                <input type="email" id="emailInput" placeholder="Enter email">
                <input type="password" id="passwordInput" placeholder="Enter password">
            </body>
        </html>
    `);
    
    const textInput = page.locator('#textInput');
    await textInput.fill('Hello World');
    await expect(textInput).toHaveValue('Hello World');
    
    const emailInput = page.locator('#emailInput');
    await emailInput.fill('test@example.com');
    await expect(emailInput).toHaveValue('test@example.com');
});

// Solution 5: Testing Form Component
test('testing form component', async ({ page }) => {
    await page.setContent(`
        <html>
            <body>
                <form id="loginForm">
                    <input type="text" name="username" id="username">
                    <input type="password" name="password" id="password">
                    <button type="submit">Login</button>
                </form>
                <div id="result"></div>
                <script>
                    document.getElementById('loginForm').addEventListener('submit', (e) => {
                        e.preventDefault();
                        document.getElementById('result').textContent = 'Form submitted!';
                    });
                </script>
            </body>
        </html>
    `);
    
    await page.fill('#username', 'testuser');
    await page.fill('#password', 'password123');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('#result')).toHaveText('Form submitted!');
});

// Solution 6: Testing Dropdown Component
test('testing dropdown component', async ({ page }) => {
    await page.setContent(`
        <html>
            <body>
                <select id="dropdown">
                    <option value="">Select an option</option>
                    <option value="1">Option 1</option>
                    <option value="2">Option 2</option>
                    <option value="3">Option 3</option>
                </select>
            </body>
        </html>
    `);
    
    const dropdown = page.locator('#dropdown');
    
    await dropdown.selectOption('2');
    await expect(dropdown).toHaveValue('2');
    
    await dropdown.selectOption({ label: 'Option 3' });
    await expect(dropdown).toHaveValue('3');
});

// Solution 7: Testing Checkbox Component
test('testing checkbox component', async ({ page }) => {
    await page.setContent(`
        <html>
            <body>
                <label>
                    <input type="checkbox" id="checkbox1"> Option 1
                </label>
                <label>
                    <input type="checkbox" id="checkbox2" checked> Option 2
                </label>
            </body>
        </html>
    `);
    
    const checkbox1 = page.locator('#checkbox1');
    const checkbox2 = page.locator('#checkbox2');
    
    await expect(checkbox1).not.toBeChecked();
    await expect(checkbox2).toBeChecked();
    
    await checkbox1.check();
    await expect(checkbox1).toBeChecked();
    
    await checkbox2.uncheck();
    await expect(checkbox2).not.toBeChecked();
});

// Solution 8: Testing Radio Component
test('testing radio component', async ({ page }) => {
    await page.setContent(`
        <html>
            <body>
                <input type="radio" name="option" id="radio1" value="1">
                <input type="radio" name="option" id="radio2" value="2">
                <input type="radio" name="option" id="radio3" value="3">
            </body>
        </html>
    `);
    
    await page.locator('#radio1').check();
    await expect(page.locator('#radio1')).toBeChecked();
    
    await page.locator('#radio2').check();
    await expect(page.locator('#radio2')).toBeChecked();
    await expect(page.locator('#radio1')).not.toBeChecked();
});

// Solution 9: Testing Modal Component
test('testing modal component', async ({ page }) => {
    await page.setContent(`
        <html>
            <head>
                <style>
                    .modal { display: none; position: fixed; background: rgba(0,0,0,0.5); }
                    .modal.open { display: flex; }
                    .modal-content { background: white; padding: 20px; }
                </style>
            </head>
            <body>
                <button id="openModal">Open Modal</button>
                <div class="modal" id="modal">
                    <div class="modal-content">
                        <h2>Modal Title</h2>
                        <button id="closeModal">Close</button>
                    </div>
                </div>
                <script>
                    document.getElementById('openModal').onclick = () => {
                        document.getElementById('modal').classList.add('open');
                    };
                    document.getElementById('closeModal').onclick = () => {
                        document.getElementById('modal').classList.remove('open');
                    };
                </script>
            </body>
        </html>
    `);
    
    const modal = page.locator('#modal');
    
    await expect(modal).not.toBeVisible();
    await page.click('#openModal');
    await expect(modal).toBeVisible();
    await page.click('#closeModal');
    await expect(modal).not.toBeVisible();
});

// Solution 10: Component Testing Best Practices
test('component testing best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Test components in isolation
     * 2. Test all component states
     * 3. Test user interactions
     * 4. Test accessibility
     * 5. Use meaningful assertions
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

