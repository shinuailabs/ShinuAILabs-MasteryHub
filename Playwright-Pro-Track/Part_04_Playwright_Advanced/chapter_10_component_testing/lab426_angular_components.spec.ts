/**
 * Lab 426: Angular Component Testing
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Testing Angular components:
 * 
 * - Angular component structure
 * - Input/Output decorators
 * - Template testing
 * - Service injection
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Test Angular components
 * 2. Test inputs and outputs
 * 3. Test templates
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Note: For actual Angular component testing, use @playwright/experimental-ct-angular
// These examples simulate Angular-like component behavior

// Solution 1: Simulating Angular Component
test('simulating Angular component', async ({ page }) => {
    await page.setContent(`
        <html>
            <body>
                <app-root>
                    <div class="angular-component">
                        <h1>Angular Component</h1>
                        <p>Welcome to Angular!</p>
                    </div>
                </app-root>
            </body>
        </html>
    `);
    
    await expect(page.locator('.angular-component h1')).toHaveText('Angular Component');
});

// Solution 2: Testing @Input Properties
test('testing Input properties', async ({ page }) => {
    await page.setContent(`
        <html>
            <body>
                <app-greeting data-name="John">
                    <p class="greeting">Hello, John!</p>
                </app-greeting>
            </body>
        </html>
    `);
    
    await expect(page.locator('.greeting')).toHaveText('Hello, John!');
});

// Solution 3: Testing @Output Events
test('testing Output events', async ({ page }) => {
    await page.setContent(`
        <html>
            <body>
                <app-button>
                    <button class="btn">Click Me</button>
                </app-button>
                <p class="result"></p>
                <script>
                    document.querySelector('.btn').onclick = () => {
                        document.querySelector('.result').textContent = 'Button clicked!';
                    };
                </script>
            </body>
        </html>
    `);
    
    await page.click('.btn');
    await expect(page.locator('.result')).toHaveText('Button clicked!');
});

// Solution 4: Testing ngIf Directive
test('testing ngIf directive', async ({ page }) => {
    await page.setContent(`
        <html>
            <body>
                <app-conditional>
                    <button class="toggle">Toggle</button>
                    <div class="content" style="display: none;">
                        Conditional Content
                    </div>
                </app-conditional>
                <script>
                    let show = false;
                    document.querySelector('.toggle').onclick = () => {
                        show = !show;
                        document.querySelector('.content').style.display = show ? 'block' : 'none';
                    };
                </script>
            </body>
        </html>
    `);
    
    await expect(page.locator('.content')).not.toBeVisible();
    await page.click('.toggle');
    await expect(page.locator('.content')).toBeVisible();
});

// Solution 5: Testing ngFor Directive
test('testing ngFor directive', async ({ page }) => {
    await page.setContent(`
        <html>
            <body>
                <app-list>
                    <ul class="items">
                        <li class="item">Item 1</li>
                        <li class="item">Item 2</li>
                        <li class="item">Item 3</li>
                    </ul>
                </app-list>
            </body>
        </html>
    `);
    
    await expect(page.locator('.item')).toHaveCount(3);
});

// Solution 6: Testing Two-Way Binding
test('testing two-way binding', async ({ page }) => {
    await page.setContent(`
        <html>
            <body>
                <app-form>
                    <input type="text" class="name-input" [(ngModel)]="name">
                    <p class="name-display"></p>
                </app-form>
                <script>
                    const input = document.querySelector('.name-input');
                    const display = document.querySelector('.name-display');
                    input.addEventListener('input', () => {
                        display.textContent = input.value;
                    });
                </script>
            </body>
        </html>
    `);
    
    await page.fill('.name-input', 'Angular User');
    await expect(page.locator('.name-display')).toHaveText('Angular User');
});

// Solution 7: Testing Form Validation
test('testing form validation', async ({ page }) => {
    await page.setContent(`
        <html>
            <body>
                <app-form>
                    <form class="angular-form">
                        <input type="email" class="email" required>
                        <span class="error" style="display: none;">Invalid email</span>
                        <button type="submit" class="submit" disabled>Submit</button>
                    </form>
                </app-form>
                <script>
                    const email = document.querySelector('.email');
                    const error = document.querySelector('.error');
                    const submit = document.querySelector('.submit');
                    
                    email.addEventListener('input', () => {
                        const isValid = email.value.includes('@');
                        error.style.display = isValid ? 'none' : 'inline';
                        submit.disabled = !isValid;
                    });
                </script>
            </body>
        </html>
    `);
    
    await page.fill('.email', 'invalid');
    await expect(page.locator('.error')).toBeVisible();
    await expect(page.locator('.submit')).toBeDisabled();
    
    await page.fill('.email', 'valid@email.com');
    await expect(page.locator('.error')).not.toBeVisible();
    await expect(page.locator('.submit')).toBeEnabled();
});

// Solution 8: Testing Pipes
test('testing pipes', async ({ page }) => {
    await page.setContent(`
        <html>
            <body>
                <app-display>
                    <p class="uppercase">HELLO WORLD</p>
                    <p class="lowercase">hello world</p>
                    <p class="currency">$1,234.56</p>
                    <p class="date">Jan 1, 2024</p>
                </app-display>
            </body>
        </html>
    `);
    
    await expect(page.locator('.uppercase')).toHaveText('HELLO WORLD');
    await expect(page.locator('.lowercase')).toHaveText('hello world');
    await expect(page.locator('.currency')).toContainText('$');
});

// Solution 9: Testing Component Lifecycle
test('testing component lifecycle', async ({ page }) => {
    await page.setContent(`
        <html>
            <body>
                <app-lifecycle>
                    <div class="lifecycle-component">
                        <p class="status">Initialized</p>
                        <button class="destroy">Destroy</button>
                    </div>
                </app-lifecycle>
                <script>
                    document.querySelector('.destroy').onclick = () => {
                        document.querySelector('.status').textContent = 'Destroyed';
                    };
                </script>
            </body>
        </html>
    `);
    
    await expect(page.locator('.status')).toHaveText('Initialized');
    await page.click('.destroy');
    await expect(page.locator('.status')).toHaveText('Destroyed');
});

// Solution 10: Angular Component Testing Best Practices
test('Angular component testing best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Test @Input and @Output
     * 2. Test template bindings
     * 3. Test form validation
     * 4. Test directives
     * 5. Test component lifecycle
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

