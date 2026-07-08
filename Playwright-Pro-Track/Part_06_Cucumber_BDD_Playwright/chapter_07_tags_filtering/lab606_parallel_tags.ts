/**
 * Lab 606: Parallel Execution with Tags
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Running tagged tests in parallel:
 * 
 * - Parallel configuration
 * - Tag-based sharding
 * - Resource isolation
 * - Conflict avoidance
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Configure parallel execution
 * 2. Handle shared resources
 * 3. Avoid conflicts
 *
 * =====================
 * SOLUTION:
 * =====================
 */

import { Before, After, setParallelCanAssign } from '@cucumber/cucumber';
import { chromium, Browser, BrowserContext } from '@playwright/test';

// Solution 1: Cucumber Parallel Configuration
// cucumber.js
const parallelConfig = {
    default: {
        parallel: 4, // Number of parallel workers
        tags: 'not @serial', // Exclude serial tests from parallel
    },
    serial: {
        parallel: 1, // Run serially
        tags: '@serial',
    },
};

// Solution 2: Tag-Based Parallel Assignment
// Prevent scenarios with same resource tag from running together
setParallelCanAssign(function (pickleInQuestion, picklesInProgress) {
    // Get tags from the pickle in question
    const tagsInQuestion = pickleInQuestion.pickle.tags.map(t => t.name);
    
    // Check for resource conflicts
    const resourceTags = tagsInQuestion.filter(t => t.startsWith('@resource:'));
    
    if (resourceTags.length === 0) {
        return true; // No resource constraints
    }
    
    // Check if any in-progress pickle uses the same resource
    for (const pickleInProgress of picklesInProgress) {
        const tagsInProgress = pickleInProgress.pickle.tags.map(t => t.name);
        
        for (const resourceTag of resourceTags) {
            if (tagsInProgress.includes(resourceTag)) {
                return false; // Resource conflict, cannot run in parallel
            }
        }
    }
    
    return true;
});

// Solution 3: Worker-Specific Setup
let browser: Browser;
let workerId: string;

Before(async function () {
    // Get worker ID for parallel execution
    workerId = process.env.CUCUMBER_WORKER_ID || '0';
    
    // Create isolated browser context per worker
    if (!browser) {
        browser = await chromium.launch({ headless: true });
    }
    
    this.context = await browser.newContext();
    this.page = await this.context.newPage();
    
    // Worker-specific test data
    this.testUserEmail = `test.user.${workerId}@example.com`;
});

After(async function () {
    await this.context?.close();
});

// Solution 4: Database Isolation for Parallel Tests
Before({ tags: '@database' }, async function () {
    // Use worker-specific database schema or prefix
    this.dbPrefix = `worker_${workerId}_`;
    this.tableName = `${this.dbPrefix}test_data`;
    
    console.log(`Worker ${workerId} using table: ${this.tableName}`);
});

// Solution 5: File System Isolation
Before({ tags: '@file-system' }, async function () {
    const fs = await import('fs');
    const path = await import('path');
    
    // Create worker-specific temp directory
    this.tempDir = path.join('/tmp', `cucumber-worker-${workerId}`);
    
    if (!fs.existsSync(this.tempDir)) {
        fs.mkdirSync(this.tempDir, { recursive: true });
    }
});

After({ tags: '@file-system' }, async function () {
    const fs = await import('fs');
    
    // Cleanup worker-specific temp directory
    if (this.tempDir && fs.existsSync(this.tempDir)) {
        fs.rmSync(this.tempDir, { recursive: true });
    }
});

// Solution 6: API Rate Limiting for Parallel Tests
const rateLimiter = {
    lastCall: new Map<string, number>(),
    minInterval: 100, // ms between calls
    
    async throttle(endpoint: string): Promise<void> {
        const now = Date.now();
        const lastCall = this.lastCall.get(endpoint) || 0;
        const elapsed = now - lastCall;
        
        if (elapsed < this.minInterval) {
            await new Promise(resolve => 
                setTimeout(resolve, this.minInterval - elapsed)
            );
        }
        
        this.lastCall.set(endpoint, Date.now());
    },
};

Before({ tags: '@api' }, async function () {
    this.rateLimiter = rateLimiter;
});

// Solution 7: Shared Resource Locking
class ResourceLock {
    private locks: Map<string, Promise<void>> = new Map();
    
    async acquire(resource: string): Promise<() => void> {
        // Wait for existing lock
        while (this.locks.has(resource)) {
            await this.locks.get(resource);
        }
        
        // Create new lock
        let release: () => void;
        const lockPromise = new Promise<void>(resolve => {
            release = resolve;
        });
        
        this.locks.set(resource, lockPromise);
        
        return () => {
            this.locks.delete(resource);
            release!();
        };
    }
}

const resourceLock = new ResourceLock();

Before({ tags: '@shared-resource' }, async function () {
    // Acquire lock for shared resource
    const resourceName = this.parameters?.resource || 'default';
    this.releaseLock = await resourceLock.acquire(resourceName);
});

After({ tags: '@shared-resource' }, async function () {
    // Release lock
    this.releaseLock?.();
});

// Solution 8: Parallel Execution Report
interface ParallelStats {
    workerId: string;
    scenariosRun: number;
    duration: number;
}

const parallelStats: ParallelStats[] = [];

Before(async function () {
    this.scenarioStartTime = Date.now();
});

After(async function () {
    const duration = Date.now() - this.scenarioStartTime;
    
    // Track stats per worker
    let stats = parallelStats.find(s => s.workerId === workerId);
    if (!stats) {
        stats = { workerId, scenariosRun: 0, duration: 0 };
        parallelStats.push(stats);
    }
    
    stats.scenariosRun++;
    stats.duration += duration;
});

// Solution 9: Export
export { parallelConfig, ResourceLock, rateLimiter };

