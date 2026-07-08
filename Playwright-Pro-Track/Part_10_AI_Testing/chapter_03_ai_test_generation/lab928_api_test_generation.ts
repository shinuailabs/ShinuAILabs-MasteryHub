/**
 * Lab 928: AI API Test Generation
 *
 * CONCEPT:
 * AI can generate comprehensive API tests from OpenAPI/Swagger specs, API
 * documentation, or example requests. This accelerates API test coverage
 * and ensures consistent testing patterns.
 *
 * BULLET POINTS:
 * - Generate tests from OpenAPI specs
 * - Create tests from API documentation
 * - Cover all HTTP methods and status codes
 * - Generate authentication tests
 * - Test request/response validation
 */

import { test, expect, APIRequestContext } from '@playwright/test';

// Example 1: AI-generated API tests from OpenAPI spec
/*
OpenAPI Spec snippet:
paths:
  /api/users:
    post:
      summary: Create user
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [email, password]
              properties:
                email: { type: string, format: email }
                password: { type: string, minLength: 8 }
      responses:
        201: { description: User created }
        400: { description: Validation error }
        409: { description: Email already exists }
*/

test.describe('Users API - AI Generated', () => {
  let request: APIRequestContext;

  test.beforeAll(async ({ playwright }) => {
    request = await playwright.request.newContext({
      baseURL: 'https://api.example.com',
    });
  });

  test.describe('POST /api/users', () => {
    test('201 - should create user with valid data', async () => {
      const response = await request.post('/api/users', {
        data: {
          email: `test-${Date.now()}@example.com`,
          password: 'SecurePass123!',
        },
      });

      expect(response.status()).toBe(201);
      const body = await response.json();
      expect(body).toHaveProperty('id');
      expect(body).toHaveProperty('email');
      expect(body).not.toHaveProperty('password');
    });

    test('400 - should reject invalid email format', async () => {
      const response = await request.post('/api/users', {
        data: {
          email: 'invalid-email',
          password: 'SecurePass123!',
        },
      });

      expect(response.status()).toBe(400);
      const body = await response.json();
      expect(body.errors).toContainEqual(
        expect.objectContaining({ field: 'email' })
      );
    });

    test('400 - should reject short password', async () => {
      const response = await request.post('/api/users', {
        data: {
          email: 'test@example.com',
          password: 'short',
        },
      });

      expect(response.status()).toBe(400);
      const body = await response.json();
      expect(body.errors).toContainEqual(
        expect.objectContaining({ field: 'password' })
      );
    });

    test('409 - should reject duplicate email', async () => {
      const email = `duplicate-${Date.now()}@example.com`;

      // Create first user
      await request.post('/api/users', {
        data: { email, password: 'SecurePass123!' },
      });

      // Try to create duplicate
      const response = await request.post('/api/users', {
        data: { email, password: 'DifferentPass123!' },
      });

      expect(response.status()).toBe(409);
    });
  });

  test.describe('GET /api/users/:id', () => {
    test('200 - should return user by ID', async () => {
      // Create user first
      const createResponse = await request.post('/api/users', {
        data: {
          email: `get-test-${Date.now()}@example.com`,
          password: 'SecurePass123!',
        },
      });
      const { id } = await createResponse.json();

      // Get user
      const response = await request.get(`/api/users/${id}`);
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.id).toBe(id);
    });

    test('404 - should return 404 for non-existent user', async () => {
      const response = await request.get('/api/users/non-existent-id');
      expect(response.status()).toBe(404);
    });
  });

  test.describe('Authentication', () => {
    test('401 - should reject request without auth token', async () => {
      const response = await request.get('/api/users/me');
      expect(response.status()).toBe(401);
    });

    test('403 - should reject request with invalid token', async () => {
      const response = await request.get('/api/users/me', {
        headers: { Authorization: 'Bearer invalid-token' },
      });
      expect(response.status()).toBe(403);
    });
  });
});

// Example 2: API test data generator
interface APITestCase {
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  body?: Record<string, unknown>;
  expectedStatus: number;
  expectedBody?: Record<string, unknown>;
}

const apiTestCases: APITestCase[] = [
  {
    name: 'Create valid user',
    method: 'POST',
    endpoint: '/api/users',
    body: { email: 'test@example.com', password: 'Pass123!' },
    expectedStatus: 201,
  },
  {
    name: 'Get all users',
    method: 'GET',
    endpoint: '/api/users',
    expectedStatus: 200,
  },
];

/**
 * EXERCISE:
 * 1. Take an API endpoint from your project
 * 2. Generate comprehensive tests with AI
 * 3. Cover all status codes and edge cases
 * 4. Add authentication tests
 *
 * LEARNING:
 * - AI generates tests for all HTTP methods
 * - Cover success and error status codes
 * - Test authentication and authorization
 * - Validate request/response schemas
 *
 * ONE LINER:
 * "AI reads your API spec and writes tests for every endpoint and status code."
 */

export { apiTestCases };

