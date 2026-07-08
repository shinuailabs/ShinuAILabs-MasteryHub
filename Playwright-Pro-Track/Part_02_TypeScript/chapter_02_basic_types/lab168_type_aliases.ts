/**
 * Lab 168: Type Aliases
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Creating custom type names:
 * 
 * - type keyword
 * - Alias vs Interface
 * - Complex type aliases
 * - Generic type aliases
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create type aliases
 * 2. Use generic aliases
 * 3. Understand when to use aliases
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Type Aliases
console.log("--- Basic Type Aliases ---");

// Primitive aliases
type ID = string | number;
type Name = string;
type Age = number;

let userId: ID = "user-123";
let userName: Name = "John";
let userAge: Age = 30;

console.log("User:", userId, userName, userAge);

// Solution 2: Object Type Aliases
console.log("\n--- Object Type Aliases ---");

type User = {
    id: ID;
    name: Name;
    age: Age;
    email: string;
};

const user: User = {
    id: 1,
    name: "John",
    age: 30,
    email: "john@example.com"
};

console.log("User object:", user);

// Solution 3: Function Type Aliases
console.log("\n--- Function Type Aliases ---");

type Callback = (data: string) => void;
type Predicate<T> = (item: T) => boolean;
type Transformer<T, U> = (input: T) => U;

const logCallback: Callback = (data) => console.log(data);
const isEven: Predicate<number> = (n) => n % 2 === 0;
const stringify: Transformer<number, string> = (n) => n.toString();

logCallback("Hello!");
console.log("Is 4 even:", isEven(4));
console.log("Stringify 42:", stringify(42));

// Solution 4: Union Type Aliases
console.log("\n--- Union Type Aliases ---");

type Status = "pending" | "active" | "completed" | "cancelled";
type Result<T> = { success: true; data: T } | { success: false; error: string };

let orderStatus: Status = "active";
console.log("Status:", orderStatus);

function processResult<T>(result: Result<T>): void {
    if (result.success) {
        console.log("Data:", result.data);
    } else {
        console.log("Error:", result.error);
    }
}

processResult({ success: true, data: { id: 1 } });

// Solution 5: Generic Type Aliases
console.log("\n--- Generic Type Aliases ---");

type Container<T> = {
    value: T;
    getValue(): T;
};

type Pair<T, U> = {
    first: T;
    second: U;
};

type Optional<T> = T | null | undefined;

const numberContainer: Container<number> = {
    value: 42,
    getValue() { return this.value; }
};

const pair: Pair<string, number> = {
    first: "age",
    second: 30
};

console.log("Container:", numberContainer.getValue());
console.log("Pair:", pair);

// Solution 6: Recursive Type Aliases
console.log("\n--- Recursive Types ---");

type TreeNode<T> = {
    value: T;
    children?: TreeNode<T>[];
};

const tree: TreeNode<string> = {
    value: "root",
    children: [
        { value: "child1" },
        { 
            value: "child2",
            children: [
                { value: "grandchild" }
            ]
        }
    ]
};

console.log("Tree root:", tree.value);

// JSON type
type JSONValue = 
    | string 
    | number 
    | boolean 
    | null 
    | JSONValue[] 
    | { [key: string]: JSONValue };

const jsonData: JSONValue = {
    name: "John",
    age: 30,
    active: true,
    tags: ["user", "admin"]
};

console.log("JSON:", jsonData);

// Solution 7: Conditional Type Aliases
console.log("\n--- Conditional Types ---");

type IsString<T> = T extends string ? true : false;
type IsArray<T> = T extends any[] ? true : false;

type Test1 = IsString<string>;  // true
type Test2 = IsString<number>;  // false
type Test3 = IsArray<number[]>; // true

// Extract element type from array
type ElementType<T> = T extends (infer E)[] ? E : never;
type StringElement = ElementType<string[]>; // string

// Solution 8: Mapped Type Aliases
console.log("\n--- Mapped Types ---");

type Readonly<T> = {
    readonly [P in keyof T]: T[P];
};

type Partial<T> = {
    [P in keyof T]?: T[P];
};

type Required<T> = {
    [P in keyof T]-?: T[P];
};

type UserReadonly = Readonly<User>;
type UserPartial = Partial<User>;

// Solution 9: Template Literal Types
console.log("\n--- Template Literal Types ---");

type EventName = "click" | "focus" | "blur";
type EventHandler = `on${Capitalize<EventName>}`;
// "onClick" | "onFocus" | "onBlur"

type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE";
type Endpoint = `/api/${string}`;

const method: HTTPMethod = "GET";
const endpoint: Endpoint = "/api/users";

console.log("Method:", method, "Endpoint:", endpoint);

// Solution 10: Type Alias vs Interface
console.log("\n--- Alias vs Interface ---");

/*
Use Type Alias for:
- Union types
- Tuple types
- Function types
- Mapped types
- Conditional types

Use Interface for:
- Object shapes
- Class implementations
- Declaration merging
- Extending other interfaces
*/

// Type alias - can't be extended
type Point = { x: number; y: number };

// Interface - can be extended
interface IPoint {
    x: number;
    y: number;
}

interface IPoint3D extends IPoint {
    z: number;
}

// Both work for objects
const point1: Point = { x: 1, y: 2 };
const point2: IPoint3D = { x: 1, y: 2, z: 3 };

console.log("Point:", point1);
console.log("Point3D:", point2);

// Summary
console.log("\nType aliases provide flexible type definitions!");

