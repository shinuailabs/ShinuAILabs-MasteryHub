/**
 * Lab 587: Data Tables for Forms
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Using data tables with forms:
 * 
 * - Form filling
 * - Field mapping
 * - Dynamic forms
 * - Validation
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Fill forms from tables
 * 2. Map fields
 * 3. Handle dynamic forms
 *
 * =====================
 * SOLUTION:
 * =====================
 */

import { When, Then, DataTable } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

// Solution 1: Basic Form Filling
When('I fill the form with:', async function (dataTable: DataTable) {
    const formData = dataTable.rowsHash();
    
    for (const [field, value] of Object.entries(formData)) {
        const fieldName = field.toLowerCase().replace(/\s+/g, '_');
        await this.page.fill(`[name="${fieldName}"], #${fieldName}`, value);
    }
});

// Solution 2: Form with Field Type Detection
When('I complete the form:', async function (dataTable: DataTable) {
    const formData = dataTable.rowsHash();
    
    for (const [field, value] of Object.entries(formData)) {
        const fieldName = field.toLowerCase().replace(/\s+/g, '_');
        const element = this.page.locator(`[name="${fieldName}"], #${fieldName}`);
        
        const tagName = await element.evaluate(el => el.tagName.toLowerCase());
        const inputType = await element.getAttribute('type');
        
        switch (tagName) {
            case 'select':
                await element.selectOption({ label: value });
                break;
            case 'textarea':
                await element.fill(value);
                break;
            case 'input':
                switch (inputType) {
                    case 'checkbox':
                        if (value.toLowerCase() === 'true' || value.toLowerCase() === 'yes') {
                            await element.check();
                        } else {
                            await element.uncheck();
                        }
                        break;
                    case 'radio':
                        await this.page.check(`[name="${fieldName}"][value="${value}"]`);
                        break;
                    case 'file':
                        await element.setInputFiles(value);
                        break;
                    default:
                        await element.fill(value);
                }
                break;
            default:
                await element.fill(value);
        }
    }
});

// Solution 3: Form with Custom Field Mapping
When('I fill the registration form:', async function (dataTable: DataTable) {
    const fieldMapping: Record<string, string> = {
        'First Name': '#firstName',
        'Last Name': '#lastName',
        'Email Address': '#email',
        'Phone Number': '#phone',
        'Date of Birth': '#dob',
        'Country': '#country',
        'Terms Accepted': '#terms',
    };
    
    const formData = dataTable.rowsHash();
    
    for (const [field, value] of Object.entries(formData)) {
        const selector = fieldMapping[field];
        if (!selector) {
            throw new Error(`Unknown field: ${field}`);
        }
        
        const element = this.page.locator(selector);
        const tagName = await element.evaluate(el => el.tagName.toLowerCase());
        
        if (tagName === 'select') {
            await element.selectOption({ label: value });
        } else if (await element.getAttribute('type') === 'checkbox') {
            if (value.toLowerCase() === 'yes') {
                await element.check();
            }
        } else {
            await element.fill(value);
        }
    }
});

// Solution 4: Multiple Forms
When('I fill multiple forms:', async function (dataTable: DataTable) {
    const forms = dataTable.hashes();
    
    for (const formData of forms) {
        await this.page.click('#add-form');
        
        for (const [field, value] of Object.entries(formData)) {
            const fieldName = field.toLowerCase().replace(/\s+/g, '_');
            await this.page.locator('.form-container:last-child')
                .locator(`[name="${fieldName}"]`)
                .fill(value);
        }
    }
});

// Solution 5: Form Validation Errors
Then('I should see validation errors:', async function (dataTable: DataTable) {
    const expectedErrors = dataTable.rowsHash();
    
    for (const [field, error] of Object.entries(expectedErrors)) {
        const fieldName = field.toLowerCase().replace(/\s+/g, '_');
        const errorElement = this.page.locator(`[data-error-for="${fieldName}"], #${fieldName}-error`);
        await expect(errorElement).toHaveText(error);
    }
});

// Solution 6: Form with Sections
When('I fill the address section:', async function (dataTable: DataTable) {
    const addressData = dataTable.rowsHash();
    const section = this.page.locator('.address-section');
    
    for (const [field, value] of Object.entries(addressData)) {
        const fieldName = field.toLowerCase().replace(/\s+/g, '_');
        await section.locator(`[name="${fieldName}"]`).fill(value);
    }
});

// Solution 7: Dynamic Form Fields
When('I add custom fields:', async function (dataTable: DataTable) {
    const customFields = dataTable.hashes();
    
    for (const field of customFields) {
        await this.page.click('#add-custom-field');
        
        const lastField = this.page.locator('.custom-field:last-child');
        await lastField.locator('.field-name').fill(field['Field Name']);
        await lastField.locator('.field-value').fill(field['Value']);
        await lastField.locator('.field-type').selectOption(field['Type']);
    }
});

// Solution 8: Form Verification
Then('the form should contain:', async function (dataTable: DataTable) {
    const expected = dataTable.rowsHash();
    
    for (const [field, value] of Object.entries(expected)) {
        const fieldName = field.toLowerCase().replace(/\s+/g, '_');
        const element = this.page.locator(`[name="${fieldName}"], #${fieldName}`);
        
        const tagName = await element.evaluate(el => el.tagName.toLowerCase());
        
        if (tagName === 'select') {
            await expect(element).toHaveValue(value);
        } else if (await element.getAttribute('type') === 'checkbox') {
            const shouldBeChecked = value.toLowerCase() === 'yes';
            if (shouldBeChecked) {
                await expect(element).toBeChecked();
            } else {
                await expect(element).not.toBeChecked();
            }
        } else {
            await expect(element).toHaveValue(value);
        }
    }
});

// Solution 9: Export
export {};

