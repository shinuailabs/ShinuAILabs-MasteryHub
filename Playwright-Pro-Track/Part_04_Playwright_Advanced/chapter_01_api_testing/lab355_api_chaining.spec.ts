/**
 * Lab 355: API Chaining
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Chaining API calls:
 * 
 * - Sequential requests
 * - Data passing
 * - Dependent requests
 * - Parallel requests
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Chain API calls
 * 2. Pass data between calls
 * 3. Handle dependencies
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Sequential API Calls
test('sequential API calls', async ({ request }) => {
    // First request
    const response1 = await request.get('https://jsonplaceholder.typicode.com/users/1');
    const user = await response1.json();
    
    // Second request using data from first
    const response2 = await request.get(`https://jsonplaceholder.typicode.com/posts?userId=${user.id}`);
    const posts = await response2.json();
    
    expect(posts.length).toBeGreaterThan(0);
    expect(posts[0].userId).toBe(user.id);
});

// Solution 2: Create and Retrieve
test('create and retrieve', async ({ request }) => {
    // Create resource
    const createResponse = await request.post('https://jsonplaceholder.typicode.com/posts', {
        data: {
            title: 'New Post',
            body: 'Post body',
            userId: 1,
        },
    });
    const created = await createResponse.json();
    
    // Retrieve created resource
    const getResponse = await request.get(`https://jsonplaceholder.typicode.com/posts/${created.id}`);
    expect(getResponse.ok()).toBeTruthy();
});

// Solution 3: CRUD Operations
test('CRUD operations', async ({ request }) => {
    // Create
    const createRes = await request.post('https://jsonplaceholder.typicode.com/posts', {
        data: { title: 'Test', body: 'Body', userId: 1 },
    });
    const created = await createRes.json();
    expect(createRes.status()).toBe(201);
    
    // Read
    const readRes = await request.get(`https://jsonplaceholder.typicode.com/posts/${created.id}`);
    expect(readRes.ok()).toBeTruthy();
    
    // Update
    const updateRes = await request.put(`https://jsonplaceholder.typicode.com/posts/${created.id}`, {
        data: { title: 'Updated', body: 'Updated Body', userId: 1 },
    });
    expect(updateRes.ok()).toBeTruthy();
    
    // Delete
    const deleteRes = await request.delete(`https://jsonplaceholder.typicode.com/posts/${created.id}`);
    expect(deleteRes.ok()).toBeTruthy();
});

// Solution 4: Parallel API Calls
test('parallel API calls', async ({ request }) => {
    // Make parallel requests
    const [usersRes, postsRes, commentsRes] = await Promise.all([
        request.get('https://jsonplaceholder.typicode.com/users'),
        request.get('https://jsonplaceholder.typicode.com/posts'),
        request.get('https://jsonplaceholder.typicode.com/comments'),
    ]);
    
    expect(usersRes.ok()).toBeTruthy();
    expect(postsRes.ok()).toBeTruthy();
    expect(commentsRes.ok()).toBeTruthy();
});

// Solution 5: Data Aggregation
test('data aggregation', async ({ request }) => {
    // Get user
    const userRes = await request.get('https://jsonplaceholder.typicode.com/users/1');
    const user = await userRes.json();
    
    // Get user's posts and todos in parallel
    const [postsRes, todosRes] = await Promise.all([
        request.get(`https://jsonplaceholder.typicode.com/posts?userId=${user.id}`),
        request.get(`https://jsonplaceholder.typicode.com/todos?userId=${user.id}`),
    ]);
    
    const posts = await postsRes.json();
    const todos = await todosRes.json();
    
    // Aggregate data
    const userData = {
        ...user,
        postsCount: posts.length,
        todosCount: todos.length,
    };
    
    expect(userData.postsCount).toBeGreaterThan(0);
    expect(userData.todosCount).toBeGreaterThan(0);
});

// Solution 6: Conditional Chaining
test('conditional chaining', async ({ request }) => {
    const userRes = await request.get('https://jsonplaceholder.typicode.com/users/1');
    const user = await userRes.json();
    
    // Conditional request based on user data
    if (user.id) {
        const postsRes = await request.get(`https://jsonplaceholder.typicode.com/posts?userId=${user.id}`);
        const posts = await postsRes.json();
        expect(posts.length).toBeGreaterThan(0);
    }
});

// Solution 7: Error Handling in Chain
test('error handling in chain', async ({ request }) => {
    try {
        const userRes = await request.get('https://jsonplaceholder.typicode.com/users/1');
        
        if (!userRes.ok()) {
            throw new Error('Failed to get user');
        }
        
        const user = await userRes.json();
        const postsRes = await request.get(`https://jsonplaceholder.typicode.com/posts?userId=${user.id}`);
        
        expect(postsRes.ok()).toBeTruthy();
    } catch (error) {
        console.error('Chain failed:', error);
        throw error;
    }
});

// Solution 8: Retry Logic
test('retry logic', async ({ request }) => {
    const maxRetries = 3;
    let response;
    
    for (let i = 0; i < maxRetries; i++) {
        response = await request.get('https://jsonplaceholder.typicode.com/posts/1');
        if (response.ok()) break;
        await new Promise(r => setTimeout(r, 1000));
    }
    
    expect(response?.ok()).toBeTruthy();
});

// Solution 9: API Chaining Best Practices
test('API chaining best practices', async ({ request }) => {
    /*
     * Best Practices:
     * 1. Handle errors at each step
     * 2. Use parallel calls when possible
     * 3. Validate data between calls
     * 4. Implement retry logic
     * 5. Clean up created resources
     */
    
    const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');
    expect(response.ok()).toBeTruthy();
});

