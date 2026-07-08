/**
 * Lab 175: Return Type Annotations
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Specifying function return types:
 * 
 * - Explicit return types
 * - Inferred return types
 * - Complex return types
 * - When to annotate
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Add return type annotations
 * 2. Understand return type inference
 * 3. Handle complex returns
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Return Types
console.log("--- Basic Return Types ---");

function add(a: number, b: number): number {
    return a + b;
}

function greet(name: string): string {
    return `Hello, ${name}!`;
}

function isEven(n: number): boolean {
    return n % 2 === 0;
}

console.log("Add:", add(5, 3));
console.log("Greet:", greet("World"));
console.log("Is even:", isEven(4));

// Solution 2: Void Return Type
console.log("\n--- Void Return Type ---");

function logMessage(message: string): void {
    console.log(`[LOG] ${message}`);
}

function printUser(name: string, age: number): void {
    console.log(`${name} is ${age} years old`);
    // No return statement
}

logMessage("Test message");
printUser("John", 30);

// Solution 3: Never Return Type
console.log("\n--- Never Return Type ---");

function throwError(message: string): never {
    throw new Error(message);
}

function infiniteLoop(): never {
    while (true) {
        // Never returns
    }
}

// Exhaustive check helper
function assertNever(value: never): never {
    throw new Error(`Unexpected value: ${value}`);
}

// Solution 4: Object Return Types
console.log("\n--- Object Return Types ---");

type User = {
    id: number;
    name: string;
    email: string;
};

function createUser(name: string, email: string): User {
    return {
        id: Date.now(),
        name,
        email
    };
}

function getUser(id: number): User | null {
    if (id > 0) {
        return { id, name: "John", email: "john@example.com" };
    }
    return null;
}

console.log("Created user:", createUser("John", "john@example.com"));
console.log("Get user:", getUser(1));

// Solution 5: Array Return Types
console.log("\n--- Array Return Types ---");

function getNumbers(): number[] {
    return [1, 2, 3, 4, 5];
}

function getUsers(): User[] {
    return [
        { id: 1, name: "John", email: "john@example.com" },
        { id: 2, name: "Jane", email: "jane@example.com" }
    ];
}

function range(start: number, end: number): number[] {
    const result: number[] = [];
    for (let i = start; i <= end; i++) {
        result.push(i);
    }
    return result;
}

console.log("Numbers:", getNumbers());
console.log("Range:", range(1, 5));

// Solution 6: Tuple Return Types
console.log("\n--- Tuple Return Types ---");

function getMinMax(arr: number[]): [number, number] {
    return [Math.min(...arr), Math.max(...arr)];
}

function parseCoordinate(str: string): [number, number] {
    const [x, y] = str.split(",").map(Number);
    return [x, y];
}

function useState<T>(initial: T): [T, (value: T) => void] {
    let state = initial;
    const setState = (value: T) => { state = value; };
    return [state, setState];
}

const [min, max] = getMinMax([3, 1, 4, 1, 5, 9]);
console.log("Min:", min, "Max:", max);

// Solution 7: Union Return Types
console.log("\n--- Union Return Types ---");

function findUser(id: number): User | undefined {
    const users: User[] = [
        { id: 1, name: "John", email: "john@example.com" }
    ];
    return users.find(u => u.id === id);
}

function parseValue(value: string): string | number {
    const num = Number(value);
    return isNaN(num) ? value : num;
}

console.log("Find user:", findUser(1));
console.log("Parse '42':", parseValue("42"));
console.log("Parse 'hello':", parseValue("hello"));

// Solution 8: Promise Return Types
console.log("\n--- Promise Return Types ---");

async function fetchUser(id: number): Promise<User> {
    // Simulated async operation
    return { id, name: "John", email: "john@example.com" };
}

async function fetchUsers(): Promise<User[]> {
    return [
        { id: 1, name: "John", email: "john@example.com" },
        { id: 2, name: "Jane", email: "jane@example.com" }
    ];
}

function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Solution 9: Generic Return Types
console.log("\n--- Generic Return Types ---");

function identity<T>(value: T): T {
    return value;
}

function first<T>(arr: T[]): T | undefined {
    return arr[0];
}

function wrap<T>(value: T): { value: T } {
    return { value };
}

console.log("Identity:", identity("hello"));
console.log("First:", first([1, 2, 3]));
console.log("Wrap:", wrap(42));

// Solution 10: When to Annotate Returns
console.log("\n--- When to Annotate ---");

/*
Always annotate return types when:
1. Public API functions
2. Complex return logic
3. Recursive functions
4. Function overloads

Let inference work when:
1. Simple, obvious returns
2. Arrow functions in callbacks
3. Internal helper functions
*/

// Good: Annotate public API
function calculateTotal(items: { price: number }[]): number {
    return items.reduce((sum, item) => sum + item.price, 0);
}

// OK: Let inference work for simple callbacks
const doubled = [1, 2, 3].map(n => n * 2);

console.log("Total:", calculateTotal([{ price: 10 }, { price: 20 }]));
console.log("Doubled:", doubled);

