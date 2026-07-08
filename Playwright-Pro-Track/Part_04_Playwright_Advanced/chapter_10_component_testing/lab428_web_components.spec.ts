/**
 * Lab 428: Web Components Testing
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Testing Web Components:
 * 
 * - Custom elements
 * - Shadow DOM
 * - Slots
 * - Attributes and properties
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Test custom elements
 * 2. Test Shadow DOM
 * 3. Test slots
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Testing Custom Element
test('testing custom element', async ({ page }) => {
    await page.setContent(`
        <html>
            <body>
                <my-element>
                    <div class="content">Custom Element Content</div>
                </my-element>
            </body>
        </html>
    `);
    
    await expect(page.locator('my-element .content')).toHaveText('Custom Element Content');
});

// Solution 2: Testing Shadow DOM
test('testing Shadow DOM', async ({ page }) => {
    await page.setContent(`
        <html>
            <body>
                <div id="host"></div>
                <script>
                    const host = document.getElementById('host');
                    const shadow = host.attachShadow({ mode: 'open' });
                    shadow.innerHTML = '<p class="shadow-content">Shadow DOM Content</p>';
                </script>
            </body>
        </html>
    `);
    
    // Access shadow DOM content
    const shadowContent = await page.evaluate(() => {
        const host = document.getElementById('host');
        return host?.shadowRoot?.querySelector('.shadow-content')?.textContent;
    });
    
    expect(shadowContent).toBe('Shadow DOM Content');
});

// Solution 3: Testing Slots
test('testing slots', async ({ page }) => {
    await page.setContent(`
        <html>
            <body>
                <div id="host"></div>
                <script>
                    const host = document.getElementById('host');
                    const shadow = host.attachShadow({ mode: 'open' });
                    shadow.innerHTML = '<slot></slot>';
                    host.innerHTML = '<span class="slotted">Slotted Content</span>';
                </script>
            </body>
        </html>
    `);
    
    await expect(page.locator('#host .slotted')).toHaveText('Slotted Content');
});

// Solution 4: Testing Named Slots
test('testing named slots', async ({ page }) => {
    await page.setContent(`
        <html>
            <body>
                <div id="host">
                    <span slot="header" class="header-slot">Header</span>
                    <span slot="footer" class="footer-slot">Footer</span>
                </div>
                <script>
                    const host = document.getElementById('host');
                    const shadow = host.attachShadow({ mode: 'open' });
                    shadow.innerHTML = '<slot name="header"></slot><slot name="footer"></slot>';
                </script>
            </body>
        </html>
    `);
    
    await expect(page.locator('.header-slot')).toHaveText('Header');
    await expect(page.locator('.footer-slot')).toHaveText('Footer');
});

// Solution 5: Testing Custom Element Attributes
test('testing custom element attributes', async ({ page }) => {
    await page.setContent(`
        <html>
            <body>
                <my-button label="Click Me" disabled="false"></my-button>
                <script>
                    class MyButton extends HTMLElement {
                        connectedCallback() {
                            const label = this.getAttribute('label');
                            const disabled = this.getAttribute('disabled') === 'true';
                            this.innerHTML = '<button ' + (disabled ? 'disabled' : '') + '>' + label + '</button>';
                        }
                    }
                    customElements.define('my-button', MyButton);
                </script>
            </body>
        </html>
    `);
    
    await expect(page.locator('my-button button')).toHaveText('Click Me');
    await expect(page.locator('my-button button')).toBeEnabled();
});

// Solution 6: Testing Custom Element Events
test('testing custom element events', async ({ page }) => {
    await page.setContent(`
        <html>
            <body>
                <my-counter></my-counter>
                <p class="result"></p>
                <script>
                    class MyCounter extends HTMLElement {
                        connectedCallback() {
                            this.count = 0;
                            this.innerHTML = '<button class="inc">+</button><span class="count">0</span>';
                            this.querySelector('.inc').onclick = () => {
                                this.count++;
                                this.querySelector('.count').textContent = this.count;
                                this.dispatchEvent(new CustomEvent('countchange', { detail: this.count }));
                            };
                        }
                    }
                    customElements.define('my-counter', MyCounter);
                    
                    document.querySelector('my-counter').addEventListener('countchange', (e) => {
                        document.querySelector('.result').textContent = 'Count: ' + e.detail;
                    });
                </script>
            </body>
        </html>
    `);
    
    await page.click('my-counter .inc');
    await expect(page.locator('.result')).toHaveText('Count: 1');
});

// Solution 7: Testing Custom Element Lifecycle
test('testing custom element lifecycle', async ({ page }) => {
    await page.setContent(`
        <html>
            <body>
                <div id="container"></div>
                <p class="lifecycle-log"></p>
                <script>
                    const log = [];
                    class LifecycleElement extends HTMLElement {
                        connectedCallback() {
                            log.push('connected');
                            document.querySelector('.lifecycle-log').textContent = log.join(', ');
                        }
                        disconnectedCallback() {
                            log.push('disconnected');
                            document.querySelector('.lifecycle-log').textContent = log.join(', ');
                        }
                    }
                    customElements.define('lifecycle-element', LifecycleElement);
                    
                    document.getElementById('container').innerHTML = '<lifecycle-element></lifecycle-element>';
                </script>
            </body>
        </html>
    `);
    
    await expect(page.locator('.lifecycle-log')).toContainText('connected');
});

// Solution 8: Testing CSS Custom Properties
test('testing CSS custom properties', async ({ page }) => {
    await page.setContent(`
        <html>
            <head>
                <style>
                    :root {
                        --primary-color: blue;
                    }
                    .themed {
                        color: var(--primary-color);
                    }
                </style>
            </head>
            <body>
                <p class="themed">Themed Text</p>
            </body>
        </html>
    `);
    
    const color = await page.evaluate(() => {
        return getComputedStyle(document.querySelector('.themed')!).color;
    });
    
    expect(color).toBe('rgb(0, 0, 255)'); // blue
});

// Solution 9: Testing Form-Associated Custom Elements
test('testing form-associated custom elements', async ({ page }) => {
    await page.setContent(`
        <html>
            <body>
                <form id="myForm">
                    <input type="text" name="username" class="username">
                    <button type="submit">Submit</button>
                </form>
                <p class="form-result"></p>
                <script>
                    document.getElementById('myForm').onsubmit = (e) => {
                        e.preventDefault();
                        const username = document.querySelector('.username').value;
                        document.querySelector('.form-result').textContent = 'Submitted: ' + username;
                    };
                </script>
            </body>
        </html>
    `);
    
    await page.fill('.username', 'testuser');
    await page.click('button[type="submit"]');
    await expect(page.locator('.form-result')).toHaveText('Submitted: testuser');
});

// Solution 10: Web Components Testing Best Practices
test('Web Components testing best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Test custom element registration
     * 2. Test Shadow DOM content
     * 3. Test slots and named slots
     * 4. Test attributes and properties
     * 5. Test custom events
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

