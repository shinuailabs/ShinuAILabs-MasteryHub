/**
 * Lab 128: Defensive Programming
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Preventing errors before they occur:
 * 
 * - Input validation
 * - Default values
 * - Guard clauses
 * - Null checks
 * - Type checking
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Validate inputs
 * 2. Use defensive patterns
 * 3. Handle edge cases
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Input Validation
console.log("--- Input Validation ---");

function createUser(name, email, age) {
    // Validate all inputs
    if (typeof name !== "string" || name.trim() === "") {
        throw new Error("Name must be a non-empty string");
    }
    
    if (typeof email !== "string" || !email.includes("@")) {
        throw new Error("Valid email is required");
    }
    
    if (typeof age !== "number" || age < 0 || age > 150) {
        throw new Error("Age must be a number between 0 and 150");
    }
    
    return { name: name.trim(), email, age };
}

try {
    console.log(createUser("John", "john@example.com", 30));
    console.log(createUser("", "invalid", -5));
} catch (error) {
    console.log("Validation error:", error.message);
}

// Solution 2: Default Values
console.log("\n--- Default Values ---");

function fetchData(options = {}) {
    const {
        url = "/api/data",
        method = "GET",
        timeout = 5000,
        retries = 3
    } = options;
    
    console.log("Fetching:", { url, method, timeout, retries });
}

fetchData();
fetchData({ url: "/api/users", timeout: 10000 });

// Solution 3: Guard Clauses
console.log("\n--- Guard Clauses ---");

function processOrder(order) {
    // Early returns for invalid cases
    if (!order) {
        console.log("No order provided");
        return null;
    }
    
    if (!order.items || order.items.length === 0) {
        console.log("Order has no items");
        return null;
    }
    
    if (order.status === "cancelled") {
        console.log("Order is cancelled");
        return null;
    }
    
    // Main logic
    console.log("Processing order:", order.id);
    return { processed: true, orderId: order.id };
}

processOrder(null);
processOrder({ items: [] });
processOrder({ id: 1, items: ["item1"], status: "pending" });

// Solution 4: Null/Undefined Checks
console.log("\n--- Null Checks ---");

function getUserName(user) {
    // Optional chaining
    return user?.profile?.name ?? "Anonymous";
}

console.log(getUserName({ profile: { name: "John" } }));
console.log(getUserName({ profile: {} }));
console.log(getUserName(null));

// Solution 5: Type Checking
console.log("\n--- Type Checking ---");

function add(a, b) {
    if (typeof a !== "number" || typeof b !== "number") {
        throw new TypeError("Both arguments must be numbers");
    }
    
    if (!Number.isFinite(a) || !Number.isFinite(b)) {
        throw new RangeError("Arguments must be finite numbers");
    }
    
    return a + b;
}

console.log(add(5, 3));

try {
    add("5", 3);
} catch (error) {
    console.log("Type error:", error.message);
}

// Solution 6: Array Safety
console.log("\n--- Array Safety ---");

function safeArrayAccess(arr, index, defaultValue = null) {
    if (!Array.isArray(arr)) return defaultValue;
    if (index < 0 || index >= arr.length) return defaultValue;
    return arr[index];
}

const items = ["a", "b", "c"];
console.log(safeArrayAccess(items, 1));
console.log(safeArrayAccess(items, 10, "default"));
console.log(safeArrayAccess(null, 0, "default"));

// Solution 7: Object Property Safety
console.log("\n--- Property Safety ---");

function safeGet(obj, path, defaultValue = undefined) {
    const keys = path.split(".");
    let result = obj;
    
    for (const key of keys) {
        if (result == null) return defaultValue;
        result = result[key];
    }
    
    return result ?? defaultValue;
}

const data = { user: { profile: { name: "John" } } };
console.log(safeGet(data, "user.profile.name"));
console.log(safeGet(data, "user.settings.theme", "light"));

// Solution 8: Assertion Functions
console.log("\n--- Assertions ---");

function assert(condition, message) {
    if (!condition) {
        throw new Error(`Assertion failed: ${message}`);
    }
}

function assertType(value, type, name) {
    assert(typeof value === type, `${name} must be a ${type}`);
}

function assertNotNull(value, name) {
    assert(value != null, `${name} cannot be null or undefined`);
}

function processData(data) {
    assertNotNull(data, "data");
    assertType(data.id, "number", "data.id");
    assertType(data.name, "string", "data.name");
    
    console.log("Data is valid:", data);
}

try {
    processData({ id: 1, name: "Test" });
    processData({ id: "1", name: "Test" });
} catch (error) {
    console.log(error.message);
}

// Solution 9: Safe JSON Parsing
console.log("\n--- Safe JSON Parsing ---");

function safeJsonParse(json, defaultValue = null) {
    try {
        return JSON.parse(json);
    } catch {
        return defaultValue;
    }
}

console.log(safeJsonParse('{"name": "John"}'));
console.log(safeJsonParse('invalid json', {}));

// Solution 10: Defensive Object Creation
console.log("\n--- Defensive Objects ---");

function createConfig(options) {
    const defaults = {
        debug: false,
        timeout: 5000,
        retries: 3,
        baseUrl: "http://localhost"
    };
    
    // Merge with validation
    const config = { ...defaults };
    
    if (options) {
        if (typeof options.debug === "boolean") config.debug = options.debug;
        if (typeof options.timeout === "number" && options.timeout > 0) {
            config.timeout = options.timeout;
        }
        if (typeof options.retries === "number" && options.retries >= 0) {
            config.retries = options.retries;
        }
        if (typeof options.baseUrl === "string") config.baseUrl = options.baseUrl;
    }
    
    // Freeze to prevent modifications
    return Object.freeze(config);
}

const config = createConfig({ timeout: 10000, invalid: "ignored" });
console.log("Config:", config);

