/**
 * Lab 208: Conditional Types
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Types that depend on conditions:
 * 
 * - Basic conditional types
 * - infer keyword
 * - Distributive conditionals
 * - Type inference
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create conditional types
 * 2. Use infer keyword
 * 3. Build complex type logic
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Conditional Type
console.log("--- Basic Conditional Type ---");

type IsString<T> = T extends string ? true : false;
type IsNumber<T> = T extends number ? true : false;

type Test1 = IsString<"hello">;  // true
type Test2 = IsString<42>;       // false
type Test3 = IsNumber<42>;       // true

// Solution 2: Conditional with Union
console.log("\n--- Conditional with Union ---");

type NonNullable<T> = T extends null | undefined ? never : T;

type MaybeString = string | null | undefined;
type DefiniteString = NonNullable<MaybeString>;  // string

// Solution 3: Distributive Conditional Types
console.log("\n--- Distributive Conditionals ---");

type ToArray<T> = T extends any ? T[] : never;

// Distributes over union
type StringOrNumberArray = ToArray<string | number>;
// Result: string[] | number[]

// Prevent distribution with tuple
type ToArrayNonDist<T> = [T] extends [any] ? T[] : never;
type Combined = ToArrayNonDist<string | number>;
// Result: (string | number)[]

// Solution 4: infer Keyword
console.log("\n--- infer Keyword ---");

// Extract return type
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

// Extract parameter types
type MyParameters<T> = T extends (...args: infer P) => any ? P : never;

// Extract array element type
type ElementType<T> = T extends (infer E)[] ? E : never;

function greet(name: string, age: number): string {
    return `Hello ${name}`;
}

type GreetReturn = MyReturnType<typeof greet>;  // string
type GreetParams = MyParameters<typeof greet>;  // [string, number]
type NumElement = ElementType<number[]>;        // number

// Solution 5: Extract Promise Type
console.log("\n--- Promise Type ---");

type Awaited<T> = T extends Promise<infer U> ? Awaited<U> : T;

type PromiseString = Awaited<Promise<string>>;           // string
type NestedPromise = Awaited<Promise<Promise<number>>>; // number

// Solution 6: Function Overload Types
console.log("\n--- Function Types ---");

type FirstParameter<T> = T extends (first: infer F, ...args: any[]) => any ? F : never;
type LastParameter<T> = T extends (...args: [...any[], infer L]) => any ? L : never;

function example(a: string, b: number, c: boolean): void {}

type First = FirstParameter<typeof example>;  // string
type Last = LastParameter<typeof example>;    // boolean

// Solution 7: Object Property Types
console.log("\n--- Object Property Types ---");

type PropertyType<T, K extends keyof T> = T extends { [P in K]: infer V } ? V : never;

interface User {
    id: number;
    name: string;
    email: string;
}

type NameType = PropertyType<User, "name">;  // string

// Get all value types
type ValueOf<T> = T[keyof T];
type UserValues = ValueOf<User>;  // string | number

// Solution 8: Recursive Conditional Types
console.log("\n--- Recursive Conditionals ---");

type Flatten<T> = T extends Array<infer U> ? Flatten<U> : T;

type NestedArray = number[][][];
type FlatType = Flatten<NestedArray>;  // number

// Deep readonly
type DeepReadonly<T> = T extends object
    ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
    : T;

// Solution 9: Type Filtering
console.log("\n--- Type Filtering ---");

// Extract keys of specific type
type KeysOfType<T, V> = {
    [K in keyof T]: T[K] extends V ? K : never;
}[keyof T];

// Extract string keys
type StringKeys = KeysOfType<User, string>;  // "name" | "email"

// Extract function keys
interface Service {
    name: string;
    start(): void;
    stop(): void;
}

type MethodKeys = KeysOfType<Service, Function>;  // "start" | "stop"

// Solution 10: Practical Examples
console.log("\n--- Practical Examples ---");

// API Response type
type ApiResponse<T> = T extends void
    ? { success: boolean }
    : { success: boolean; data: T };

type VoidResponse = ApiResponse<void>;
type DataResponse = ApiResponse<User>;

// Event handler type
type EventHandler<T> = T extends Event
    ? (event: T) => void
    : (data: T) => void;

// Nullable type
type Nullable<T> = T extends object
    ? { [K in keyof T]: T[K] | null }
    : T | null;

// Required keys
type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];

// Optional keys
type OptionalKeys<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? K : never;
}[keyof T];

interface Config {
    host: string;
    port: number;
    ssl?: boolean;
    timeout?: number;
}

type ConfigRequired = RequiredKeys<Config>;  // "host" | "port"
type ConfigOptional = OptionalKeys<Config>;  // "ssl" | "timeout"

console.log("Conditional types provide powerful type-level logic!");

