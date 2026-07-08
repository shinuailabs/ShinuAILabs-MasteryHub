/**
 * Lab 228: Equality Narrowing
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Narrowing with equality checks:
 * 
 * - Strict equality (===)
 * - Loose equality (==)
 * - Null checks
 * - Literal comparisons
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Use equality narrowing
 * 2. Compare with literals
 * 3. Handle null/undefined
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Strict Equality
console.log("--- Strict Equality ---");

function processValue(value: string | number | null): string {
    if (value === null) {
        return "No value";
    }
    if (typeof value === "string") {
        return `String: ${value}`;
    }
    return `Number: ${value}`;
}

console.log(processValue("hello"));
console.log(processValue(42));
console.log(processValue(null));

// Solution 2: Comparing Two Values
console.log("\n--- Comparing Values ---");

function compare(a: string | number, b: string | number): string {
    if (a === b) {
        // Both same type and value
        return `Equal: ${a}`;
    }
    return `Not equal: ${a} vs ${b}`;
}

console.log(compare("hello", "hello"));
console.log(compare(42, 42));
console.log(compare("42", 42));

// Solution 3: Literal Type Narrowing
console.log("\n--- Literal Narrowing ---");

type Status = "pending" | "active" | "completed";

function getStatusMessage(status: Status): string {
    if (status === "pending") {
        return "Waiting to start";
    }
    if (status === "active") {
        return "In progress";
    }
    if (status === "completed") {
        return "Done!";
    }
    // TypeScript knows this is unreachable
    return status;
}

console.log(getStatusMessage("pending"));
console.log(getStatusMessage("active"));
console.log(getStatusMessage("completed"));

// Solution 4: Null/Undefined Checks
console.log("\n--- Null/Undefined ---");

function greet(name: string | null | undefined): string {
    // Check for null specifically
    if (name === null) {
        return "Hello, Anonymous!";
    }
    // Check for undefined specifically
    if (name === undefined) {
        return "Hello, Unknown!";
    }
    return `Hello, ${name}!`;
}

console.log(greet("John"));
console.log(greet(null));
console.log(greet(undefined));

// Solution 5: Loose Equality for Null
console.log("\n--- Loose Equality ---");

function process(value: string | null | undefined): string {
    // == null catches both null and undefined
    if (value == null) {
        return "No value provided";
    }
    return `Value: ${value}`;
}

console.log(process("hello"));
console.log(process(null));
console.log(process(undefined));

// Solution 6: Boolean Equality
console.log("\n--- Boolean Equality ---");

interface Feature {
    enabled: boolean | null;
    name: string;
}

function checkFeature(feature: Feature): string {
    if (feature.enabled === true) {
        return `${feature.name} is enabled`;
    }
    if (feature.enabled === false) {
        return `${feature.name} is disabled`;
    }
    return `${feature.name} status unknown`;
}

console.log(checkFeature({ name: "Dark Mode", enabled: true }));
console.log(checkFeature({ name: "Beta", enabled: false }));
console.log(checkFeature({ name: "Experimental", enabled: null }));

// Solution 7: Discriminant Equality
console.log("\n--- Discriminant Equality ---");

type Success = { type: "success"; data: unknown };
type Error = { type: "error"; message: string };
type Loading = { type: "loading" };

type State = Success | Error | Loading;

function renderState(state: State): string {
    if (state.type === "success") {
        return `Data: ${JSON.stringify(state.data)}`;
    }
    if (state.type === "error") {
        return `Error: ${state.message}`;
    }
    if (state.type === "loading") {
        return "Loading...";
    }
    return "Unknown state";
}

console.log(renderState({ type: "success", data: { id: 1 } }));
console.log(renderState({ type: "error", message: "Not found" }));
console.log(renderState({ type: "loading" }));

// Solution 8: Number Equality
console.log("\n--- Number Equality ---");

type HttpStatus = 200 | 201 | 400 | 401 | 404 | 500;

function getStatusText(status: HttpStatus): string {
    if (status === 200) return "OK";
    if (status === 201) return "Created";
    if (status === 400) return "Bad Request";
    if (status === 401) return "Unauthorized";
    if (status === 404) return "Not Found";
    if (status === 500) return "Internal Server Error";
    return "Unknown";
}

console.log(getStatusText(200));
console.log(getStatusText(404));
console.log(getStatusText(500));

// Solution 9: Inequality Narrowing
console.log("\n--- Inequality Narrowing ---");

function processNonNull(value: string | null): string {
    if (value !== null) {
        // value is string here
        return value.toUpperCase();
    }
    return "NULL";
}

function processNonEmpty(value: string): string {
    if (value !== "") {
        return `Non-empty: ${value}`;
    }
    return "Empty string";
}

console.log(processNonNull("hello"));
console.log(processNonNull(null));
console.log(processNonEmpty("hello"));
console.log(processNonEmpty(""));

// Solution 10: Practical Example
console.log("\n--- Practical Example ---");

interface ApiResponse<T> {
    status: number;
    data: T | null;
    error: string | null;
}

function handleResponse<T>(response: ApiResponse<T>): T {
    if (response.status === 200 && response.data !== null) {
        return response.data;
    }
    
    if (response.error !== null) {
        throw new Error(response.error);
    }
    
    throw new Error(`Unexpected status: ${response.status}`);
}

try {
    const data = handleResponse({
        status: 200,
        data: { id: 1, name: "John" },
        error: null
    });
    console.log("Data:", data);
} catch (e) {
    console.log("Error:", e);
}

try {
    handleResponse({
        status: 404,
        data: null,
        error: "Not found"
    });
} catch (e) {
    console.log("Caught:", (e as Error).message);
}

