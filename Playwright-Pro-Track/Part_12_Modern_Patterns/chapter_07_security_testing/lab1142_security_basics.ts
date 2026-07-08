/**
 * Lab 1142: Security Testing Basics with Playwright
 *
 * CONCEPT:
 * Security testing identifies vulnerabilities in web applications. As a QA/SDET,
 * you should understand common security issues and how to test for them using
 * Playwright and other tools.
 *
 * BULLET POINTS:
 * - OWASP Top 10: Most critical web security risks
 * - XSS: Cross-Site Scripting attacks
 * - CSRF: Cross-Site Request Forgery
 * - SQL Injection: Database manipulation
 * - Security Headers: CSP, HSTS, X-Frame-Options
 *
 * EXAMPLES:
 * - Testing authentication flows
 * - Validating security headers
 * - Testing for XSS vulnerabilities
 */

import { test, expect, Page, APIRequestContext } from '@playwright/test';

// ============================================
// 1. Security Headers Validation
// ============================================

interface SecurityHeaders {
  'content-security-policy'?: string;
  'strict-transport-security'?: string;
  'x-frame-options'?: string;
  'x-content-type-options'?: string;
  'x-xss-protection'?: string;
  'referrer-policy'?: string;
}

class SecurityHeadersChecker {
  async checkHeaders(request: APIRequestContext, url: string): Promise<{
    passed: boolean;
    results: Record<string, { present: boolean; value?: string }>;
  }> {
    const response = await request.get(url);
    const headers = response.headers();

    const requiredHeaders = [
      'content-security-policy',
      'strict-transport-security',
      'x-frame-options',
      'x-content-type-options',
    ];

    const results: Record<string, { present: boolean; value?: string }> = {};
    let allPassed = true;

    for (const header of requiredHeaders) {
      const value = headers[header];
      results[header] = {
        present: !!value,
        value: value || undefined,
      };
      if (!value) allPassed = false;
    }

    return { passed: allPassed, results };
  }
}

test.describe('Security Headers', () => {
  test('should have required security headers', async ({ request }) => {
    const checker = new SecurityHeadersChecker();
    const { passed, results } = await checker.checkHeaders(
      request,
      'https://example.com'
    );

    console.log('Security Headers Check:', results);
    expect(passed).toBe(true);
  });

  test('should have Content-Security-Policy', async ({ request }) => {
    const response = await request.get('https://example.com');
    const csp = response.headers()['content-security-policy'];

    expect(csp).toBeDefined();
    // CSP should not allow unsafe-inline for scripts
    expect(csp).not.toContain("'unsafe-inline'");
  });

  test('should have HSTS header', async ({ request }) => {
    const response = await request.get('https://example.com');
    const hsts = response.headers()['strict-transport-security'];

    expect(hsts).toBeDefined();
    expect(hsts).toContain('max-age=');
  });
});

// ============================================
// 2. XSS (Cross-Site Scripting) Testing
// ============================================

const XSS_PAYLOADS = [
  '<script>alert("XSS")</script>',
  '<img src=x onerror=alert("XSS")>',
  '"><script>alert("XSS")</script>',
  "javascript:alert('XSS')",
  '<svg onload=alert("XSS")>',
  '{{constructor.constructor("alert(1)")()}}',
];

class XSSScanner {
  constructor(private page: Page) {}

  async testInputField(selector: string): Promise<{
    vulnerable: boolean;
    payload?: string;
  }> {
    for (const payload of XSS_PAYLOADS) {
      await this.page.locator(selector).fill(payload);
      await this.page.keyboard.press('Enter');

      // Check if script executed (dialog appeared)
      const dialogPromise = this.page.waitForEvent('dialog', { timeout: 1000 })
        .catch(() => null);

      const dialog = await dialogPromise;
      if (dialog) {
        await dialog.dismiss();
        return { vulnerable: true, payload };
      }

      // Check if payload is reflected unescaped
      const content = await this.page.content();
      if (content.includes(payload) && !content.includes(this.escapeHtml(payload))) {
        return { vulnerable: true, payload };
      }
    }

    return { vulnerable: false };
  }

  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}

test.describe('XSS Testing', () => {
  test('search input should not be vulnerable to XSS', async ({ page }) => {
    await page.goto('https://example.com/search');

    const scanner = new XSSScanner(page);
    const result = await scanner.testInputField('[name="q"]');

    expect(result.vulnerable).toBe(false);
  });
});

// ============================================
// 3. Authentication Security Testing
// ============================================

test.describe('Authentication Security', () => {
  test('should not expose sensitive data in URL', async ({ page }) => {
    await page.goto('https://example.com/login');

    await page.getByLabel('Email').fill('user@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Login' }).click();

    // Password should not be in URL
    expect(page.url()).not.toContain('password');
  });

  test('should have secure cookie settings', async ({ page, context }) => {
    await page.goto('https://example.com/login');

    // Login
    await page.getByLabel('Email').fill('user@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Login' }).click();

    // Check session cookie
    const cookies = await context.cookies();
    const sessionCookie = cookies.find(c => c.name.includes('session'));

    if (sessionCookie) {
      expect(sessionCookie.secure).toBe(true);
      expect(sessionCookie.httpOnly).toBe(true);
      expect(sessionCookie.sameSite).toBe('Strict');
    }
  });

  test('should lock account after failed attempts', async ({ page }) => {
    await page.goto('https://example.com/login');

    // Attempt multiple failed logins
    for (let i = 0; i < 5; i++) {
      await page.getByLabel('Email').fill('user@example.com');
      await page.getByLabel('Password').fill('wrongpassword');
      await page.getByRole('button', { name: 'Login' }).click();
      await page.waitForTimeout(500);
    }

    // Should show lockout message
    await expect(page.getByText(/locked|too many attempts/i)).toBeVisible();
  });
});

// ============================================
// 4. CSRF Testing
// ============================================

test.describe('CSRF Protection', () => {
  test('should include CSRF token in forms', async ({ page }) => {
    await page.goto('https://example.com/settings');

    // Check for CSRF token in form
    const csrfToken = await page.locator('input[name="_csrf"], input[name="csrf_token"]').count();
    expect(csrfToken).toBeGreaterThan(0);
  });

  test('should reject requests without CSRF token', async ({ request }) => {
    const response = await request.post('https://example.com/api/settings', {
      data: { setting: 'value' },
      // No CSRF token
    });

    expect(response.status()).toBe(403);
  });
});

// ============================================
// 5. SQL Injection Testing
// ============================================

const SQL_PAYLOADS = [
  "' OR '1'='1",
  "'; DROP TABLE users; --",
  "1' AND '1'='1",
  "admin'--",
  "1; SELECT * FROM users",
];

test.describe('SQL Injection', () => {
  test('login should not be vulnerable to SQL injection', async ({ page }) => {
    await page.goto('https://example.com/login');

    for (const payload of SQL_PAYLOADS) {
      await page.getByLabel('Email').fill(payload);
      await page.getByLabel('Password').fill('anything');
      await page.getByRole('button', { name: 'Login' }).click();

      // Should not login successfully with SQL injection
      await expect(page).not.toHaveURL(/dashboard|home/);

      // Should show error, not crash
      await expect(page.getByText(/invalid|error/i)).toBeVisible();
    }
  });
});

/**
 * EXERCISE:
 * 1. Run security header checks on your application
 * 2. Test all input fields for XSS vulnerabilities
 * 3. Verify authentication security (cookies, lockout)
 * 4. Check CSRF protection on all forms
 * 5. Test API endpoints for authorization bypass
 */

/**
 * CODING QUESTIONS & SOLUTIONS:
 *
 * Q1: What is the OWASP Top 10?
 * A1: A list of the 10 most critical web security risks:
 *     Injection, Broken Auth, Sensitive Data Exposure,
 *     XXE, Broken Access Control, Misconfiguration, XSS,
 *     Insecure Deserialization, Vulnerable Components, Logging.
 *
 * Q2: How do you test for XSS in Playwright?
 * A2: Inject XSS payloads into input fields, check if scripts
 *     execute (dialog events) or if payloads are reflected unescaped.
 */

/**
 * LEARNING:
 * - Security testing is essential for all web applications
 * - Automated tests catch common vulnerabilities
 * - Manual penetration testing is still needed
 * - Always test authentication and authorization
 *
 * ONE LINER:
 * "Security testing: Find vulnerabilities before attackers do."
 */

export { SecurityHeadersChecker, XSSScanner, XSS_PAYLOADS, SQL_PAYLOADS };
