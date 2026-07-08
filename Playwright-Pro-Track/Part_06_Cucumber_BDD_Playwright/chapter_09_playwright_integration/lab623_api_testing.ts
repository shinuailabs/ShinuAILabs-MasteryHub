/**
 * Lab 623: API Testing with Cucumber
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * API testing in Cucumber:
 * 
 * - Request context
 * - API steps
 * - Response validation
 * - Mixed UI/API tests
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create API steps
 * 2. Validate responses
 * 3. Mix UI and API
 *
 * =====================
 * SOLUTION:
 * =====================
 */

import { Given, When, Then, DataTable } from '@cucumber/cucumber';
import { expect, APIRequestContext } from '@playwright/test';

// Solution 1: API Request Steps
When('I send a GET request to {string}', async function (endpoint: string) {
    const baseUrl = this.parameters?.baseUrl || 'http://localhost:3000';
    this.response = await this.page.request.get(`${baseUrl}${endpoint}`);
    this.responseBody = await this.response.json();
});

When('I send a POST request to {string} with:', async function (endpoint: string, dataTable: DataTable) {
    const baseUrl = this.parameters?.baseUrl || 'http://localhost:3000';
    const data = dataTable.rowsHash();
    
    this.response = await this.page.request.post(`${baseUrl}${endpoint}`, {
        data,
        headers: {
            'Content-Type': 'application/json',
        },
    });
    this.responseBody = await this.response.json();
});

When('I send a PUT request to {string} with:', async function (endpoint: string, dataTable: DataTable) {
    const baseUrl = this.parameters?.baseUrl || 'http://localhost:3000';
    const data = dataTable.rowsHash();
    
    this.response = await this.page.request.put(`${baseUrl}${endpoint}`, {
        data,
    });
    this.responseBody = await this.response.json();
});

When('I send a DELETE request to {string}', async function (endpoint: string) {
    const baseUrl = this.parameters?.baseUrl || 'http://localhost:3000';
    this.response = await this.page.request.delete(`${baseUrl}${endpoint}`);
});

// Solution 2: Response Status Validation
Then('the response status should be {int}', async function (expectedStatus: number) {
    expect(this.response.status()).toBe(expectedStatus);
});

Then('the response should be successful', async function () {
    expect(this.response.ok()).toBe(true);
});

// Solution 3: Response Body Validation
Then('the response should contain:', async function (dataTable: DataTable) {
    const expected = dataTable.rowsHash();
    
    for (const [key, value] of Object.entries(expected)) {
        expect(this.responseBody[key]).toBe(value);
    }
});

Then('the response should have {int} items', async function (count: number) {
    expect(Array.isArray(this.responseBody)).toBe(true);
    expect(this.responseBody.length).toBe(count);
});

Then('the response should include {string}', async function (field: string) {
    expect(this.responseBody).toHaveProperty(field);
});

// Solution 4: JSON Path Validation
Then('the response field {string} should be {string}', async function (path: string, expected: string) {
    const keys = path.split('.');
    let value = this.responseBody;
    
    for (const key of keys) {
        value = value[key];
    }
    
    expect(String(value)).toBe(expected);
});

// Solution 5: API with Authentication
Given('I am authenticated as {string} via API', async function (userType: string) {
    const credentials: Record<string, { email: string; password: string }> = {
        admin: { email: 'admin@test.com', password: 'admin123' },
        user: { email: 'user@test.com', password: 'user123' },
    };
    
    const creds = credentials[userType];
    const baseUrl = this.parameters?.baseUrl || 'http://localhost:3000';
    
    const response = await this.page.request.post(`${baseUrl}/api/auth/login`, {
        data: creds,
    });
    
    const body = await response.json();
    this.authToken = body.token;
});

When('I send an authenticated GET request to {string}', async function (endpoint: string) {
    const baseUrl = this.parameters?.baseUrl || 'http://localhost:3000';
    
    this.response = await this.page.request.get(`${baseUrl}${endpoint}`, {
        headers: {
            'Authorization': `Bearer ${this.authToken}`,
        },
    });
    this.responseBody = await this.response.json();
});

// Solution 6: Mixed UI and API Test
Given('I create a user via API:', async function (dataTable: DataTable) {
    const userData = dataTable.rowsHash();
    const baseUrl = this.parameters?.baseUrl || 'http://localhost:3000';
    
    const response = await this.page.request.post(`${baseUrl}/api/users`, {
        data: userData,
    });
    
    this.createdUser = await response.json();
});

Then('I should see the user in the UI', async function () {
    await this.page.goto('/users');
    await expect(this.page.locator(`text=${this.createdUser.email}`)).toBeVisible();
});

// Solution 7: API Response Storage
When('I store the response as {string}', async function (key: string) {
    this.storedResponses = this.storedResponses || {};
    this.storedResponses[key] = this.responseBody;
});

Then('the {string} response should match {string} response', async function (key1: string, key2: string) {
    expect(this.storedResponses[key1]).toEqual(this.storedResponses[key2]);
});

// Solution 8: Export
export {};

