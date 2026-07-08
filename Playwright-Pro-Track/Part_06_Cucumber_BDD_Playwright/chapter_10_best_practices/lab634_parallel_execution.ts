/**
 * Lab 634: Parallel Execution Best Practices
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Running tests in parallel:
 * 
 * - Worker isolation
 * - Data isolation
 * - Resource management
 * - Sharding
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Configure parallel execution
 * 2. Isolate test data
 * 3. Handle shared resources
 *
 * =====================
 * SOLUTION:
 * =====================
 */

import { Before, After, BeforeAll, AfterAll } from '@cucumber/cucumber';

/*
 * Best Practice 1: Cucumber Parallel Configuration
 * 
 * cucumber.js:
 * module.exports = {
 *   default: {
 *     parallel: 4,  // Number of workers
 *   }
 * }
 * 
 * CLI: npx cucumber-js --parallel 4
 */

/*
 * Best Practice 2: Worker-Specific Data
 */
function getWorkerId(): string {
    return process.env.CUCUMBER_WORKER_ID || '0';
}

function getWorkerSpecificEmail(): string {
    const workerId = getWorkerId();
    const timestamp = Date.now();
    return `test_worker${workerId}_${timestamp}@example.com`;
}

Before(async function () {
    // Each worker gets unique test data
    this.workerId = getWorkerId();
    this.testEmail = getWorkerSpecificEmail();
    
    console.log(`Worker ${this.workerId} starting scenario`);
});

/*
 * Best Practice 3: Database Isolation
 */
interface DatabaseTransaction {
    begin(): Promise<void>;
    rollback(): Promise<void>;
    commit(): Promise<void>;
}

// Wrap each scenario in a transaction
Before({ tags: '@database' }, async function () {
    // Start transaction for isolation
    // this.dbTransaction = await this.db.beginTransaction();
    console.log(`Worker ${getWorkerId()}: Starting DB transaction`);
});

After({ tags: '@database' }, async function () {
    // Rollback to clean up
    // await this.dbTransaction.rollback();
    console.log(`Worker ${getWorkerId()}: Rolling back DB transaction`);
});

/*
 * Best Practice 4: Unique Resource Naming
 */
function generateUniqueResourceName(prefix: string): string {
    const workerId = getWorkerId();
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    return `${prefix}_w${workerId}_${timestamp}_${random}`;
}

Before(async function () {
    // Create unique resources per worker
    this.testUser = {
        email: generateUniqueResourceName('user') + '@test.com',
        name: generateUniqueResourceName('TestUser'),
    };
});

/*
 * Best Practice 5: Shared Resource Locking
 */
class ResourceLock {
    private static locks: Map<string, Promise<void>> = new Map();
    
    static async acquire(resourceId: string): Promise<() => void> {
        // Wait for existing lock
        while (this.locks.has(resourceId)) {
            await this.locks.get(resourceId);
        }
        
        // Create new lock
        let release: () => void;
        const lockPromise = new Promise<void>(resolve => {
            release = resolve;
        });
        
        this.locks.set(resourceId, lockPromise);
        
        return () => {
            this.locks.delete(resourceId);
            release!();
        };
    }
}

// Usage for shared resources
Before({ tags: '@shared-resource' }, async function () {
    this.releaseLock = await ResourceLock.acquire('shared-api-key');
});

After({ tags: '@shared-resource' }, async function () {
    if (this.releaseLock) {
        this.releaseLock();
    }
});

/*
 * Best Practice 6: Parallel-Safe Fixtures
 */
class ParallelSafeFixtures {
    private workerId: string;
    
    constructor() {
        this.workerId = getWorkerId();
    }
    
    getUser(type: string): { email: string; password: string } {
        // Each worker gets different user
        const baseUsers: Record<string, { email: string; password: string }> = {
            admin: { email: 'admin', password: 'admin123' },
            user: { email: 'user', password: 'user123' },
        };
        
        const base = baseUsers[type];
        return {
            email: `${base.email}_worker${this.workerId}@test.com`,
            password: base.password,
        };
    }
}

/*
 * Best Practice 7: Sharding by Tags
 * 
 * Run different tag groups on different machines:
 * 
 * Machine 1: npx cucumber-js --tags "@shard1"
 * Machine 2: npx cucumber-js --tags "@shard2"
 * Machine 3: npx cucumber-js --tags "@shard3"
 */

/*
 * Best Practice 8: Worker Cleanup
 */
AfterAll(async function () {
    const workerId = getWorkerId();
    console.log(`Worker ${workerId}: Cleaning up resources`);
    
    // Clean up worker-specific resources
    // await cleanupWorkerResources(workerId);
});

/*
 * Best Practice 9: Parallel Execution Report
 */
interface ParallelExecutionStats {
    workerId: string;
    scenariosRun: number;
    passed: number;
    failed: number;
    duration: number;
}

const workerStats: ParallelExecutionStats = {
    workerId: getWorkerId(),
    scenariosRun: 0,
    passed: 0,
    failed: 0,
    duration: 0,
};

After(async function (scenario) {
    workerStats.scenariosRun++;
    if (scenario.result?.status === 'PASSED') {
        workerStats.passed++;
    } else {
        workerStats.failed++;
    }
});

AfterAll(async function () {
    console.log(`Worker ${workerStats.workerId} Stats:`, workerStats);
});

// Export
export {
    getWorkerId,
    getWorkerSpecificEmail,
    generateUniqueResourceName,
    ResourceLock,
    ParallelSafeFixtures,
};

