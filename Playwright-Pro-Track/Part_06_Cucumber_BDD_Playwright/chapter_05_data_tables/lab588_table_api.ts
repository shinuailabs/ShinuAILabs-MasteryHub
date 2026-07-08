/**
 * Lab 588: Data Tables for API Testing
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Using data tables with APIs:
 * 
 * - Request bodies
 * - Headers
 * - Response validation
 * - Bulk operations
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Build API requests
 * 2. Validate responses
 * 3. Handle bulk data
 *
 * =====================
 * SOLUTION:
 * =====================
 */

import { When, Then, DataTable } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

// Solution 1: API Request with Headers
When('I send a request with headers:', async function (dataTable: DataTable) {
    const headers = dataTable.rowsHash();
    
    this.response = await this.page.request.get('/api/data', {
        headers: headers,
    });
});

// Solution 2: POST Request with Body
When('I create a resource with:', async function (dataTable: DataTable) {
    const body = dataTable.rowsHash();
    
    this.response = await this.page.request.post('/api/resources', {
        data: body,
        headers: {
            'Content-Type': 'application/json',
        },
    });
    
    this.createdResource = await this.response.json();
});

// Solution 3: Bulk Create
When('I create multiple resources:', async function (dataTable: DataTable) {
    const resources = dataTable.hashes();
    this.createdResources = [];
    
    for (const resource of resources) {
        const response = await this.page.request.post('/api/resources', {
            data: resource,
        });
        
        const created = await response.json();
        this.createdResources.push(created);
    }
});

// Solution 4: Validate Response Body
Then('the response should contain:', async function (dataTable: DataTable) {
    const expected = dataTable.rowsHash();
    const body = await this.response.json();
    
    for (const [key, value] of Object.entries(expected)) {
        expect(body[key]).toBe(value);
    }
});

// Solution 5: Validate Response Array
Then('the response should include items:', async function (dataTable: DataTable) {
    const expected = dataTable.hashes();
    const body = await this.response.json();
    
    expect(Array.isArray(body)).toBe(true);
    
    for (const expectedItem of expected) {
        const found = body.some((item: any) => {
            return Object.entries(expectedItem).every(
                ([key, value]) => item[key] === value
            );
        });
        expect(found).toBe(true);
    }
});

// Solution 6: Query Parameters
When('I search with parameters:', async function (dataTable: DataTable) {
    const params = dataTable.rowsHash();
    const queryString = new URLSearchParams(params).toString();
    
    this.response = await this.page.request.get(`/api/search?${queryString}`);
});

// Solution 7: Update Resource
When('I update the resource with:', async function (dataTable: DataTable) {
    const updates = dataTable.rowsHash();
    
    this.response = await this.page.request.patch(
        `/api/resources/${this.createdResource.id}`,
        {
            data: updates,
        }
    );
});

// Solution 8: Validate Response Headers
Then('the response headers should include:', async function (dataTable: DataTable) {
    const expected = dataTable.rowsHash();
    const headers = this.response.headers();
    
    for (const [header, value] of Object.entries(expected)) {
        expect(headers[header.toLowerCase()]).toBe(value);
    }
});

// Solution 9: Validate Nested Response
Then('the response user should have:', async function (dataTable: DataTable) {
    const expected = dataTable.rowsHash();
    const body = await this.response.json();
    
    for (const [path, value] of Object.entries(expected)) {
        const keys = path.split('.');
        let actual = body;
        
        for (const key of keys) {
            actual = actual[key];
        }
        
        expect(String(actual)).toBe(value);
    }
});

// Solution 10: Bulk Delete
When('I delete resources with IDs:', async function (dataTable: DataTable) {
    const ids = dataTable.raw().flat();
    this.deleteResults = [];
    
    for (const id of ids) {
        const response = await this.page.request.delete(`/api/resources/${id}`);
        this.deleteResults.push({
            id,
            status: response.status(),
        });
    }
});

// Solution 11: Validate Multiple Responses
Then('all delete operations should succeed:', async function () {
    for (const result of this.deleteResults) {
        expect(result.status).toBe(200);
    }
});

// Solution 12: API Error Validation
Then('the error response should contain:', async function (dataTable: DataTable) {
    const expected = dataTable.rowsHash();
    const body = await this.response.json();
    
    expect(body.error).toBe(expected['Error']);
    expect(body.message).toBe(expected['Message']);
    if (expected['Code']) {
        expect(body.code).toBe(expected['Code']);
    }
});

// Solution 13: Export
export {};

