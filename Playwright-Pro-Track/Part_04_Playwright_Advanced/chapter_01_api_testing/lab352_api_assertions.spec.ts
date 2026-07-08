/**
 * Lab 352: API Assertions
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Asserting API responses:
 * 
 * - Status assertions
 * - Body assertions
 * - Header assertions
 * - Schema validation
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Assert response status
 * 2. Assert response body
 * 3. Validate response schema
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Status Code Assertions
test('status code assertions', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');
    
    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBeGreaterThanOrEqual(200);
    expect(response.status()).toBeLessThan(300);
});

// Solution 2: Response Body Assertions
test('response body assertions', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');
    const data = await response.json();
    
    expect(data).toHaveProperty('id');
    expect(data).toHaveProperty('title');
    expect(data).toHaveProperty('body');
    expect(data).toHaveProperty('userId');
});

// Solution 3: Value Assertions
test('value assertions', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');
    const data = await response.json();
    
    expect(data.id).toBe(1);
    expect(data.userId).toBe(1);
    expect(data.title).toBeTruthy();
    expect(data.body).toBeTruthy();
});

// Solution 4: Array Assertions
test('array assertions', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/posts');
    const posts = await response.json();
    
    expect(Array.isArray(posts)).toBeTruthy();
    expect(posts.length).toBeGreaterThan(0);
    expect(posts).toHaveLength(100);
});

// Solution 5: Object Structure Assertions
test('object structure assertions', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');
    const data = await response.json();
    
    expect(data).toMatchObject({
        id: 1,
        userId: 1,
    });
});

// Solution 6: Type Assertions
test('type assertions', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');
    const data = await response.json();
    
    expect(typeof data.id).toBe('number');
    expect(typeof data.title).toBe('string');
    expect(typeof data.body).toBe('string');
    expect(typeof data.userId).toBe('number');
});

// Solution 7: Header Assertions
test('header assertions', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');
    const headers = response.headers();
    
    expect(headers['content-type']).toContain('application/json');
    expect(headers).toHaveProperty('content-type');
});

// Solution 8: Negative Assertions
test('negative assertions', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/posts/999999');
    
    expect(response.status()).toBe(404);
    expect(response.ok()).toBeFalsy();
});

// Solution 9: Array Item Assertions
test('array item assertions', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/posts');
    const posts = await response.json();
    
    // Check first item
    expect(posts[0]).toHaveProperty('id');
    expect(posts[0]).toHaveProperty('title');
    
    // Check all items have required properties
    posts.forEach((post: any) => {
        expect(post).toHaveProperty('id');
        expect(post).toHaveProperty('title');
        expect(post).toHaveProperty('body');
        expect(post).toHaveProperty('userId');
    });
});

// Solution 10: String Assertions
test('string assertions', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');
    const data = await response.json();
    
    expect(data.title).toBeTruthy();
    expect(data.title.length).toBeGreaterThan(0);
    expect(data.body).toContain(' ');
});

// Solution 11: Custom Assertions
test('custom assertions', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');
    const data = await response.json();
    
    // Custom validation function
    const isValidPost = (post: any) => {
        return post.id > 0 && post.title && post.body && post.userId > 0;
    };
    
    expect(isValidPost(data)).toBeTruthy();
});

// Solution 12: API Assertion Best Practices
test('API assertion best practices', async ({ request }) => {
    /*
     * Best Practices:
     * 1. Always check status code
     * 2. Validate response structure
     * 3. Check required fields
     * 4. Validate data types
     * 5. Test error responses
     */
    
    const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data).toHaveProperty('id');
});

