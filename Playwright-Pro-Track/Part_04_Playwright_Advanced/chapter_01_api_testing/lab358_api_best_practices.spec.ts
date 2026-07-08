/**
 * Lab 358: API Testing Best Practices
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Best practices for API testing:
 * 
 * - Test organization
 * - Error handling
 * - Data management
 * - Performance
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Apply API testing best practices
 * 2. Organize API tests
 * 3. Handle errors properly
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect, request as apiRequest } from '@playwright/test';

// Solution 1: Reusable API Context
test.describe('API Tests with Shared Context', () => {
    let context: any;
    
    test.beforeAll(async () => {
        context = await apiRequest.newContext({
            baseURL: 'https://jsonplaceholder.typicode.com',
            extraHTTPHeaders: {
                'Accept': 'application/json',
            },
        });
    });
    
    test.afterAll(async () => {
        await context.dispose();
    });
    
    test('use shared context', async () => {
        const response = await context.get('/posts/1');
        expect(response.ok()).toBeTruthy();
    });
});

// Solution 2: Response Validation Helper
async function validateResponse(response: any, expectedStatus: number = 200) {
    expect(response.status()).toBe(expectedStatus);
    expect(response.ok()).toBe(expectedStatus >= 200 && expectedStatus < 300);
    return response.json();
}

test('response validation helper', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');
    const data = await validateResponse(response, 200);
    expect(data.id).toBe(1);
});

// Solution 3: Error Handling Pattern
test('error handling pattern', async ({ request }) => {
    try {
        const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');
        
        if (!response.ok()) {
            const error = await response.json();
            throw new Error(`API Error: ${error.message || response.status()}`);
        }
        
        const data = await response.json();
        expect(data.id).toBe(1);
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
});

// Solution 4: Test Data Factory
function createTestPost(overrides = {}) {
    return {
        title: 'Test Post',
        body: 'Test Body',
        userId: 1,
        ...overrides,
    };
}

test('test data factory', async ({ request }) => {
    const postData = createTestPost({ title: 'Custom Title' });
    
    const response = await request.post('https://jsonplaceholder.typicode.com/posts', {
        data: postData,
    });
    
    expect(response.status()).toBe(201);
    const created = await response.json();
    expect(created.title).toBe('Custom Title');
});

// Solution 5: Retry Mechanism
async function retryRequest(requestFn: () => Promise<any>, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await requestFn();
            if (response.ok()) return response;
        } catch (error) {
            if (i === maxRetries - 1) throw error;
        }
        await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
}

test('retry mechanism', async ({ request }) => {
    const response = await retryRequest(() => 
        request.get('https://jsonplaceholder.typicode.com/posts/1')
    );
    expect(response?.ok()).toBeTruthy();
});

// Solution 6: Response Time Validation
test('response time validation', async ({ request }) => {
    const startTime = Date.now();
    const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');
    const endTime = Date.now();
    
    const responseTime = endTime - startTime;
    console.log(`Response time: ${responseTime}ms`);
    
    expect(response.ok()).toBeTruthy();
    expect(responseTime).toBeLessThan(5000); // 5 seconds max
});

// Solution 7: Schema Validation
test('schema validation', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');
    const data = await response.json();
    
    // Validate schema
    const requiredFields = ['id', 'title', 'body', 'userId'];
    for (const field of requiredFields) {
        expect(data).toHaveProperty(field);
    }
    
    // Validate types
    expect(typeof data.id).toBe('number');
    expect(typeof data.title).toBe('string');
});

// Solution 8: Environment Configuration
test('environment configuration', async ({ request }) => {
    const baseUrl = process.env.API_BASE_URL || 'https://jsonplaceholder.typicode.com';
    
    const response = await request.get(`${baseUrl}/posts/1`);
    expect(response.ok()).toBeTruthy();
});

// Solution 9: Logging and Debugging
test('logging and debugging', async ({ request }) => {
    const url = 'https://jsonplaceholder.typicode.com/posts/1';
    console.log(`Making request to: ${url}`);
    
    const response = await request.get(url);
    console.log(`Response status: ${response.status()}`);
    console.log(`Response headers:`, response.headers());
    
    const data = await response.json();
    console.log(`Response body:`, JSON.stringify(data, null, 2));
    
    expect(response.ok()).toBeTruthy();
});

// Solution 10: API Testing Best Practices Summary
test('API testing best practices summary', async ({ request }) => {
    /*
     * Best Practices Summary:
     * 
     * 1. Organization:
     *    - Group related tests
     *    - Use shared contexts
     *    - Create helper functions
     * 
     * 2. Validation:
     *    - Check status codes
     *    - Validate response schema
     *    - Verify data types
     * 
     * 3. Error Handling:
     *    - Handle all error cases
     *    - Implement retry logic
     *    - Log errors properly
     * 
     * 4. Performance:
     *    - Monitor response times
     *    - Use parallel requests
     *    - Optimize test data
     * 
     * 5. Maintenance:
     *    - Use data factories
     *    - Environment configuration
     *    - Clean up test data
     */
    
    const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');
    expect(response.ok()).toBeTruthy();
});

