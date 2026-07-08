/**
 * Lab 124: Throwing Errors
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * When and how to throw errors:
 * 
 * - throw statement
 * - Throwing different types
 * - When to throw vs return
 * - Error messages best practices
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Throw appropriate errors
 * 2. Write clear error messages
 * 3. Decide when to throw
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Throw
console.log("--- Basic Throw ---");

function divide(a, b) {
    if (b === 0) {
        throw new Error("Division by zero");
    }
    return a / b;
}

try {
    console.log(divide(10, 2));
    console.log(divide(10, 0));
} catch (error) {
    console.log("Error:", error.message);
}

// Solution 2: Throwing Different Types
console.log("\n--- Different Types ---");

// Throw Error object (recommended)
function throwError() {
    throw new Error("Error object");
}

// Throw string (not recommended)
function throwString() {
    throw "String error";
}

// Throw object (not recommended)
function throwObject() {
    throw { message: "Object error", code: 500 };
}

try {
    throwString();
} catch (error) {
    console.log("Caught:", error);
    console.log("Type:", typeof error);
}

// Solution 3: Validation with Throws
console.log("\n--- Validation ---");

function createUser(data) {
    if (!data) {
        throw new TypeError("Data is required");
    }
    
    if (typeof data.name !== "string") {
        throw new TypeError("Name must be a string");
    }
    
    if (data.name.length < 2) {
        throw new RangeError("Name must be at least 2 characters");
    }
    
    if (!data.email || !data.email.includes("@")) {
        throw new Error("Valid email is required");
    }
    
    return { id: Date.now(), ...data };
}

try {
    const user = createUser({ name: "J", email: "test" });
} catch (error) {
    console.log(`${error.name}: ${error.message}`);
}

// Solution 4: Throw vs Return
console.log("\n--- Throw vs Return ---");

// Return null/undefined for expected "not found"
function findUser(id) {
    const users = [{ id: 1, name: "John" }];
    return users.find(u => u.id === id) || null;
}

// Throw for unexpected errors
function getUser(id) {
    if (typeof id !== "number") {
        throw new TypeError("ID must be a number");
    }
    
    const user = findUser(id);
    if (!user) {
        throw new Error(`User ${id} not found`);
    }
    
    return user;
}

console.log("Find (returns null):", findUser(999));

try {
    getUser(999);
} catch (error) {
    console.log("Get (throws):", error.message);
}

// Solution 5: Descriptive Error Messages
console.log("\n--- Descriptive Messages ---");

function processOrder(order) {
    // BAD: Vague message
    // throw new Error("Invalid order");
    
    // GOOD: Specific message
    if (!order.items || order.items.length === 0) {
        throw new Error("Order must contain at least one item");
    }
    
    if (order.total < 0) {
        throw new Error(`Invalid order total: ${order.total}. Total must be positive`);
    }
    
    return order;
}

try {
    processOrder({ items: [], total: -10 });
} catch (error) {
    console.log("Error:", error.message);
}

// Solution 6: Conditional Throwing
console.log("\n--- Conditional Throwing ---");

function assertCondition(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

function processData(data) {
    assertCondition(data !== null, "Data cannot be null");
    assertCondition(Array.isArray(data), "Data must be an array");
    assertCondition(data.length > 0, "Data cannot be empty");
    
    return data.map(x => x * 2);
}

try {
    processData([1, 2, 3]);
    processData(null);
} catch (error) {
    console.log("Assertion failed:", error.message);
}

// Solution 7: Re-throwing Errors
console.log("\n--- Re-throwing ---");

function innerFunction() {
    throw new Error("Inner error");
}

function outerFunction() {
    try {
        innerFunction();
    } catch (error) {
        console.log("Logging error:", error.message);
        throw error; // Re-throw for caller to handle
    }
}

try {
    outerFunction();
} catch (error) {
    console.log("Outer caught:", error.message);
}

// Solution 8: Wrapping Errors
console.log("\n--- Wrapping Errors ---");

class ServiceError extends Error {
    constructor(message, originalError) {
        super(message);
        this.name = "ServiceError";
        this.originalError = originalError;
    }
}

function callExternalService() {
    throw new Error("Network timeout");
}

function serviceWrapper() {
    try {
        return callExternalService();
    } catch (error) {
        throw new ServiceError(
            "External service failed",
            error
        );
    }
}

try {
    serviceWrapper();
} catch (error) {
    console.log("Service error:", error.message);
    console.log("Original:", error.originalError.message);
}

// Solution 9: Throw in Async
console.log("\n--- Async Throwing ---");

async function asyncThrow() {
    throw new Error("Async error");
}

asyncThrow().catch(error => console.log("Async caught:", error.message));

// Solution 10: Guard Clauses
console.log("\n--- Guard Clauses ---");

function processPayment(amount, card) {
    // Guard clauses at the start
    if (amount <= 0) throw new Error("Amount must be positive");
    if (!card) throw new Error("Card is required");
    if (!card.number) throw new Error("Card number is required");
    if (card.expired) throw new Error("Card has expired");
    
    // Main logic after guards
    console.log(`Processing $${amount} payment`);
    return { success: true, amount };
}

try {
    processPayment(100, { number: "1234", expired: false });
    processPayment(-50, null);
} catch (error) {
    console.log("Payment error:", error.message);
}

