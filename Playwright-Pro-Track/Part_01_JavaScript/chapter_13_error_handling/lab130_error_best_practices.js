/**
 * Lab 130: Error Handling Best Practices
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Best practices for error handling:
 * 
 * 1. Be specific with error types
 * 2. Don't swallow errors
 * 3. Log appropriately
 * 4. Fail fast
 * 5. Provide context
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Apply best practices
 * 2. Refactor error handling
 * 3. Write robust code
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Best Practice 1: Use Specific Error Types
console.log("--- Specific Error Types ---");

class ValidationError extends Error {
    constructor(field, message) {
        super(message);
        this.name = "ValidationError";
        this.field = field;
    }
}

class NotFoundError extends Error {
    constructor(resource, id) {
        super(`${resource} with id ${id} not found`);
        this.name = "NotFoundError";
        this.resource = resource;
        this.resourceId = id;
    }
}

// Best Practice 2: Don't Swallow Errors
console.log("\n--- Don't Swallow Errors ---");

// BAD: Swallowing errors
function badErrorHandling() {
    try {
        throw new Error("Important error");
    } catch (error) {
        // Error is swallowed - no logging, no re-throw
    }
}

// GOOD: Handle or propagate
function goodErrorHandling() {
    try {
        throw new Error("Important error");
    } catch (error) {
        console.error("Error occurred:", error.message);
        // Either handle it or re-throw
        throw error;
    }
}

// Best Practice 3: Provide Context
console.log("\n--- Provide Context ---");

function processUser(userId, action) {
    try {
        throw new Error("Database error");
    } catch (error) {
        // Add context before re-throwing
        error.context = { userId, action, timestamp: new Date() };
        throw error;
    }
}

try {
    processUser(123, "update");
} catch (error) {
    console.log("Error:", error.message);
    console.log("Context:", error.context);
}

// Best Practice 4: Fail Fast
console.log("\n--- Fail Fast ---");

function createOrder(items, customer) {
    // Validate early
    if (!items || items.length === 0) {
        throw new ValidationError("items", "Order must have items");
    }
    
    if (!customer || !customer.id) {
        throw new ValidationError("customer", "Valid customer required");
    }
    
    // Main logic only runs if validation passes
    return { id: Date.now(), items, customer };
}

// Best Practice 5: Use Error Boundaries
console.log("\n--- Error Boundaries ---");

function withErrorBoundary(fn, fallback) {
    return function(...args) {
        try {
            return fn(...args);
        } catch (error) {
            console.error("Boundary caught:", error.message);
            return typeof fallback === "function" ? fallback(error) : fallback;
        }
    };
}

const safeParse = withErrorBoundary(JSON.parse, {});
console.log("Safe parse:", safeParse("invalid"));

// Best Practice 6: Centralized Error Handling
console.log("\n--- Centralized Handling ---");

class ErrorHandler {
    static handle(error, context = {}) {
        // Log the error
        console.error({
            timestamp: new Date().toISOString(),
            error: error.message,
            stack: error.stack,
            context
        });
        
        // Determine response based on error type
        if (error instanceof ValidationError) {
            return { status: 400, message: error.message };
        }
        
        if (error instanceof NotFoundError) {
            return { status: 404, message: error.message };
        }
        
        // Default for unknown errors
        return { status: 500, message: "Internal server error" };
    }
}

const response = ErrorHandler.handle(
    new NotFoundError("User", 123),
    { endpoint: "/api/users/123" }
);
console.log("Response:", response);

// Best Practice 7: Async Error Handling
console.log("\n--- Async Best Practices ---");

// Always use try/catch with async/await
async function fetchData() {
    try {
        const response = await Promise.reject(new Error("Network error"));
        return response;
    } catch (error) {
        console.log("Fetch error:", error.message);
        return null;
    }
}

fetchData();

// Best Practice 8: Clean Up Resources
console.log("\n--- Resource Cleanup ---");

async function withResource(resourceFn, workFn) {
    const resource = await resourceFn();
    
    try {
        return await workFn(resource);
    } finally {
        // Always clean up
        if (resource.close) {
            await resource.close();
        }
        console.log("Resource cleaned up");
    }
}

// Best Practice 9: Error Messages
console.log("\n--- Error Messages ---");

// BAD: Vague messages
// throw new Error("Error");
// throw new Error("Invalid");

// GOOD: Descriptive messages
function validateEmail(email) {
    if (!email) {
        throw new Error("Email is required");
    }
    if (!email.includes("@")) {
        throw new Error(`Invalid email format: "${email}" must contain @`);
    }
}

// Best Practice 10: Document Error Behavior
console.log("\n--- Documentation ---");

/**
 * Fetches a user by ID
 * @param {number} id - The user ID
 * @returns {Promise<User>} The user object
 * @throws {ValidationError} If id is not a positive number
 * @throws {NotFoundError} If user doesn't exist
 * @throws {Error} If database connection fails
 */
async function getUser(id) {
    if (typeof id !== "number" || id <= 0) {
        throw new ValidationError("id", "ID must be a positive number");
    }
    // ... implementation
}

// Summary
console.log("\n--- Summary ---");
console.log(`
Error Handling Best Practices:
1. Use specific error types
2. Never swallow errors silently
3. Provide context with errors
4. Fail fast with validation
5. Use error boundaries
6. Centralize error handling
7. Handle async errors properly
8. Always clean up resources
9. Write descriptive error messages
10. Document error behavior
`);

