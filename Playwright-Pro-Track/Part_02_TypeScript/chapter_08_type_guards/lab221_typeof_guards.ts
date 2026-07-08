/**
 * Lab 221: typeof Type Guards
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Using typeof for type narrowing:
 * 
 * - Primitive type checks
 * - typeof limitations
 * - Combining checks
 * - Best practices
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Use typeof guards
 * 2. Handle primitives
 * 3. Combine with other checks
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic typeof Guards
console.log("--- Basic typeof Guards ---");

function processValue(value: string | number | boolean): string {
    if (typeof value === "string") {
        return `String: ${value.toUpperCase()}`;
    }
    if (typeof value === "number") {
        return `Number: ${value.toFixed(2)}`;
    }
    return `Boolean: ${value}`;
}

console.log(processValue("hello"));
console.log(processValue(42.5));
console.log(processValue(true));

// Solution 2: typeof with Objects
console.log("\n--- typeof with Objects ---");

function describe(value: string | object | null): string {
    if (typeof value === "string") {
        return `String of length ${value.length}`;
    }
    if (typeof value === "object") {
        if (value === null) {
            return "Null value";
        }
        return `Object with keys: ${Object.keys(value).join(", ")}`;
    }
    return "Unknown";
}

console.log(describe("hello"));
console.log(describe({ a: 1, b: 2 }));
console.log(describe(null));

// Solution 3: typeof with Functions
console.log("\n--- typeof with Functions ---");

type Callback = () => void;
type ValueOrCallback = string | Callback;

function execute(input: ValueOrCallback): string {
    if (typeof input === "function") {
        input();
        return "Function executed";
    }
    return `Value: ${input}`;
}

console.log(execute("hello"));
console.log(execute(() => console.log("Callback!")));

// Solution 4: typeof Limitations
console.log("\n--- typeof Limitations ---");

// typeof returns limited set of values:
// "string", "number", "boolean", "undefined", "object", "function", "symbol", "bigint"

function checkType(value: unknown): string {
    const type = typeof value;
    
    switch (type) {
        case "string":
            return "It's a string";
        case "number":
            return "It's a number";
        case "boolean":
            return "It's a boolean";
        case "undefined":
            return "It's undefined";
        case "object":
            // Could be null, array, or object
            if (value === null) return "It's null";
            if (Array.isArray(value)) return "It's an array";
            return "It's an object";
        case "function":
            return "It's a function";
        case "symbol":
            return "It's a symbol";
        case "bigint":
            return "It's a bigint";
        default:
            return "Unknown type";
    }
}

console.log(checkType("hello"));
console.log(checkType([1, 2, 3]));
console.log(checkType(null));

// Solution 5: Combining typeof Checks
console.log("\n--- Combining Checks ---");

function formatInput(input: string | number | string[] | null): string {
    if (input === null) {
        return "No input";
    }
    if (typeof input === "string") {
        return input.trim();
    }
    if (typeof input === "number") {
        return input.toString();
    }
    // Must be string[]
    return input.join(", ");
}

console.log(formatInput("  hello  "));
console.log(formatInput(42));
console.log(formatInput(["a", "b", "c"]));
console.log(formatInput(null));

// Solution 6: typeof in Generic Functions
console.log("\n--- Generic typeof ---");

function stringify<T>(value: T): string {
    if (typeof value === "string") {
        return value;
    }
    if (typeof value === "number" || typeof value === "boolean") {
        return String(value);
    }
    if (typeof value === "object" && value !== null) {
        return JSON.stringify(value);
    }
    return String(value);
}

console.log(stringify("hello"));
console.log(stringify(42));
console.log(stringify({ a: 1 }));

// Solution 7: typeof with Default Values
console.log("\n--- Default Values ---");

function getLength(value: string | number | undefined): number {
    if (typeof value === "undefined") {
        return 0;
    }
    if (typeof value === "string") {
        return value.length;
    }
    return value.toString().length;
}

console.log(getLength("hello"));
console.log(getLength(12345));
console.log(getLength(undefined));

// Solution 8: Practical Example
console.log("\n--- Practical Example ---");

type ConfigValue = string | number | boolean | null;

interface Config {
    [key: string]: ConfigValue;
}

function parseConfigValue(value: ConfigValue): string {
    if (typeof value === "string") {
        return value;
    }
    if (typeof value === "number") {
        return value.toString();
    }
    if (typeof value === "boolean") {
        return value ? "true" : "false";
    }
    return "null";
}

const config: Config = {
    host: "localhost",
    port: 3000,
    debug: true,
    apiKey: null
};

for (const [key, value] of Object.entries(config)) {
    console.log(`${key}: ${parseConfigValue(value)}`);
}

