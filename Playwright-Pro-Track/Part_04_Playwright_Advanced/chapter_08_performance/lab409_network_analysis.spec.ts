/**
 * Lab 409: Network Analysis
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Analyzing network performance:
 * 
 * - Request/response timing
 * - Resource sizes
 * - Waterfall analysis
 * - Bottleneck detection
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Analyze network requests
 * 2. Measure resource sizes
 * 3. Identify bottlenecks
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Request Timing
test('request timing', async ({ page }) => {
    const requests: any[] = [];
    
    page.on('request', request => {
        requests.push({
            url: request.url(),
            method: request.method(),
            startTime: Date.now(),
        });
    });
    
    page.on('response', response => {
        const req = requests.find(r => r.url === response.url());
        if (req) {
            req.endTime = Date.now();
            req.duration = req.endTime - req.startTime;
            req.status = response.status();
        }
    });
    
    await page.goto('https://playwright.dev');
    
    const sorted = requests.sort((a, b) => (b.duration || 0) - (a.duration || 0));
    console.log('Slowest requests:', sorted.slice(0, 5).map(r => ({
        url: r.url.substring(0, 50),
        duration: r.duration,
    })));
});

// Solution 2: Resource Size Analysis
test('resource size analysis', async ({ page }) => {
    const resources: any[] = [];
    
    page.on('response', async response => {
        try {
            const body = await response.body();
            resources.push({
                url: response.url(),
                size: body.length,
                type: response.headers()['content-type'],
            });
        } catch {
            // Ignore errors
        }
    });
    
    await page.goto('https://playwright.dev');
    
    const totalSize = resources.reduce((sum, r) => sum + r.size, 0);
    console.log('Total size:', (totalSize / 1024).toFixed(2), 'KB');
    console.log('Resource count:', resources.length);
});

// Solution 3: Resource Type Breakdown
test('resource type breakdown', async ({ page }) => {
    const byType: Record<string, { count: number; size: number }> = {};
    
    page.on('response', async response => {
        try {
            const body = await response.body();
            const contentType = response.headers()['content-type'] || 'unknown';
            const type = contentType.split(';')[0];
            
            if (!byType[type]) {
                byType[type] = { count: 0, size: 0 };
            }
            byType[type].count++;
            byType[type].size += body.length;
        } catch {
            // Ignore
        }
    });
    
    await page.goto('https://playwright.dev');
    
    console.log('Resources by type:');
    Object.entries(byType).forEach(([type, data]) => {
        console.log(`  ${type}: ${data.count} files, ${(data.size / 1024).toFixed(2)} KB`);
    });
});

// Solution 4: Waterfall Analysis
test('waterfall analysis', async ({ page }) => {
    const timeline: any[] = [];
    const startTime = Date.now();
    
    page.on('request', request => {
        timeline.push({
            type: 'request',
            url: request.url().substring(0, 50),
            time: Date.now() - startTime,
        });
    });
    
    page.on('response', response => {
        timeline.push({
            type: 'response',
            url: response.url().substring(0, 50),
            time: Date.now() - startTime,
            status: response.status(),
        });
    });
    
    await page.goto('https://playwright.dev');
    
    console.log('Timeline (first 10 events):');
    timeline.slice(0, 10).forEach(event => {
        console.log(`  ${event.time}ms: ${event.type} - ${event.url}`);
    });
});

// Solution 5: Failed Requests
test('failed requests', async ({ page }) => {
    const failed: any[] = [];
    
    page.on('requestfailed', request => {
        failed.push({
            url: request.url(),
            failure: request.failure()?.errorText,
        });
    });
    
    page.on('response', response => {
        if (response.status() >= 400) {
            failed.push({
                url: response.url(),
                status: response.status(),
            });
        }
    });
    
    await page.goto('https://playwright.dev');
    
    console.log('Failed requests:', failed.length);
    if (failed.length > 0) {
        console.log('Details:', failed);
    }
});

// Solution 6: Third-Party Resources
test('third party resources', async ({ page }) => {
    const thirdParty: any[] = [];
    const mainDomain = 'playwright.dev';
    
    page.on('request', request => {
        const url = new URL(request.url());
        if (!url.hostname.includes(mainDomain)) {
            thirdParty.push({
                domain: url.hostname,
                path: url.pathname,
            });
        }
    });
    
    await page.goto('https://playwright.dev');
    
    const domains = [...new Set(thirdParty.map(r => r.domain))];
    console.log('Third-party domains:', domains);
    console.log('Third-party requests:', thirdParty.length);
});

// Solution 7: Caching Analysis
test('caching analysis', async ({ page }) => {
    const cacheStatus: any[] = [];
    
    page.on('response', response => {
        const cacheControl = response.headers()['cache-control'];
        cacheStatus.push({
            url: response.url().substring(0, 50),
            cacheControl: cacheControl || 'none',
            cached: cacheControl?.includes('max-age') || false,
        });
    });
    
    await page.goto('https://playwright.dev');
    
    const cached = cacheStatus.filter(r => r.cached).length;
    console.log('Cached resources:', cached, '/', cacheStatus.length);
});

// Solution 8: Compression Analysis
test('compression analysis', async ({ page }) => {
    const compression: any[] = [];
    
    page.on('response', response => {
        const encoding = response.headers()['content-encoding'];
        compression.push({
            url: response.url().substring(0, 50),
            encoding: encoding || 'none',
        });
    });
    
    await page.goto('https://playwright.dev');
    
    const gzipped = compression.filter(r => r.encoding === 'gzip').length;
    const br = compression.filter(r => r.encoding === 'br').length;
    
    console.log('Gzip:', gzipped, 'Brotli:', br, 'None:', compression.length - gzipped - br);
});

// Solution 9: DNS and Connection Time
test('DNS and connection time', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const timing = await page.evaluate(() => {
        const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        return {
            dns: nav.domainLookupEnd - nav.domainLookupStart,
            tcp: nav.connectEnd - nav.connectStart,
            ssl: nav.secureConnectionStart > 0 ? nav.connectEnd - nav.secureConnectionStart : 0,
            ttfb: nav.responseStart - nav.requestStart,
        };
    });
    
    console.log('DNS lookup:', timing.dns, 'ms');
    console.log('TCP connect:', timing.tcp, 'ms');
    console.log('SSL handshake:', timing.ssl, 'ms');
    console.log('TTFB:', timing.ttfb, 'ms');
});

// Solution 10: Network Analysis Best Practices
test('network analysis best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Monitor request count
     * 2. Track resource sizes
     * 3. Identify slow requests
     * 4. Check caching headers
     * 5. Verify compression
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

