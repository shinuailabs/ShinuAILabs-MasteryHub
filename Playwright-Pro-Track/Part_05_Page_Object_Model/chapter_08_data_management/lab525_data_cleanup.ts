/**
 * Lab 525: Data Cleanup
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Cleaning up test data:
 * 
 * - Cleanup strategies
 * - Resource tracking
 * - Automatic cleanup
 * - Error handling
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Implement cleanup strategies
 * 2. Track resources
 * 3. Handle cleanup errors
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { APIRequestContext } from '@playwright/test';

// Solution 1: Resource Tracker
interface TrackedResource {
    type: string;
    id: string;
    deleteEndpoint: string;
    priority: number; // Lower = delete first
}

class ResourceTracker {
    private resources: TrackedResource[] = [];
    
    track(type: string, id: string, deleteEndpoint: string, priority: number = 10) {
        this.resources.push({ type, id, deleteEndpoint, priority });
    }
    
    getResources(): TrackedResource[] {
        return [...this.resources].sort((a, b) => a.priority - b.priority);
    }
    
    clear() {
        this.resources = [];
    }
    
    remove(type: string, id: string) {
        this.resources = this.resources.filter(r => !(r.type === type && r.id === id));
    }
}

// Solution 2: Cleanup Manager
class CleanupManager {
    private tracker: ResourceTracker;
    
    constructor(private request: APIRequestContext, private baseUrl: string) {
        this.tracker = new ResourceTracker();
    }
    
    trackUser(id: string) {
        this.tracker.track('user', id, `/api/users/${id}`, 30);
    }
    
    trackProduct(id: string) {
        this.tracker.track('product', id, `/api/products/${id}`, 20);
    }
    
    trackOrder(id: string) {
        this.tracker.track('order', id, `/api/orders/${id}`, 10);
    }
    
    async cleanup(): Promise<{ success: string[]; failed: string[] }> {
        const results = { success: [] as string[], failed: [] as string[] };
        
        for (const resource of this.tracker.getResources()) {
            try {
                await this.request.delete(`${this.baseUrl}${resource.deleteEndpoint}`);
                results.success.push(`${resource.type}:${resource.id}`);
            } catch (error) {
                results.failed.push(`${resource.type}:${resource.id}`);
            }
        }
        
        this.tracker.clear();
        return results;
    }
}

// Solution 3: Automatic Cleanup Wrapper
class AutoCleanup<T> {
    private cleanupFn: () => Promise<void>;
    
    constructor(public value: T, cleanupFn: () => Promise<void>) {
        this.cleanupFn = cleanupFn;
    }
    
    async cleanup() {
        await this.cleanupFn();
    }
}

async function withCleanup<T>(
    createFn: () => Promise<T>,
    cleanupFn: (value: T) => Promise<void>
): Promise<AutoCleanup<T>> {
    const value = await createFn();
    return new AutoCleanup(value, () => cleanupFn(value));
}

// Solution 4: Cleanup Queue
class CleanupQueue {
    private queue: (() => Promise<void>)[] = [];
    
    add(cleanupFn: () => Promise<void>) {
        this.queue.push(cleanupFn);
    }
    
    async executeAll(options: { continueOnError?: boolean } = {}) {
        const errors: Error[] = [];
        
        // Execute in reverse order (LIFO)
        while (this.queue.length > 0) {
            const fn = this.queue.pop()!;
            try {
                await fn();
            } catch (error) {
                if (options.continueOnError) {
                    errors.push(error as Error);
                } else {
                    throw error;
                }
            }
        }
        
        if (errors.length > 0) {
            throw new AggregateError(errors, 'Cleanup failed');
        }
    }
}

// Solution 5: Cleanup Strategies
enum CleanupStrategy {
    IMMEDIATE = 'immediate',
    DEFERRED = 'deferred',
    BATCH = 'batch',
}

class StrategicCleanup {
    private immediateQueue: (() => Promise<void>)[] = [];
    private deferredQueue: (() => Promise<void>)[] = [];
    
    register(fn: () => Promise<void>, strategy: CleanupStrategy) {
        if (strategy === CleanupStrategy.IMMEDIATE) {
            this.immediateQueue.push(fn);
        } else {
            this.deferredQueue.push(fn);
        }
    }
    
    async executeImmediate() {
        for (const fn of this.immediateQueue) {
            await fn();
        }
        this.immediateQueue = [];
    }
    
    async executeDeferred() {
        for (const fn of this.deferredQueue) {
            await fn();
        }
        this.deferredQueue = [];
    }
    
    async executeAll() {
        await this.executeImmediate();
        await this.executeDeferred();
    }
}

// Solution 6: Safe Cleanup Helper
async function safeCleanup(fn: () => Promise<void>, errorHandler?: (error: Error) => void) {
    try {
        await fn();
    } catch (error) {
        if (errorHandler) {
            errorHandler(error as Error);
        } else {
            console.error('Cleanup failed:', error);
        }
    }
}

// Solution 7: Export
export {
    ResourceTracker,
    CleanupManager,
    AutoCleanup,
    withCleanup,
    CleanupQueue,
    CleanupStrategy,
    StrategicCleanup,
    safeCleanup,
    TrackedResource,
};

