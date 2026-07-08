/**
 * Lab 165: Void and Never Types
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Special return types:
 * 
 * - void: No return value
 * - never: Never returns
 * - undefined vs void
 * - Use cases
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Use void for functions
 * 2. Understand never type
 * 3. Apply in real scenarios
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: void Type
console.log("--- void Type ---");

// Function that doesn't return anything
function logMessage(message: string): void {
    console.log(message);
    // No return statement
}

function printUser(name: string, age: number): void {
    console.log(`${name} is ${age} years old`);
    return; // Explicit return without value is OK
}

logMessage("Hello, TypeScript!");
printUser("John", 30);

// Solution 2: void vs undefined
console.log("\n--- void vs undefined ---");

// void means "no return value"
function noReturn(): void {
    console.log("No return");
}

// undefined is an actual value
function returnsUndefined(): undefined {
    console.log("Returns undefined");
    return undefined;
}

const result1: void = noReturn();
const result2: undefined = returnsUndefined();

console.log("void result:", result1);
console.log("undefined result:", result2);

// Solution 3: void in Callbacks
console.log("\n--- void in Callbacks ---");

// Callback type with void return
type Callback = (data: string) => void;

function processData(callback: Callback): void {
    callback("processed data");
}

// Callback can return something, but it's ignored
processData((data) => {
    console.log("Received:", data);
    return 42; // Return value is ignored
});

// Array methods with void callbacks
const numbers = [1, 2, 3];
numbers.forEach((n): void => {
    console.log("Number:", n);
});

// Solution 4: never Type Basics
console.log("\n--- never Type ---");

// Function that never returns (throws)
function throwError(message: string): never {
    throw new Error(message);
}

// Function that never returns (infinite loop)
function infiniteLoop(): never {
    while (true) {
        // Never exits
    }
}

// Using never
function fail(message: string): never {
    throw new Error(message);
}

// Solution 5: never in Exhaustive Checks
console.log("\n--- Exhaustive Checks ---");

type Shape = "circle" | "square" | "triangle";

function getArea(shape: Shape): number {
    switch (shape) {
        case "circle":
            return Math.PI * 5 * 5;
        case "square":
            return 10 * 10;
        case "triangle":
            return 0.5 * 10 * 8;
        default:
            // This ensures all cases are handled
            const _exhaustive: never = shape;
            return _exhaustive;
    }
}

console.log("Circle area:", getArea("circle"));

// Solution 6: never in Type Narrowing
console.log("\n--- Type Narrowing ---");

function processValue(value: string | number): string {
    if (typeof value === "string") {
        return value.toUpperCase();
    }
    
    if (typeof value === "number") {
        return value.toString();
    }
    
    // value is never here - all cases handled
    const _never: never = value;
    return _never;
}

console.log(processValue("hello"));
console.log(processValue(42));

// Solution 7: never in Conditional Types
console.log("\n--- Conditional Types ---");

// Filter out certain types
type NonNullable<T> = T extends null | undefined ? never : T;

type MaybeString = string | null | undefined;
type DefinitelyString = NonNullable<MaybeString>; // string

// Extract specific types
type ExtractString<T> = T extends string ? T : never;
type StringOnly = ExtractString<string | number | boolean>; // string

// Solution 8: void Function Types
console.log("\n--- Function Types ---");

// Function type with void return
type VoidFunction = () => void;
type LogFunction = (message: string) => void;

const log: LogFunction = (msg) => {
    console.log(`[LOG] ${msg}`);
};

log("Test message");

// Method with void return
interface Logger {
    log(message: string): void;
    error(message: string): void;
    warn(message: string): void;
}

const logger: Logger = {
    log: (msg) => console.log(`[LOG] ${msg}`),
    error: (msg) => console.error(`[ERROR] ${msg}`),
    warn: (msg) => console.warn(`[WARN] ${msg}`)
};

logger.log("Info message");

// Solution 9: Practical Examples
console.log("\n--- Practical Examples ---");

// Assert function with never
function assertNever(value: never, message: string): never {
    throw new Error(`${message}: ${value}`);
}

// Event handler with void
type EventHandler<T> = (event: T) => void;

interface ClickEvent {
    x: number;
    y: number;
}

const handleClick: EventHandler<ClickEvent> = (event) => {
    console.log(`Clicked at (${event.x}, ${event.y})`);
};

handleClick({ x: 100, y: 200 });

// Solution 10: Summary
console.log("\n--- Summary ---");

/*
void:
- Function doesn't return a value
- Can be undefined
- Used for callbacks and event handlers

never:
- Function never returns
- Throws error or infinite loop
- Used for exhaustive checks
- Used in conditional types to filter

Key differences:
- void: Returns but with no value
- never: Never returns at all
*/

// Example showing the difference
function returnsVoid(): void {
    console.log("This returns void");
    // Function completes normally
}

function returnsNever(): never {
    throw new Error("This never returns");
    // Function never completes
}

returnsVoid();
// returnsNever(); // Would throw

console.log("void = no return value");
console.log("never = never returns");

