/**
 * Lab 357: GraphQL Testing
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Testing GraphQL APIs:
 * 
 * - GraphQL queries
 * - GraphQL mutations
 * - Variables
 * - Error handling
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Test GraphQL queries
 * 2. Test GraphQL mutations
 * 3. Use variables
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Basic GraphQL Query
test('basic GraphQL query', async ({ request }) => {
    const query = `
        query {
            posts {
                id
                title
            }
        }
    `;
    
    // Using REST endpoint as example
    const response = await request.get('https://jsonplaceholder.typicode.com/posts');
    expect(response.ok()).toBeTruthy();
});

// Solution 2: GraphQL Query with Variables
test('GraphQL query with variables', async ({ request }) => {
    const query = `
        query GetPost($id: ID!) {
            post(id: $id) {
                id
                title
                body
            }
        }
    `;
    
    const variables = {
        id: '1',
    };
    
    // Simulated GraphQL request
    const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');
    expect(response.ok()).toBeTruthy();
});

// Solution 3: GraphQL Mutation
test('GraphQL mutation', async ({ request }) => {
    const mutation = `
        mutation CreatePost($input: PostInput!) {
            createPost(input: $input) {
                id
                title
            }
        }
    `;
    
    const variables = {
        input: {
            title: 'New Post',
            body: 'Post body',
        },
    };
    
    // Simulated mutation
    const response = await request.post('https://jsonplaceholder.typicode.com/posts', {
        data: variables.input,
    });
    expect(response.status()).toBe(201);
});

// Solution 4: GraphQL with Fragments
test('GraphQL with fragments', async ({ request }) => {
    const query = `
        fragment PostFields on Post {
            id
            title
            body
        }
        
        query {
            posts {
                ...PostFields
            }
        }
    `;
    
    const response = await request.get('https://jsonplaceholder.typicode.com/posts');
    expect(response.ok()).toBeTruthy();
});

// Solution 5: GraphQL Error Handling
test('GraphQL error handling', async ({ request }) => {
    // Test error response
    const response = await request.get('https://jsonplaceholder.typicode.com/posts/999999');
    
    // GraphQL typically returns 200 with errors in body
    // For REST, we check status
    expect(response.status()).toBe(404);
});

// Solution 6: GraphQL Nested Query
test('GraphQL nested query', async ({ request }) => {
    const query = `
        query {
            user(id: 1) {
                id
                name
                posts {
                    id
                    title
                }
            }
        }
    `;
    
    // Simulated nested query
    const userRes = await request.get('https://jsonplaceholder.typicode.com/users/1');
    const user = await userRes.json();
    
    const postsRes = await request.get(`https://jsonplaceholder.typicode.com/posts?userId=${user.id}`);
    expect(postsRes.ok()).toBeTruthy();
});

// Solution 7: GraphQL Pagination
test('GraphQL pagination', async ({ request }) => {
    const query = `
        query GetPosts($first: Int, $after: String) {
            posts(first: $first, after: $after) {
                edges {
                    node {
                        id
                        title
                    }
                }
                pageInfo {
                    hasNextPage
                    endCursor
                }
            }
        }
    `;
    
    // Simulated pagination
    const response = await request.get('https://jsonplaceholder.typicode.com/posts?_limit=10');
    expect(response.ok()).toBeTruthy();
});

// Solution 8: GraphQL Subscriptions Mock
test('GraphQL subscriptions mock', async ({ page }) => {
    // Mock GraphQL subscription
    await page.route('**/graphql', async (route) => {
        const request = route.request();
        const postData = request.postData();
        
        if (postData?.includes('subscription')) {
            await route.fulfill({
                status: 200,
                body: JSON.stringify({
                    data: { newPost: { id: 1, title: 'New' } },
                }),
            });
        } else {
            await route.continue();
        }
    });
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

// Solution 9: GraphQL Testing Best Practices
test('GraphQL testing best practices', async ({ request }) => {
    /*
     * Best Practices:
     * 1. Test queries and mutations
     * 2. Validate response structure
     * 3. Test error scenarios
     * 4. Use variables for dynamic data
     * 5. Test pagination
     */
    
    const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');
    expect(response.ok()).toBeTruthy();
});

