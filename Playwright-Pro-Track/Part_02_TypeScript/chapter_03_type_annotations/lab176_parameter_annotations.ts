/**
 * Lab 176: Parameter Type Annotations
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Typing function parameters:
 * 
 * - Required parameters
 * - Optional parameters
 * - Default parameters
 * - Rest parameters
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Annotate different parameter types
 * 2. Use optional and default values
 * 3. Handle rest parameters
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Required Parameters
console.log("--- Required Parameters ---");

function greet(name: string): string {
    return `Hello, ${name}!`;
}

function add(a: number, b: number): number {
    return a + b;
}

function createUser(name: string, email: string, age: number): object {
    return { name, email, age };
}

console.log(greet("World"));
console.log(add(5, 3));
console.log(createUser("John", "john@example.com", 30));

// Solution 2: Optional Parameters
console.log("\n--- Optional Parameters ---");

function formatName(first: string, last?: string): string {
    return last ? `${first} ${last}` : first;
}

function createConfig(host: string, port?: number, ssl?: boolean): object {
    return {
        host,
        port: port ?? 3000,
        ssl: ssl ?? false
    };
}

console.log(formatName("John"));
console.log(formatName("John", "Doe"));
console.log(createConfig("localhost"));
console.log(createConfig("example.com", 443, true));

// Solution 3: Default Parameters
console.log("\n--- Default Parameters ---");

function greetWithDefault(name: string, greeting: string = "Hello"): string {
    return `${greeting}, ${name}!`;
}

function createArray(length: number, fill: number = 0): number[] {
    return new Array(length).fill(fill);
}

function buildUrl(
    path: string,
    protocol: string = "https",
    domain: string = "example.com"
): string {
    return `${protocol}://${domain}${path}`;
}

console.log(greetWithDefault("World"));
console.log(greetWithDefault("World", "Hi"));
console.log(createArray(5));
console.log(createArray(3, 1));
console.log(buildUrl("/api/users"));

// Solution 4: Rest Parameters
console.log("\n--- Rest Parameters ---");

function sum(...numbers: number[]): number {
    return numbers.reduce((acc, n) => acc + n, 0);
}

function joinStrings(separator: string, ...strings: string[]): string {
    return strings.join(separator);
}

function logAll(...args: unknown[]): void {
    args.forEach(arg => console.log(arg));
}

console.log("Sum:", sum(1, 2, 3, 4, 5));
console.log("Join:", joinStrings("-", "a", "b", "c"));

// Solution 5: Object Parameters
console.log("\n--- Object Parameters ---");

type UserOptions = {
    name: string;
    email: string;
    age?: number;
    role?: string;
};

function createUserFromOptions(options: UserOptions): object {
    return {
        ...options,
        age: options.age ?? 0,
        role: options.role ?? "user"
    };
}

// Destructured parameters
function printUser({ name, age }: { name: string; age: number }): void {
    console.log(`${name} is ${age} years old`);
}

console.log(createUserFromOptions({ name: "John", email: "john@example.com" }));
printUser({ name: "Jane", age: 25 });

// Solution 6: Callback Parameters
console.log("\n--- Callback Parameters ---");

type Callback<T> = (result: T) => void;

function fetchData(callback: Callback<string>): void {
    callback("Data loaded");
}

function processItems<T>(
    items: T[],
    processor: (item: T, index: number) => void
): void {
    items.forEach((item, index) => processor(item, index));
}

fetchData(result => console.log("Callback:", result));
processItems([1, 2, 3], (item, index) => console.log(`Item ${index}:`, item));

// Solution 7: Generic Parameters
console.log("\n--- Generic Parameters ---");

function identity<T>(value: T): T {
    return value;
}

function pair<T, U>(first: T, second: U): [T, U] {
    return [first, second];
}

function map<T, U>(arr: T[], fn: (item: T) => U): U[] {
    return arr.map(fn);
}

console.log(identity("hello"));
console.log(pair("name", 42));
console.log(map([1, 2, 3], n => n * 2));

// Solution 8: Constrained Parameters
console.log("\n--- Constrained Parameters ---");

function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
}

function merge<T extends object, U extends object>(a: T, b: U): T & U {
    return { ...a, ...b };
}

const user = { name: "John", age: 30 };
console.log("Property:", getProperty(user, "name"));
console.log("Merged:", merge({ a: 1 }, { b: 2 }));

// Solution 9: Union Parameters
console.log("\n--- Union Parameters ---");

function formatId(id: string | number): string {
    return typeof id === "number" ? id.toString().padStart(5, "0") : id;
}

function processValue(value: string | number | boolean): string {
    if (typeof value === "string") return value.toUpperCase();
    if (typeof value === "number") return value.toFixed(2);
    return value ? "yes" : "no";
}

console.log(formatId(42));
console.log(formatId("ABC"));
console.log(processValue("hello"));
console.log(processValue(42.5));

// Solution 10: Practical Examples
console.log("\n--- Practical Examples ---");

// Event handler
type EventHandler<T> = (event: T) => void;

function addEventListener<T>(
    eventName: string,
    handler: EventHandler<T>
): void {
    console.log(`Added handler for ${eventName}`);
}

// API function
type RequestOptions = {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    headers?: Record<string, string>;
    body?: unknown;
};

function request(url: string, options: RequestOptions = {}): void {
    const { method = "GET", headers = {}, body } = options;
    console.log(`${method} ${url}`);
}

request("/api/users");
request("/api/users", { method: "POST", body: { name: "John" } });

