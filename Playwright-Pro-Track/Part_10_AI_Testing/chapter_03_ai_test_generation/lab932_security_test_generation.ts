/**
 * Lab 932: AI Security Test Generation
 *
 * CONCEPT:
 * AI can generate security tests that check for common vulnerabilities like
 * XSS, CSRF, SQL injection, and authentication bypasses. These tests help
 * identify security issues before they reach production.
 *
 * BULLET POINTS:
 * - Generate XSS vulnerability tests
 * - Test for SQL injection
 * - Verify CSRF protection
 * - Test authentication security
 * - Check authorization controls
 */

import { test, expect, Page } from '@playwright/test';

// Example 1: XSS vulnerability tests
test.describe('XSS Security Tests', () => {
  const xssPayloads = [
    '<script>alert("XSS")</script>',
    '<img src=x onerror=alert("XSS")>',
    '"><script>alert("XSS")</script>',
    "javascript:alert('XSS')",
    '<svg onload=alert("XSS")>',
  ];

  for (const payload of xssPayloads) {
    test(`should sanitize XSS payload: ${payload.substring(0, 20)}...`, async ({ page }) => {
      await page.goto('/search');

      // Enter XSS payload in search
      await page.fill('[data-testid="search-input"]', payload);
      await page.click('[data-testid="search-button"]');

      // Check that script is not executed
      const alertTriggered = await page.evaluate(() => {
        return (window as unknown as { xssTriggered?: boolean }).xssTriggered === true;
      });
      expect(alertTriggered).toBeFalsy();

      // Check that payload is escaped in output
      const content = await page.content();
      expect(content).not.toContain('<script>alert');
    });
  }
});

// Example 2: SQL Injection tests
test.describe('SQL Injection Tests', () => {
  const sqlPayloads = [
    "' OR '1'='1",
    "'; DROP TABLE users; --",
    "1' OR '1'='1' --",
    "admin'--",
    "1; SELECT * FROM users",
  ];

  for (const payload of sqlPayloads) {
    test(`should prevent SQL injection: ${payload}`, async ({ page }) => {
      await page.goto('/login');

      await page.fill('[data-testid="email"]', payload);
      await page.fill('[data-testid="password"]', 'password');
      await page.click('[data-testid="login-button"]');

      // Should not bypass authentication
      await expect(page).not.toHaveURL('/dashboard');

      // Should show error message
      await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    });
  }
});

// Example 3: Authentication security tests
test.describe('Authentication Security', () => {
  test('should enforce password complexity', async ({ page }) => {
    await page.goto('/register');

    const weakPasswords = ['123456', 'password', 'qwerty', 'abc123'];

    for (const password of weakPasswords) {
      await page.fill('[data-testid="password"]', password);
      await page.fill('[data-testid="confirm-password"]', password);
      await page.click('[data-testid="register-button"]');

      await expect(page.locator('[data-testid="password-error"]')).toBeVisible();
    }
  });

  test('should lock account after failed attempts', async ({ page }) => {
    await page.goto('/login');

    // Attempt login 5 times with wrong password
    for (let i = 0; i < 5; i++) {
      await page.fill('[data-testid="email"]', 'user@example.com');
      await page.fill('[data-testid="password"]', 'wrongpassword');
      await page.click('[data-testid="login-button"]');
    }

    // Account should be locked
    await expect(page.locator('[data-testid="account-locked"]')).toBeVisible();
  });

  test('should invalidate session on logout', async ({ page, context }) => {
    // Login
    await page.goto('/login');
    await page.fill('[data-testid="email"]', 'user@example.com');
    await page.fill('[data-testid="password"]', 'ValidPass123!');
    await page.click('[data-testid="login-button"]');
    await expect(page).toHaveURL('/dashboard');

    // Get session cookie
    const cookies = await context.cookies();
    const sessionCookie = cookies.find((c) => c.name === 'session');

    // Logout
    await page.click('[data-testid="logout-button"]');

    // Try to access protected page with old session
    if (sessionCookie) {
      await context.addCookies([sessionCookie]);
    }
    await page.goto('/dashboard');

    // Should redirect to login
    await expect(page).toHaveURL('/login');
  });
});

// Example 4: Authorization tests
test.describe('Authorization Tests', () => {
  test('should prevent access to admin pages for regular users', async ({ page }) => {
    // Login as regular user
    await page.goto('/login');
    await page.fill('[data-testid="email"]', 'user@example.com');
    await page.fill('[data-testid="password"]', 'UserPass123!');
    await page.click('[data-testid="login-button"]');

    // Try to access admin page
    await page.goto('/admin');

    // Should be denied
    await expect(page).toHaveURL('/unauthorized');
  });

  test('should prevent IDOR attacks', async ({ page }) => {
    // Login as user A
    await page.goto('/login');
    await page.fill('[data-testid="email"]', 'userA@example.com');
    await page.fill('[data-testid="password"]', 'UserAPass123!');
    await page.click('[data-testid="login-button"]');

    // Try to access user B's data
    const response = await page.goto('/api/users/userB/profile');

    // Should be forbidden
    expect(response?.status()).toBe(403);
  });
});

/**
 * EXERCISE:
 * 1. Run XSS tests on your forms
 * 2. Test authentication security
 * 3. Verify authorization controls
 * 4. Check for common vulnerabilities
 *
 * LEARNING:
 * - Security testing prevents vulnerabilities
 * - Test common attack vectors
 * - Verify authentication and authorization
 * - Include security tests in CI
 *
 * ONE LINER:
 * "AI generates security tests that find vulnerabilities before attackers do."
 */

