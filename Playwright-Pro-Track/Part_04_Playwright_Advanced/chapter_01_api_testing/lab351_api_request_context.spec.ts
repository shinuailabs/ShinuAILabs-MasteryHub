/**
 * Lab 351: API Request Context
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Using API request context:
 * 
 * - request fixture
 * - APIRequestContext
 * - HTTP methods
 * - Request options
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Use request fixture
 * 2. Make API calls
 * 3. Handle responses
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Basic GET Request
test('basic GET request', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');
    
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.id).toBe(1);
});

// Solution 2: GET with Query Parameters
test('GET with query parameters', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/posts', {
        params: {
            userId: 1,
        },
    });
    
    expect(response.ok()).toBeTruthy();
    const posts = await response.json();
    expect(posts.length).toBeGreaterThan(0);
});

// Solution 3: POST Request
test('POST request', async ({ request }) => {
    const response = await request.post('https://jsonplaceholder.typicode.com/posts', {
        data: {
            title: 'Test Post',
            body: 'Test Body',
            userId: 1,
        },
    });
    
    expect(response.status()).toBe(201);
    const data = await response.json();
    expect(data.title).toBe('Test Post');
});

// Solution 4: PUT Request
test('PUT request', async ({ request }) => {
    const response = await request.put('https://jsonplaceholder.typicode.com/posts/1', {
        data: {
            id: 1,
            title: 'Updated Title',
            body: 'Updated Body',
            userId: 1,
        },
    });
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.title).toBe('Updated Title');
});

// Solution 5: PATCH Request
test('PATCH request', async ({ request }) => {
    const response = await request.patch('https://jsonplaceholder.typicode.com/posts/1', {
        data: {
            title: 'Patched Title',
        },
    });
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.title).toBe('Patched Title');
});

// Solution 6: DELETE Request
test('DELETE request', async ({ request }) => {
    const response = await request.delete('https://jsonplaceholder.typicode.com/posts/1');
    
    expect(response.ok()).toBeTruthy();
});

// Solution 7: Request with Headers
test('request with headers', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/posts/1', {
        headers: {
            'Accept': 'application/json',
            'X-Custom-Header': 'custom-value',
        },
    });
    
    expect(response.ok()).toBeTruthy();
});

// Solution 8: Request with Timeout
test('request with timeout', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/posts/1', {
        timeout: 30000,
    });
    
    expect(response.ok()).toBeTruthy();
});

// Solution 9: Response Headers
test('response headers', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');
    
    const headers = response.headers();
    expect(headers['content-type']).toContain('application/json');
});

// Solution 10: Response Body Types
test('response body types', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');
    
    // JSON
    const json = await response.json();
    expect(json.id).toBe(1);
    
    // Text
    const response2 = await request.get('https://jsonplaceholder.typicode.com/posts/1');
    const text = await response2.text();
    expect(text).toContain('id');
});

// Solution 11: API Request Best Practices
test('API request best practices', async ({ request }) => {
    /*
     * Best Practices:
     * 1. Use request fixture for API tests
     * 2. Check response status
     * 3. Validate response body
     * 4. Handle errors gracefully
     * 5. Use appropriate HTTP methods
     */
    
    const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');
    expect(response.ok()).toBeTruthy();
});

