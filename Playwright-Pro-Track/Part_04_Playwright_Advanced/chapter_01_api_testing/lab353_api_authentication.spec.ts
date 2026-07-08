/**
 * Lab 353: API Authentication
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * API authentication methods:
 * 
 * - Bearer tokens
 * - Basic auth
 * - API keys
 * - OAuth
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Use bearer token auth
 * 2. Use basic auth
 * 3. Use API keys
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect, request as apiRequest } from '@playwright/test';

// Solution 1: Bearer Token Authentication
test('bearer token authentication', async ({ request }) => {
    const token = 'your-bearer-token';
    
    const response = await request.get('https://jsonplaceholder.typicode.com/posts/1', {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    
    expect(response.ok()).toBeTruthy();
});

// Solution 2: Basic Authentication
test('basic authentication', async ({ request }) => {
    const username = 'user';
    const password = 'pass';
    const credentials = Buffer.from(`${username}:${password}`).toString('base64');
    
    const response = await request.get('https://jsonplaceholder.typicode.com/posts/1', {
        headers: {
            'Authorization': `Basic ${credentials}`,
        },
    });
    
    expect(response.ok()).toBeTruthy();
});

// Solution 3: API Key in Header
test('API key in header', async ({ request }) => {
    const apiKey = 'your-api-key';
    
    const response = await request.get('https://jsonplaceholder.typicode.com/posts/1', {
        headers: {
            'X-API-Key': apiKey,
        },
    });
    
    expect(response.ok()).toBeTruthy();
});

// Solution 4: API Key in Query Parameter
test('API key in query parameter', async ({ request }) => {
    const apiKey = 'your-api-key';
    
    const response = await request.get('https://jsonplaceholder.typicode.com/posts/1', {
        params: {
            api_key: apiKey,
        },
    });
    
    expect(response.ok()).toBeTruthy();
});

// Solution 5: Create Authenticated Context
test('create authenticated context', async () => {
    const context = await apiRequest.newContext({
        baseURL: 'https://jsonplaceholder.typicode.com',
        extraHTTPHeaders: {
            'Authorization': 'Bearer your-token',
            'Accept': 'application/json',
        },
    });
    
    const response = await context.get('/posts/1');
    expect(response.ok()).toBeTruthy();
    
    await context.dispose();
});

// Solution 6: Login and Get Token
test('login and get token', async ({ request }) => {
    // Simulate login to get token
    const loginResponse = await request.post('https://jsonplaceholder.typicode.com/posts', {
        data: {
            username: 'user',
            password: 'pass',
        },
    });
    
    // In real scenario, extract token from response
    // const { token } = await loginResponse.json();
    
    expect(loginResponse.status()).toBe(201);
});

// Solution 7: Refresh Token
test('refresh token', async ({ request }) => {
    const refreshToken = 'your-refresh-token';
    
    // Simulate token refresh
    const response = await request.post('https://jsonplaceholder.typicode.com/posts', {
        data: {
            refresh_token: refreshToken,
        },
    });
    
    expect(response.status()).toBe(201);
});

// Solution 8: Cookie Authentication
test('cookie authentication', async ({ request }) => {
    // Set cookies for authentication
    const response = await request.get('https://jsonplaceholder.typicode.com/posts/1', {
        headers: {
            'Cookie': 'session=abc123; auth=xyz789',
        },
    });
    
    expect(response.ok()).toBeTruthy();
});

// Solution 9: OAuth2 Client Credentials
test('OAuth2 client credentials', async ({ request }) => {
    /*
     * OAuth2 flow:
     * 1. Request token with client credentials
     * 2. Use token for API calls
     */
    
    // Simulate token request
    const tokenResponse = await request.post('https://jsonplaceholder.typicode.com/posts', {
        data: {
            grant_type: 'client_credentials',
            client_id: 'your-client-id',
            client_secret: 'your-client-secret',
        },
    });
    
    expect(tokenResponse.status()).toBe(201);
});

// Solution 10: Environment-Based Auth
test('environment based auth', async ({ request }) => {
    const token = process.env.API_TOKEN || 'default-token';
    
    const response = await request.get('https://jsonplaceholder.typicode.com/posts/1', {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    
    expect(response.ok()).toBeTruthy();
});

// Solution 11: API Authentication Best Practices
test('API authentication best practices', async ({ request }) => {
    /*
     * Best Practices:
     * 1. Store tokens securely
     * 2. Use environment variables
     * 3. Handle token expiration
     * 4. Use HTTPS
     * 5. Don't log sensitive data
     */
    
    const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');
    expect(response.ok()).toBeTruthy();
});

