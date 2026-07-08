/**
 * Lab 154: Type Checking Modes
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * TypeScript type checking options:
 * 
 * - Strict mode
 * - Non-strict mode
 * - Individual strict flags
 * - Type checking behavior
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Understand strict mode
 * 2. Configure type checking
 * 3. Handle type errors
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Strict Null Checks
console.log("--- Strict Null Checks ---");

// With strictNullChecks: true
function getLength(str: string | null): number {
    // Must check for null
    if (str === null) {
        return 0;
    }
    return str.length;
}

console.log("Length of 'hello':", getLength("hello"));
console.log("Length of null:", getLength(null));

// Solution 2: No Implicit Any
console.log("\n--- No Implicit Any ---");

// With noImplicitAny: true, this would error:
// function process(data) { } // Error: Parameter 'data' implicitly has 'any' type

// Must explicitly type parameters
function process(data: unknown): void {
    console.log("Processing:", data);
}

process("some data");

// Solution 3: Strict Function Types
console.log("\n--- Strict Function Types ---");

type Handler = (event: MouseEvent) => void;

// With strictFunctionTypes, this is checked more strictly
const handleClick: Handler = (event: MouseEvent) => {
    console.log("Clicked at:", event.clientX, event.clientY);
};

// Simulated event
const mockEvent = { clientX: 100, clientY: 200 } as MouseEvent;
handleClick(mockEvent);

// Solution 4: Strict Property Initialization
console.log("\n--- Strict Property Initialization ---");

class User {
    name: string;
    email: string;
    age: number | undefined; // Explicitly undefined
    
    constructor(name: string, email: string) {
        this.name = name;
        this.email = email;
        // age is intentionally not initialized
    }
}

const user = new User("John", "john@example.com");
console.log("User:", user.name, user.age);

// Solution 5: No Implicit This
console.log("\n--- No Implicit This ---");

class Counter {
    count: number = 0;
    
    // Explicitly type 'this'
    increment(this: Counter): void {
        this.count++;
    }
    
    // Arrow function binds 'this' automatically
    decrement = (): void => {
        this.count--;
    };
    
    getCount(): number {
        return this.count;
    }
}

const counter = new Counter();
counter.increment();
counter.increment();
console.log("Count:", counter.getCount());

// Solution 6: Exact Optional Property Types
console.log("\n--- Optional Properties ---");

interface Config {
    name: string;
    debug?: boolean;
    timeout?: number;
}

function createConfig(options: Config): Config {
    return {
        name: options.name,
        debug: options.debug ?? false,
        timeout: options.timeout ?? 5000
    };
}

const config = createConfig({ name: "MyApp" });
console.log("Config:", config);

// Solution 7: Unknown vs Any
console.log("\n--- Unknown vs Any ---");

// any - no type checking
let anyValue: any = "hello";
anyValue.nonExistentMethod(); // No error at compile time

// unknown - requires type checking
let unknownValue: unknown = "hello";

// unknownValue.toUpperCase(); // Error: Object is of type 'unknown'

if (typeof unknownValue === "string") {
    console.log("Unknown as string:", unknownValue.toUpperCase());
}

// Solution 8: Type Assertions
console.log("\n--- Type Assertions ---");

interface ApiResponse {
    data: {
        id: number;
        name: string;
    };
}

// When you know more than TypeScript
const response = JSON.parse('{"data": {"id": 1, "name": "Test"}}') as ApiResponse;
console.log("Response:", response.data.name);

// Non-null assertion (use carefully!)
function processElement(element: HTMLElement | null): void {
    // Assert element is not null with !
    // const width = element!.offsetWidth; // Dangerous if element is null
    
    // Better: check first
    if (element) {
        console.log("Element exists");
    }
}

// Solution 9: Type Narrowing
console.log("\n--- Type Narrowing ---");

type Shape = 
    | { kind: "circle"; radius: number }
    | { kind: "rectangle"; width: number; height: number };

function getArea(shape: Shape): number {
    switch (shape.kind) {
        case "circle":
            return Math.PI * shape.radius ** 2;
        case "rectangle":
            return shape.width * shape.height;
    }
}

console.log("Circle area:", getArea({ kind: "circle", radius: 5 }).toFixed(2));
console.log("Rectangle area:", getArea({ kind: "rectangle", width: 4, height: 6 }));

// Solution 10: Exhaustiveness Checking
console.log("\n--- Exhaustiveness Checking ---");

type Status = "pending" | "active" | "completed";

function handleStatus(status: Status): string {
    switch (status) {
        case "pending":
            return "Waiting...";
        case "active":
            return "In progress";
        case "completed":
            return "Done!";
        default:
            // This ensures all cases are handled
            const _exhaustive: never = status;
            return _exhaustive;
    }
}

console.log("Status:", handleStatus("active"));

