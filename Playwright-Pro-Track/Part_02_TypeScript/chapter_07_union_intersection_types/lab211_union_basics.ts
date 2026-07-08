/**
 * Lab 211: Union Type Basics
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Union types in TypeScript:
 * 
 * - Union syntax
 * - Type narrowing
 * - Common use cases
 * - Union with literals
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create union types
 * 2. Narrow union types
 * 3. Use literal unions
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Union Types
console.log("--- Basic Union Types ---");

let id: string | number;

id = "abc123";
console.log("String ID:", id);

id = 12345;
console.log("Number ID:", id);

// Solution 2: Union in Function Parameters
console.log("\n--- Function Parameters ---");

function formatId(id: string | number): string {
    if (typeof id === "string") {
        return id.toUpperCase();
    }
    return id.toString().padStart(5, "0");
}

console.log(formatId("abc"));
console.log(formatId(42));

// Solution 3: Literal Union Types
console.log("\n--- Literal Unions ---");

type Status = "pending" | "active" | "completed" | "cancelled";
type Direction = "north" | "south" | "east" | "west";
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

let status: Status = "pending";
status = "active";
// status = "invalid"; // Error

console.log("Status:", status);

// Solution 4: Union with Objects
console.log("\n--- Object Unions ---");

type SuccessResponse = {
    success: true;
    data: unknown;
};

type ErrorResponse = {
    success: false;
    error: string;
};

type ApiResponse = SuccessResponse | ErrorResponse;

function handleResponse(response: ApiResponse): void {
    if (response.success) {
        console.log("Data:", response.data);
    } else {
        console.log("Error:", response.error);
    }
}

handleResponse({ success: true, data: { id: 1 } });
handleResponse({ success: false, error: "Not found" });

// Solution 5: Discriminated Unions
console.log("\n--- Discriminated Unions ---");

type Circle = {
    kind: "circle";
    radius: number;
};

type Rectangle = {
    kind: "rectangle";
    width: number;
    height: number;
};

type Triangle = {
    kind: "triangle";
    base: number;
    height: number;
};

type Shape = Circle | Rectangle | Triangle;

function getArea(shape: Shape): number {
    switch (shape.kind) {
        case "circle":
            return Math.PI * shape.radius ** 2;
        case "rectangle":
            return shape.width * shape.height;
        case "triangle":
            return (shape.base * shape.height) / 2;
    }
}

console.log("Circle area:", getArea({ kind: "circle", radius: 5 }));
console.log("Rectangle area:", getArea({ kind: "rectangle", width: 4, height: 5 }));

// Solution 6: Union with Arrays
console.log("\n--- Union with Arrays ---");

type StringOrNumber = string | number;
let mixed: StringOrNumber[] = [1, "two", 3, "four"];

console.log("Mixed array:", mixed);

// Array of specific types
type NumberArray = number[];
type StringArray = string[];
type MixedArray = NumberArray | StringArray;

// Solution 7: Nullable Types
console.log("\n--- Nullable Types ---");

type NullableString = string | null;
type OptionalNumber = number | undefined;
type MaybeUser = { name: string } | null | undefined;

function greet(name: string | null): string {
    if (name === null) {
        return "Hello, Guest!";
    }
    return `Hello, ${name}!`;
}

console.log(greet("John"));
console.log(greet(null));

// Solution 8: Union Type Narrowing
console.log("\n--- Type Narrowing ---");

function process(value: string | number | boolean): string {
    // typeof narrowing
    if (typeof value === "string") {
        return `String: ${value.toUpperCase()}`;
    }
    if (typeof value === "number") {
        return `Number: ${value.toFixed(2)}`;
    }
    return `Boolean: ${value}`;
}

console.log(process("hello"));
console.log(process(42.5));
console.log(process(true));

// Solution 9: Union with Functions
console.log("\n--- Union with Functions ---");

type StringTransform = (s: string) => string;
type NumberTransform = (n: number) => number;
type Transform = StringTransform | NumberTransform;

// Function returning union
function getValue(key: string): string | number {
    const values: Record<string, string | number> = {
        name: "John",
        age: 30
    };
    return values[key];
}

console.log("Name:", getValue("name"));
console.log("Age:", getValue("age"));

// Solution 10: Practical Examples
console.log("\n--- Practical Examples ---");

// Event types
type MouseEvent = { type: "click"; x: number; y: number };
type KeyboardEvent = { type: "keypress"; key: string };
type Event = MouseEvent | KeyboardEvent;

function handleEvent(event: Event): void {
    if (event.type === "click") {
        console.log(`Click at (${event.x}, ${event.y})`);
    } else {
        console.log(`Key pressed: ${event.key}`);
    }
}

handleEvent({ type: "click", x: 100, y: 200 });
handleEvent({ type: "keypress", key: "Enter" });

// Configuration options
type LogLevel = "debug" | "info" | "warn" | "error";
type LogOutput = "console" | "file" | "remote";

interface LogConfig {
    level: LogLevel;
    output: LogOutput;
}

const config: LogConfig = {
    level: "info",
    output: "console"
};

console.log("Log config:", config);

