/**
 * Lab 186: Index Signatures
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Dynamic property access:
 * 
 * - String index signatures
 * - Number index signatures
 * - Mixed signatures
 * - Constraints
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create index signatures
 * 2. Use with known properties
 * 3. Understand constraints
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: String Index Signature
console.log("--- String Index Signature ---");

interface StringDictionary {
    [key: string]: string;
}

const colors: StringDictionary = {
    red: "#ff0000",
    green: "#00ff00",
    blue: "#0000ff"
};

colors["yellow"] = "#ffff00";  // Dynamic property
console.log("Colors:", colors);
console.log("Red:", colors.red);

// Solution 2: Number Index Signature
console.log("\n--- Number Index Signature ---");

interface NumberArray {
    [index: number]: string;
}

const fruits: NumberArray = ["apple", "banana", "cherry"];
console.log("Fruits:", fruits);
console.log("First:", fruits[0]);

// Solution 3: Mixed Index and Properties
console.log("\n--- Mixed Properties ---");

interface User {
    name: string;
    email: string;
    [key: string]: string;  // All properties must be string
}

const user: User = {
    name: "John",
    email: "john@example.com",
    phone: "555-1234",
    address: "123 Main St"
};

console.log("User:", user);

// Solution 4: Index with Union Types
console.log("\n--- Union Index Types ---");

interface FlexibleObject {
    id: number;
    name: string;
    [key: string]: string | number;
}

const item: FlexibleObject = {
    id: 1,
    name: "Widget",
    price: 29.99,
    category: "Electronics"
};

console.log("Item:", item);

// Solution 5: Readonly Index Signature
console.log("\n--- Readonly Index ---");

interface ReadonlyDictionary {
    readonly [key: string]: string;
}

const constants: ReadonlyDictionary = {
    PI: "3.14159",
    E: "2.71828"
};

// constants["NEW"] = "value"; // Error: readonly

console.log("Constants:", constants);

// Solution 6: Record Type Alternative
console.log("\n--- Record Type ---");

// Record<K, V> is often cleaner than index signatures
type StringRecord = Record<string, string>;
type UserScores = Record<string, number>;

const scores: UserScores = {
    alice: 95,
    bob: 87,
    charlie: 92
};

console.log("Scores:", scores);

// With literal keys
type Status = "pending" | "active" | "completed";
type StatusColors = Record<Status, string>;

const statusColors: StatusColors = {
    pending: "yellow",
    active: "green",
    completed: "blue"
};

console.log("Status colors:", statusColors);

// Solution 7: Index Signature Constraints
console.log("\n--- Index Constraints ---");

// All properties must match index signature type
interface Config {
    [key: string]: string | number | boolean;
    host: string;
    port: number;
    ssl: boolean;
}

const config: Config = {
    host: "localhost",
    port: 3000,
    ssl: false,
    timeout: 5000,
    debug: true
};

console.log("Config:", config);

// Solution 8: Template Literal Index
console.log("\n--- Template Literal Index ---");

type EventHandlers = {
    [K in `on${string}`]: () => void;
};

const handlers: EventHandlers = {
    onClick: () => console.log("Clicked"),
    onHover: () => console.log("Hovered"),
    onFocus: () => console.log("Focused")
};

handlers.onClick();

// Solution 9: Mapped Types vs Index Signatures
console.log("\n--- Mapped Types ---");

// Index signature - any string key
interface AnyStringKeys {
    [key: string]: number;
}

// Mapped type - specific keys
type SpecificKeys = {
    [K in "a" | "b" | "c"]: number;
};

const specific: SpecificKeys = {
    a: 1,
    b: 2,
    c: 3
};

console.log("Specific:", specific);

// Solution 10: Practical Examples
console.log("\n--- Practical Examples ---");

// API Response with dynamic fields
interface ApiResponse {
    status: number;
    message: string;
    [key: string]: unknown;
}

const response: ApiResponse = {
    status: 200,
    message: "Success",
    data: { id: 1, name: "Test" },
    meta: { page: 1, total: 100 }
};

console.log("Response:", response);

// Cache interface
interface Cache<T> {
    [key: string]: T | undefined;
}

const userCache: Cache<{ name: string }> = {};
userCache["user1"] = { name: "John" };
userCache["user2"] = { name: "Jane" };

console.log("Cache:", userCache);

// Environment variables
interface Environment {
    [key: string]: string | undefined;
    NODE_ENV: string;
    PORT?: string;
}

const env: Environment = {
    NODE_ENV: "development",
    PORT: "3000",
    API_KEY: "secret"
};

console.log("Environment:", env.NODE_ENV);

