/**
 * Lab 121: Try/Catch Basics
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Error handling with try/catch:
 * 
 * - try: Code that might throw
 * - catch: Handle the error
 * - finally: Always executes
 * - Error object properties
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Use try/catch blocks
 * 2. Access error properties
 * 3. Handle different scenarios
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Try/Catch
console.log("--- Basic Try/Catch ---");

try {
    const result = JSON.parse("invalid json");
    console.log(result);
} catch (error) {
    console.log("Error caught:", error.message);
}

console.log("Code continues after error");

// Solution 2: Error Object Properties
console.log("\n--- Error Properties ---");

try {
    throw new Error("Something went wrong");
} catch (error) {
    console.log("Name:", error.name);
    console.log("Message:", error.message);
    console.log("Stack:", error.stack?.split("\n")[0]);
}

// Solution 3: Try/Catch/Finally
console.log("\n--- Try/Catch/Finally ---");

function processFile() {
    let file = null;
    
    try {
        file = "opened";
        console.log("File:", file);
        
        // Simulate error
        throw new Error("Processing failed");
        
    } catch (error) {
        console.log("Error:", error.message);
        
    } finally {
        // Always runs
        file = null;
        console.log("File closed (finally)");
    }
}

processFile();

// Solution 4: Finally Without Catch
console.log("\n--- Finally Without Catch ---");

function mustCleanup() {
    try {
        console.log("Doing work...");
        return "success";
    } finally {
        console.log("Cleanup runs even with return");
    }
}

const result = mustCleanup();
console.log("Result:", result);

// Solution 5: Nested Try/Catch
console.log("\n--- Nested Try/Catch ---");

try {
    console.log("Outer try");
    
    try {
        console.log("Inner try");
        throw new Error("Inner error");
    } catch (innerError) {
        console.log("Inner catch:", innerError.message);
        throw new Error("Rethrown error");
    }
    
} catch (outerError) {
    console.log("Outer catch:", outerError.message);
}

// Solution 6: Conditional Catch
console.log("\n--- Conditional Catch ---");

function riskyOperation(type) {
    if (type === "validation") {
        throw new TypeError("Invalid type");
    } else if (type === "range") {
        throw new RangeError("Out of range");
    }
    return "success";
}

try {
    riskyOperation("validation");
} catch (error) {
    if (error instanceof TypeError) {
        console.log("Type error:", error.message);
    } else if (error instanceof RangeError) {
        console.log("Range error:", error.message);
    } else {
        throw error; // Re-throw unknown errors
    }
}

// Solution 7: Optional Catch Binding
console.log("\n--- Optional Catch Binding ---");

// ES2019: catch without parameter
try {
    JSON.parse("invalid");
} catch {
    console.log("Parse failed (no error variable needed)");
}

// Solution 8: Error in Finally
console.log("\n--- Error in Finally ---");

function errorInFinally() {
    try {
        throw new Error("Try error");
    } catch (error) {
        console.log("Caught:", error.message);
    } finally {
        console.log("Finally runs");
        // Avoid throwing in finally - it overrides try/catch errors
    }
}

errorInFinally();

// Solution 9: Return in Finally
console.log("\n--- Return in Finally ---");

function returnInFinally() {
    try {
        return "try return";
    } finally {
        // This overrides the try return!
        // return "finally return"; // Avoid this
        console.log("Finally executes before return");
    }
}

console.log("Function returned:", returnInFinally());

// Solution 10: Practical Example
console.log("\n--- Practical Example ---");

function parseConfig(jsonString) {
    try {
        const config = JSON.parse(jsonString);
        
        if (!config.name) {
            throw new Error("Config must have a name");
        }
        
        return config;
        
    } catch (error) {
        if (error instanceof SyntaxError) {
            console.log("Invalid JSON:", error.message);
            return { name: "default" };
        }
        
        console.log("Config error:", error.message);
        return { name: "default" };
    }
}

console.log(parseConfig('{"name": "app"}'));
console.log(parseConfig('invalid'));
console.log(parseConfig('{}'));

