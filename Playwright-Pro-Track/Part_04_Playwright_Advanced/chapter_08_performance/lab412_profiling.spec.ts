/**
 * Lab 412: Profiling
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * JavaScript profiling:
 * 
 * - CPU profiling
 * - Memory profiling
 * - Performance timeline
 * - Bottleneck detection
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Profile JavaScript execution
 * 2. Analyze memory usage
 * 3. Identify bottlenecks
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Basic CPU Profiling
test('basic CPU profiling', async ({ page }) => {
    // Start profiling via CDP
    const client = await page.context().newCDPSession(page);
    await client.send('Profiler.enable');
    await client.send('Profiler.start');
    
    await page.goto('https://playwright.dev');
    
    const { profile } = await client.send('Profiler.stop');
    
    console.log('Profile nodes:', profile.nodes.length);
    console.log('Profile duration:', profile.endTime - profile.startTime, 'μs');
});

// Solution 2: Memory Snapshot
test('memory snapshot', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const client = await page.context().newCDPSession(page);
    await client.send('HeapProfiler.enable');
    
    // Take heap snapshot
    await client.send('HeapProfiler.takeHeapSnapshot');
    
    // Get memory info
    const memory = await page.evaluate(() => {
        if ('memory' in performance) {
            return (performance as any).memory;
        }
        return null;
    });
    
    if (memory) {
        console.log('Used JS Heap:', (memory.usedJSHeapSize / 1024 / 1024).toFixed(2), 'MB');
        console.log('Total JS Heap:', (memory.totalJSHeapSize / 1024 / 1024).toFixed(2), 'MB');
    }
});

// Solution 3: Performance Timeline
test('performance timeline', async ({ page }) => {
    const client = await page.context().newCDPSession(page);
    
    const events: any[] = [];
    client.on('Tracing.dataCollected', (data) => {
        events.push(...data.value);
    });
    
    await client.send('Tracing.start', {
        categories: 'devtools.timeline',
    });
    
    await page.goto('https://playwright.dev');
    
    await client.send('Tracing.end');
    
    // Wait for data
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Timeline events:', events.length);
});

// Solution 4: Long Task Detection
test('long task detection', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const longTasks = await page.evaluate(() => {
        return new Promise((resolve) => {
            const tasks: any[] = [];
            
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    tasks.push({
                        duration: entry.duration,
                        startTime: entry.startTime,
                    });
                }
            });
            
            observer.observe({ entryTypes: ['longtask'] });
            
            setTimeout(() => {
                observer.disconnect();
                resolve(tasks);
            }, 3000);
        });
    });
    
    console.log('Long tasks:', longTasks);
});

// Solution 5: Layout Shift Detection
test('layout shift detection', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const cls = await page.evaluate(() => {
        return new Promise((resolve) => {
            let clsValue = 0;
            
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (!(entry as any).hadRecentInput) {
                        clsValue += (entry as any).value;
                    }
                }
            });
            
            observer.observe({ type: 'layout-shift', buffered: true });
            
            setTimeout(() => {
                observer.disconnect();
                resolve(clsValue);
            }, 3000);
        });
    });
    
    console.log('Cumulative Layout Shift:', cls);
});

// Solution 6: Script Execution Time
test('script execution time', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const scriptTiming = await page.evaluate(() => {
        const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
        const scripts = entries.filter(e => e.initiatorType === 'script');
        
        return scripts.map(s => ({
            name: s.name.split('/').pop(),
            duration: Math.round(s.duration),
        }));
    });
    
    console.log('Script timing:', scriptTiming.slice(0, 5));
});

// Solution 7: DOM Size Analysis
test('DOM size analysis', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const domStats = await page.evaluate(() => {
        const allElements = document.querySelectorAll('*');
        const depths: number[] = [];
        
        allElements.forEach(el => {
            let depth = 0;
            let parent = el.parentElement;
            while (parent) {
                depth++;
                parent = parent.parentElement;
            }
            depths.push(depth);
        });
        
        return {
            totalElements: allElements.length,
            maxDepth: Math.max(...depths),
            avgDepth: (depths.reduce((a, b) => a + b, 0) / depths.length).toFixed(2),
        };
    });
    
    console.log('DOM Stats:', domStats);
});

// Solution 8: Event Listener Count
test('event listener count', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const client = await page.context().newCDPSession(page);
    
    // Get document node
    const { root } = await client.send('DOM.getDocument');
    
    // Get event listeners
    const { listeners } = await client.send('DOMDebugger.getEventListeners', {
        objectId: root.backendNodeId.toString(),
    });
    
    console.log('Event listeners on document:', listeners.length);
});

// Solution 9: Render Blocking Resources
test('render blocking resources', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const blocking = await page.evaluate(() => {
        const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
        
        return resources
            .filter(r => r.renderBlockingStatus === 'blocking')
            .map(r => ({
                name: r.name.split('/').pop(),
                type: r.initiatorType,
            }));
    });
    
    console.log('Render blocking resources:', blocking);
});

// Solution 10: Profiling Best Practices
test('profiling best practices', async ({ page }) => {
    /*
     * Best Practices:
     * 1. Profile in production-like environment
     * 2. Focus on user-impacting metrics
     * 3. Monitor memory over time
     * 4. Identify long tasks
     * 5. Minimize layout shifts
     */
    
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
});

