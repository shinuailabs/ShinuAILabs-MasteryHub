/**
 * Lab 927: AI Test Data Generation
 *
 * CONCEPT:
 * AI can generate realistic, diverse test data including edge cases, boundary
 * values, and domain-specific data. This ensures comprehensive test coverage
 * without manual data creation.
 *
 * BULLET POINTS:
 * - Generate realistic user profiles
 * - Create boundary value test data
 * - Produce domain-specific data (addresses, payments)
 * - Generate internationalized test data
 * - Create data for negative testing
 */

import { test, expect } from '@playwright/test';

// Example 1: AI-generated user test data
interface TestUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: string;
}

// AI generates diverse, realistic test users
const testUsers: TestUser[] = [
  {
    email: 'john.doe@example.com',
    password: 'SecurePass123!',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+1-555-123-4567',
    dateOfBirth: '1990-05-15',
  },
  {
    email: "o'connor.mary@test.co.uk",
    password: 'P@ssw0rd!2024',
    firstName: "Mary",
    lastName: "O'Connor",
    phone: '+44-20-7946-0958',
    dateOfBirth: '1985-12-31',
  },
  {
    email: 'müller.hans@beispiel.de',
    password: 'Gërmän123!',
    firstName: 'Hans',
    lastName: 'Müller',
    phone: '+49-30-12345678',
    dateOfBirth: '2000-01-01',
  },
];

// Example 2: Boundary value test data
const boundaryTestData = {
  email: {
    minLength: 'a@b.co', // Minimum valid email
    maxLength: `${'a'.repeat(64)}@${'b'.repeat(63)}.com`, // Max local + domain
    specialChars: 'user+tag@example.com',
    unicode: 'пользователь@example.com',
  },
  password: {
    minLength: 'Pass123!', // 8 chars minimum
    maxLength: 'P'.repeat(128), // 128 chars maximum
    allRequirements: 'Aa1!Aa1!', // Upper, lower, number, special
    onlyLower: 'password', // Should fail
    noSpecial: 'Password123', // Should fail
  },
  quantity: {
    zero: 0,
    one: 1,
    max: 999,
    negative: -1,
    decimal: 1.5,
  },
};

// Example 3: AI-generated address data
interface TestAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

const testAddresses: TestAddress[] = [
  {
    street: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    country: 'USA',
  },
  {
    street: '456 Elm Ave, Apt 7B',
    city: 'Los Angeles',
    state: 'CA',
    zip: '90210',
    country: 'USA',
  },
  {
    street: '10 Downing Street',
    city: 'London',
    state: '',
    zip: 'SW1A 2AA',
    country: 'UK',
  },
  {
    street: '1-2-3 Shibuya',
    city: 'Tokyo',
    state: '',
    zip: '150-0002',
    country: 'Japan',
  },
];

// Example 4: AI-generated payment test data
const paymentTestData = {
  validCards: [
    { number: '4111111111111111', type: 'visa', cvv: '123', expiry: '12/25' },
    { number: '5500000000000004', type: 'mastercard', cvv: '456', expiry: '06/26' },
    { number: '340000000000009', type: 'amex', cvv: '1234', expiry: '03/27' },
  ],
  invalidCards: [
    { number: '4111111111111112', reason: 'Invalid checksum' },
    { number: '1234567890123456', reason: 'Invalid prefix' },
    { number: '411111111111', reason: 'Too short' },
  ],
  declinedCards: [
    { number: '4000000000000002', reason: 'Card declined' },
    { number: '4000000000009995', reason: 'Insufficient funds' },
  ],
};

// Example 5: Data generation function
function generateTestData<T>(template: T, count: number): T[] {
  const results: T[] = [];
  for (let i = 0; i < count; i++) {
    const item = { ...template } as Record<string, unknown>;
    // Modify fields to create variations
    for (const key of Object.keys(item)) {
      if (typeof item[key] === 'string') {
        item[key] = `${item[key]}_${i}`;
      }
    }
    results.push(item as T);
  }
  return results;
}

// Tests using generated data
test.describe('Registration with AI-generated data', () => {
  for (const user of testUsers) {
    test(`register user: ${user.email}`, async ({ page }) => {
      await page.goto('/register');
      await page.fill('[data-testid="email"]', user.email);
      await page.fill('[data-testid="password"]', user.password);
      await page.fill('[data-testid="first-name"]', user.firstName);
      await page.fill('[data-testid="last-name"]', user.lastName);
      await page.click('[data-testid="submit"]');
      await expect(page.locator('[data-testid="success"]')).toBeVisible();
    });
  }
});

/**
 * EXERCISE:
 * 1. Generate test data for your domain
 * 2. Include boundary values and edge cases
 * 3. Add internationalized data
 * 4. Create negative test data
 *
 * LEARNING:
 * - AI generates diverse, realistic test data
 * - Include boundary values for thorough testing
 * - Consider internationalization
 * - Generate both valid and invalid data
 *
 * ONE LINER:
 * "AI creates the test data variety you need - from happy paths to edge cases."
 */

export { testUsers, boundaryTestData, testAddresses, paymentTestData, generateTestData };

