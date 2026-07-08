/**
 * Lab 125: Error Propagation
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * How errors propagate through code:
 * 
 * - Call stack unwinding
 * - Catching at different levels
 * - Re-throwing errors
 * - Error boundaries
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Understand error propagation
 * 2. Catch at appropriate levels
 * 3. Implement error boundaries
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Propagation
console.log("--- Basic Propagation ---");

function level3() {
    throw new Error("Error at level 3");
}

function level2() {
    level3();
}

function level1() {
    level2();
}

try {
    level1();
} catch (error) {
    console.log("Caught at top level:", error.message);
}

// Solution 2: Catching at Different Levels
console.log("\n--- Different Levels ---");

function innerOperation() {
    throw new Error("Inner error");
}

function middleOperation() {
    try {
        innerOperation();
    } catch (error) {
        console.log("Middle caught:", error.message);
        // Handle or re-throw
        throw new Error("Middle error: " + error.message);
    }
}

function outerOperation() {
    try {
        middleOperation();
    } catch (error) {
        console.log("Outer caught:", error.message);
    }
}

outerOperation();

// Solution 3: Selective Catching
console.log("\n--- Selective Catching ---");

class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = "ValidationError";
    }
}

class DatabaseError extends Error {
    constructor(message) {
        super(message);
        this.name = "DatabaseError";
    }
}

function processRequest(type) {
    if (type === "validation") {
        throw new ValidationError("Invalid input");
    } else if (type === "database") {
        throw new DatabaseError("Connection failed");
    }
}

function handleRequest(type) {
    try {
        processRequest(type);
    } catch (error) {
        if (error instanceof ValidationError) {
            console.log("Validation handled locally:", error.message);
            return { error: error.message };
        }
        // Re-throw other errors
        throw error;
    }
}

try {
    handleRequest("validation");
    handleRequest("database");
} catch (error) {
    console.log("Unhandled error:", error.message);
}

// Solution 4: Error Enrichment
console.log("\n--- Error Enrichment ---");

function enrichError(error, context) {
    error.context = context;
    error.timestamp = new Date();
    return error;
}

function dataLayer() {
    throw new Error("Query failed");
}

function serviceLayer(userId) {
    try {
        dataLayer();
    } catch (error) {
        throw enrichError(error, { layer: "service", userId });
    }
}

try {
    serviceLayer(123);
} catch (error) {
    console.log("Error:", error.message);
    console.log("Context:", error.context);
}

// Solution 5: Error Boundary Pattern
console.log("\n--- Error Boundary ---");

class ErrorBoundary {
    constructor(fallback) {
        this.fallback = fallback;
    }
    
    execute(fn) {
        try {
            return fn();
        } catch (error) {
            console.log("Boundary caught:", error.message);
            return this.fallback;
        }
    }
    
    async executeAsync(fn) {
        try {
            return await fn();
        } catch (error) {
            console.log("Async boundary caught:", error.message);
            return this.fallback;
        }
    }
}

const boundary = new ErrorBoundary({ data: null, error: true });

const result = boundary.execute(() => {
    throw new Error("Component error");
});

console.log("Boundary result:", result);

// Solution 6: Propagation in Async
console.log("\n--- Async Propagation ---");

async function asyncLevel3() {
    throw new Error("Async error at level 3");
}

async function asyncLevel2() {
    await asyncLevel3();
}

async function asyncLevel1() {
    await asyncLevel2();
}

asyncLevel1().catch(error => {
    console.log("Async caught at top:", error.message);
});

// Solution 7: Promise Chain Propagation
console.log("\n--- Promise Chain ---");

Promise.resolve()
    .then(() => {
        throw new Error("Error in chain");
    })
    .then(() => {
        console.log("This won't run");
    })
    .then(() => {
        console.log("This won't run either");
    })
    .catch(error => {
        console.log("Chain caught:", error.message);
    })
    .then(() => {
        console.log("This runs after catch");
    });

// Solution 8: Global Error Handler
console.log("\n--- Global Handler ---");

// Node.js
process.on("uncaughtException", (error) => {
    console.log("Uncaught:", error.message);
    // Log and exit gracefully
});

process.on("unhandledRejection", (reason) => {
    console.log("Unhandled rejection:", reason);
});

// Solution 9: Error Aggregation
console.log("\n--- Error Aggregation ---");

function runAll(operations) {
    const errors = [];
    const results = [];
    
    for (const op of operations) {
        try {
            results.push(op());
        } catch (error) {
            errors.push(error);
        }
    }
    
    if (errors.length > 0) {
        const aggregateError = new Error(`${errors.length} operations failed`);
        aggregateError.errors = errors;
        throw aggregateError;
    }
    
    return results;
}

try {
    runAll([
        () => "success",
        () => { throw new Error("fail 1"); },
        () => { throw new Error("fail 2"); }
    ]);
} catch (error) {
    console.log(error.message);
    error.errors.forEach(e => console.log("  -", e.message));
}

