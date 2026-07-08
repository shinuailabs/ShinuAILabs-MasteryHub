/**
 * Lab 408: Load Testing
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Basic load testing with Playwright:
 * 
 * - Concurrent requests
 * - Response times
 * - Error rates
 * - Throughput
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Run concurrent tests
 * 2. Measure response times
 * 3. Calculate throughput
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Sequential Load Test
test('sequential load test', async ({ page }) => {
    const iterations = 5;
    const times: number[] = [];
    
    for (let i = 0; i < iterations; i++) {
        const start = Date.now();
        await page.goto('https://playwright.dev');
        times.push(Date.now() - start);
    }
    
    const avg = times.reduce((a, b) => a + b, 0) / times.length;
    console.log('Average load time:', avg, 'ms');
    console.log('Min:', Math.min(...times), 'Max:', Math.max(...times));
});

// Solution 2: Parallel Page Loads
test('parallel page loads', async ({ browser }) => {
    const concurrency = 3;
    const start = Date.now();
    
    const promises = Array(concurrency).fill(null).map(async () => {
        const context = await browser.newContext();
        const page = await context.newPage();
        const loadStart = Date.now();
        await page.goto('https://playwright.dev');
        const loadTime = Date.now() - loadStart;
        await context.close();
        return loadTime;
    });
    
    const times = await Promise.all(promises);
    const totalTime = Date.now() - start;
    
    console.log('Individual times:', times);
    console.log('Total time:', totalTime, 'ms');
    console.log('Throughput:', (concurrency / (totalTime / 1000)).toFixed(2), 'pages/sec');
});

// Solution 3: API Load Test
test('API load test', async ({ request }) => {
    const iterations = 10;
    const times: number[] = [];
    
    for (let i = 0; i < iterations; i++) {
        const start = Date.now();
        const response = await request.get('https://playwright.dev');
        times.push(Date.now() - start);
        expect(response.ok()).toBeTruthy();
    }
    
    const avg = times.reduce((a, b) => a + b, 0) / times.length;
    console.log('API Average:', avg, 'ms');
});

// Solution 4: Concurrent API Requests
test('concurrent API requests', async ({ request }) => {
    const concurrency = 5;
    const start = Date.now();
    
    const promises = Array(concurrency).fill(null).map(async () => {
        const reqStart = Date.now();
        const response = await request.get('https://playwright.dev');
        return {
            time: Date.now() - reqStart,
            status: response.status(),
        };
    });
    
    const results = await Promise.all(promises);
    const totalTime = Date.now() - start;
    
    console.log('Results:', results);
    console.log('Total time:', totalTime, 'ms');
});

// Solution 5: Stress Test Pattern
test('stress test pattern', async ({ browser }) => {
    const results = {
        success: 0,
        failed: 0,
        times: [] as number[],
    };
    
    const iterations = 5;
    
    for (let i = 0; i < iterations; i++) {
        try {
            const context = await browser.newContext();
            const page = await context.newPage();
            const start = Date.now();
            
            await page.goto('https://playwright.dev', { timeout: 30000 });
            
            results.times.push(Date.now() - start);
            results.success++;
            
            await context.close();
        } catch (error) {
            results.failed++;
        }
    }
    
    console.log('Success:', results.success);
    console.log('Failed:', results.failed);
    console.log('Avg Time:', results.times.reduce((a, b) => a + b, 0) / results.times.length);
});

// Solution 6: Ramp-Up Load Test
test('ramp up load test', async ({ browser }) => {
    const stages = [1, 2, 3, 2, 1]; // Users per stage
    
    for (const users of stages) {
        console.log(`Stage: ${users} concurrent users`);
        
        const promises = Array(users).fill(null).map(async () => {
            const context = await browser.newContext();
            const page = await context.newPage();
            const start = Date.now();
            await page.goto('https://playwright.dev');
            const time = Date.now() - start;
            await context.close();
            return time;
        });
        
        const times = await Promise.all(promises);
        console.log('Times:', times);
    }
});

// Solution 7: Response Time Percentiles
test('response time percentiles', async ({ page }) => {
    const times: number[] = [];
    const iterations = 10;
    
    for (let i = 0; i < iterations; i++) {
        const start = Date.now();
        await page.goto('https://playwright.dev');
        times.push(Date.now() - start);
    }
    
    times.sort((a, b) => a - b);
    
    const p50 = times[Math.floor(times.length * 0.5)];
    const p90 = times[Math.floor(times.length * 0.9)];
    const p99 = times[Math.floor(times.length * 0.99)];
    
    console.log('P50:', p50, 'ms');
    console.log('P90:', p90, 'ms');
    console.log('P99:', p99, 'ms');
});

// Solution 8: Error Rate Monitoring
test('error rate monitoring', async ({ browser }) => {
    let errors = 0;
    let success = 0;
    const iterations = 10;
    
    for (let i = 0; i < iterations; i++) {
        try {
            const context = await browser.newContext();
            const page = await context.newPage();
            await page.goto('https://playwright.dev', { timeout: 10000 });
            success++;
            await context.close();
        } catch {
            errors++;
        }
    }
    
    const errorRate = (errors / iterations) * 100;
    console.log('Error Rate:', errorRate, '%');
    expect(errorRate).toBeLessThan(10); // Less than 10% errors
});

// Solution 9: Throughput Measurement
test('throughput measurement', async ({ browser }) => {
    const duration = 5000; // 5 seconds
    const start = Date.now();
    let requests = 0;
    
    while (Date.now() - start < duration) {
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto('https://playwright.dev');
        requests++;
        await context.close();
    }
    
    const throughput = requests / (duration / 1000);
    console.log('Throughput:', throughput.toFixed(2), 'requests/sec');
});

// Solution 10: Load Testing Best Practices
test('load testing best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Start with baseline
     * 2. Gradually increase load
     * 3. Monitor error rates
     * 4. Measure percentiles
     * 5. Use dedicated tools for heavy load
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

