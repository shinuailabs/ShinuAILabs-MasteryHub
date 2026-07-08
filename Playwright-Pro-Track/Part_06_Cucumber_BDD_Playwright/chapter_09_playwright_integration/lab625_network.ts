/**
 * Lab 625: Network Interception
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Network handling in Cucumber:
 * 
 * - Route interception
 * - Request mocking
 * - Response modification
 * - Network monitoring
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Intercept requests
 * 2. Mock responses
 * 3. Monitor network
 *
 * =====================
 * SOLUTION:
 * =====================
 */

import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import { expect, Route, Request } from '@playwright/test';

// Solution 1: Setup Network Monitoring
Before({ tags: '@network' }, async function () {
    this.networkRequests = [];
    this.networkResponses = [];
    
    // Monitor all requests
    this.page.on('request', (request: Request) => {
        this.networkRequests.push({
            url: request.url(),
            method: request.method(),
            headers: request.headers(),
            postData: request.postData(),
        });
    });
    
    // Monitor all responses
    this.page.on('response', async (response) => {
        this.networkResponses.push({
            url: response.url(),
            status: response.status(),
            headers: response.headers(),
        });
    });
});

// Solution 2: Mock API Response
Given('I mock the API {string} to return:', async function (endpoint: string, docString: string) {
    const mockData = JSON.parse(docString);
    
    await this.page.route(`**${endpoint}`, async (route: Route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(mockData),
        });
    });
});

// Solution 3: Mock API Error
Given('I mock the API {string} to return error {int}', async function (endpoint: string, status: number) {
    await this.page.route(`**${endpoint}`, async (route: Route) => {
        await route.fulfill({
            status,
            contentType: 'application/json',
            body: JSON.stringify({ error: 'Mocked error' }),
        });
    });
});

// Solution 4: Delay Response
Given('I mock the API {string} with {int}ms delay', async function (endpoint: string, delay: number) {
    await this.page.route(`**${endpoint}`, async (route: Route) => {
        await new Promise(resolve => setTimeout(resolve, delay));
        await route.continue();
    });
});

// Solution 5: Block Requests
Given('I block requests to {string}', async function (pattern: string) {
    await this.page.route(pattern, async (route: Route) => {
        await route.abort();
    });
});

// Solution 6: Modify Request Headers
Given('I add header {string}: {string} to all requests', async function (name: string, value: string) {
    await this.page.route('**/*', async (route: Route) => {
        const headers = {
            ...route.request().headers(),
            [name]: value,
        };
        await route.continue({ headers });
    });
});

// Solution 7: Wait for Network Request
When('I wait for request to {string}', async function (urlPattern: string) {
    this.capturedRequest = await this.page.waitForRequest(urlPattern);
});

When('I wait for response from {string}', async function (urlPattern: string) {
    this.capturedResponse = await this.page.waitForResponse(urlPattern);
});

// Solution 8: Verify Request Was Made
Then('a request should have been made to {string}', async function (urlPattern: string) {
    const regex = new RegExp(urlPattern);
    const found = this.networkRequests.some((req: any) => regex.test(req.url));
    expect(found).toBe(true);
});

Then('a {word} request should have been made to {string}', async function (method: string, urlPattern: string) {
    const regex = new RegExp(urlPattern);
    const found = this.networkRequests.some(
        (req: any) => regex.test(req.url) && req.method === method.toUpperCase()
    );
    expect(found).toBe(true);
});

// Solution 9: Verify Request Body
Then('the request to {string} should contain:', async function (urlPattern: string, docString: string) {
    const regex = new RegExp(urlPattern);
    const request = this.networkRequests.find((req: any) => regex.test(req.url));
    
    expect(request).toBeDefined();
    
    const expectedData = JSON.parse(docString);
    const actualData = JSON.parse(request.postData || '{}');
    
    for (const [key, value] of Object.entries(expectedData)) {
        expect(actualData[key]).toBe(value);
    }
});

// Solution 10: Verify Response Status
Then('the response from {string} should have status {int}', async function (urlPattern: string, status: number) {
    const regex = new RegExp(urlPattern);
    const response = this.networkResponses.find((res: any) => regex.test(res.url));
    
    expect(response).toBeDefined();
    expect(response.status).toBe(status);
});

// Solution 11: Clear Mocks
After({ tags: '@network' }, async function () {
    await this.page.unrouteAll();
    this.networkRequests = [];
    this.networkResponses = [];
});

// Solution 12: Export
export {};

