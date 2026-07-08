/**
 * Lab 216: Nullable Types
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Handling null and undefined:
 * 
 * - strictNullChecks
 * - Optional properties
 * - Nullish coalescing
 * - Optional chaining
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Work with nullable types
 * 2. Use optional chaining
 * 3. Apply nullish coalescing
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Nullable Types
console.log("--- Nullable Types ---");

type NullableString = string | null;
type OptionalNumber = number | undefined;
type MaybeValue = string | null | undefined;

let name: NullableString = "John";
name = null;

let age: OptionalNumber = 30;
age = undefined;

console.log("Name:", name);
console.log("Age:", age);

// Solution 2: Optional Properties
console.log("\n--- Optional Properties ---");

interface User {
    id: number;
    name: string;
    email?: string;        // string | undefined
    phone?: string | null; // string | null | undefined
}

const user1: User = { id: 1, name: "John" };
const user2: User = { id: 2, name: "Jane", email: "jane@example.com" };

console.log("User 1 email:", user1.email); // undefined
console.log("User 2 email:", user2.email);

// Solution 3: Optional Chaining
console.log("\n--- Optional Chaining ---");

interface Company {
    name: string;
    address?: {
        street?: string;
        city?: string;
        country?: string;
    };
}

const company: Company = {
    name: "Acme Inc",
    address: {
        city: "New York"
    }
};

// Safe property access
const street = company.address?.street;
const city = company.address?.city;
const zip = company.address?.street?.length;

console.log("Street:", street);
console.log("City:", city);

// Optional method calls
interface Calculator {
    add?(a: number, b: number): number;
}

const calc: Calculator = {};
const result = calc.add?.(1, 2);
console.log("Result:", result);

// Solution 4: Nullish Coalescing
console.log("\n--- Nullish Coalescing ---");

// ?? only checks for null/undefined
const value1 = null ?? "default";
const value2 = undefined ?? "default";
const value3 = "" ?? "default";  // "" (empty string is not nullish)
const value4 = 0 ?? "default";   // 0 (zero is not nullish)

console.log("Value 1:", value1); // "default"
console.log("Value 2:", value2); // "default"
console.log("Value 3:", value3); // ""
console.log("Value 4:", value4); // 0

// Compare with ||
const orValue = "" || "default"; // "default" (falsy check)
console.log("Or value:", orValue);

// Solution 5: Non-null Assertion
console.log("\n--- Non-null Assertion ---");

interface Config {
    apiKey?: string;
}

const config: Config = { apiKey: "secret123" };

// Non-null assertion (use carefully!)
const key = config.apiKey!;
console.log("Key:", key);

// Better: check first
if (config.apiKey) {
    console.log("Safe key:", config.apiKey);
}

// Solution 6: Nullish Assignment
console.log("\n--- Nullish Assignment ---");

interface Settings {
    theme?: string;
    fontSize?: number;
}

const settings: Settings = {};

// Assign only if null/undefined
settings.theme ??= "dark";
settings.fontSize ??= 14;

console.log("Settings:", settings);

// Solution 7: Type Guards for Null
console.log("\n--- Type Guards ---");

function isNotNull<T>(value: T | null): value is T {
    return value !== null;
}

function isNotUndefined<T>(value: T | undefined): value is T {
    return value !== undefined;
}

function isDefined<T>(value: T | null | undefined): value is T {
    return value !== null && value !== undefined;
}

const values: (string | null)[] = ["a", null, "b", null, "c"];
const filtered = values.filter(isNotNull);
console.log("Filtered:", filtered);

// Solution 8: Required and NonNullable
console.log("\n--- Required and NonNullable ---");

interface PartialUser {
    id?: number;
    name?: string;
    email?: string | null;
}

// Make all properties required
type RequiredUser = Required<PartialUser>;

// Remove null/undefined from type
type NonNullEmail = NonNullable<PartialUser["email"]>;

// Solution 9: Handling API Responses
console.log("\n--- API Responses ---");

interface ApiResponse<T> {
    data: T | null;
    error: string | null;
}

function handleResponse<T>(response: ApiResponse<T>): T {
    if (response.error) {
        throw new Error(response.error);
    }
    if (response.data === null) {
        throw new Error("No data received");
    }
    return response.data;
}

const response: ApiResponse<User> = {
    data: { id: 1, name: "John" },
    error: null
};

console.log("Data:", handleResponse(response));

// Solution 10: Practical Patterns
console.log("\n--- Practical Patterns ---");

// Safe array access
function safeGet<T>(arr: T[], index: number): T | undefined {
    return arr[index];
}

// Safe object property
function safeProp<T, K extends keyof T>(obj: T | null | undefined, key: K): T[K] | undefined {
    return obj?.[key];
}

// Default value helper
function withDefault<T>(value: T | null | undefined, defaultValue: T): T {
    return value ?? defaultValue;
}

const numbers = [1, 2, 3];
console.log("Safe get:", safeGet(numbers, 5)); // undefined
console.log("With default:", withDefault(null, "default"));

// Chained optional access
interface DeepObject {
    level1?: {
        level2?: {
            level3?: {
                value?: string;
            };
        };
    };
}

const deep: DeepObject = { level1: { level2: { level3: { value: "found" } } } };
const deepValue = deep.level1?.level2?.level3?.value ?? "not found";
console.log("Deep value:", deepValue);

