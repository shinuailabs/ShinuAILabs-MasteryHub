/**
 * Lab 122: Built-in Error Types
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * JavaScript built-in error types:
 * 
 * - Error: Base error type
 * - TypeError: Wrong type
 * - ReferenceError: Invalid reference
 * - SyntaxError: Invalid syntax
 * - RangeError: Out of range
 * - URIError: Invalid URI
 * - EvalError: eval() error
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Identify error types
 * 2. Handle specific errors
 * 3. Understand when each occurs
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Error (Base Type)
console.log("--- Error (Base) ---");

try {
    throw new Error("Generic error");
} catch (error) {
    console.log("Type:", error.name);
    console.log("Message:", error.message);
}

// Solution 2: TypeError
console.log("\n--- TypeError ---");

try {
    const obj = null;
    obj.property; // Cannot read property of null
} catch (error) {
    console.log("Type:", error.name);
    console.log("Message:", error.message);
}

try {
    const num = 42;
    num.toUpperCase(); // num is not a string
} catch (error) {
    console.log("Type:", error.name);
    console.log("Message:", error.message);
}

// Solution 3: ReferenceError
console.log("\n--- ReferenceError ---");

try {
    console.log(undefinedVariable);
} catch (error) {
    console.log("Type:", error.name);
    console.log("Message:", error.message);
}

// Solution 4: SyntaxError
console.log("\n--- SyntaxError ---");

try {
    eval("const x = ;"); // Invalid syntax
} catch (error) {
    console.log("Type:", error.name);
    console.log("Message:", error.message);
}

try {
    JSON.parse("{invalid}");
} catch (error) {
    console.log("Type:", error.name);
    console.log("Message:", error.message);
}

// Solution 5: RangeError
console.log("\n--- RangeError ---");

try {
    const arr = new Array(-1); // Invalid array length
} catch (error) {
    console.log("Type:", error.name);
    console.log("Message:", error.message);
}

try {
    const num = 1;
    num.toFixed(101); // Precision out of range
} catch (error) {
    console.log("Type:", error.name);
    console.log("Message:", error.message);
}

// Solution 6: URIError
console.log("\n--- URIError ---");

try {
    decodeURIComponent("%"); // Invalid URI
} catch (error) {
    console.log("Type:", error.name);
    console.log("Message:", error.message);
}

// Solution 7: Handling Multiple Error Types
console.log("\n--- Multiple Error Types ---");

function handleError(error) {
    switch (error.constructor) {
        case TypeError:
            console.log("Type error - check your types");
            break;
        case ReferenceError:
            console.log("Reference error - variable not defined");
            break;
        case SyntaxError:
            console.log("Syntax error - check your code");
            break;
        case RangeError:
            console.log("Range error - value out of range");
            break;
        default:
            console.log("Unknown error:", error.message);
    }
}

handleError(new TypeError("test"));
handleError(new RangeError("test"));

// Solution 8: instanceof Check
console.log("\n--- instanceof Check ---");

function processError(error) {
    if (error instanceof TypeError) {
        return { code: "TYPE_ERROR", recoverable: true };
    }
    if (error instanceof ReferenceError) {
        return { code: "REF_ERROR", recoverable: false };
    }
    if (error instanceof SyntaxError) {
        return { code: "SYNTAX_ERROR", recoverable: false };
    }
    return { code: "UNKNOWN", recoverable: false };
}

console.log(processError(new TypeError("test")));
console.log(processError(new SyntaxError("test")));

// Solution 9: Error Hierarchy
console.log("\n--- Error Hierarchy ---");

const errors = [
    new Error("base"),
    new TypeError("type"),
    new RangeError("range"),
    new SyntaxError("syntax")
];

errors.forEach(error => {
    console.log(`${error.name} instanceof Error:`, error instanceof Error);
});

// Solution 10: Practical Error Handling
console.log("\n--- Practical Example ---");

function safeParseInt(value) {
    if (typeof value === "undefined") {
        throw new ReferenceError("Value is undefined");
    }
    
    if (typeof value !== "string" && typeof value !== "number") {
        throw new TypeError("Value must be string or number");
    }
    
    const result = parseInt(value, 10);
    
    if (isNaN(result)) {
        throw new RangeError("Value cannot be parsed as integer");
    }
    
    return result;
}

try {
    console.log(safeParseInt("42"));
    console.log(safeParseInt("abc"));
} catch (error) {
    console.log(`${error.name}: ${error.message}`);
}

