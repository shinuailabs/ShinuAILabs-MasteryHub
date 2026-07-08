/**
 * Lab 217: Type Aliases
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Creating named types:
 * 
 * - Basic type aliases
 * - Generic type aliases
 * - Recursive types
 * - Type vs Interface
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create type aliases
 * 2. Use generic aliases
 * 3. Build recursive types
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Type Aliases
console.log("--- Basic Type Aliases ---");

type ID = string | number;
type Email = string;
type Age = number;
type IsActive = boolean;

type User = {
    id: ID;
    email: Email;
    age: Age;
    isActive: IsActive;
};

const user: User = {
    id: "user123",
    email: "john@example.com",
    age: 30,
    isActive: true
};

console.log("User:", user);

// Solution 2: Function Type Aliases
console.log("\n--- Function Type Aliases ---");

type Callback = () => void;
type Predicate<T> = (item: T) => boolean;
type Transformer<T, U> = (input: T) => U;
type Comparator<T> = (a: T, b: T) => number;

const isPositive: Predicate<number> = n => n > 0;
const double: Transformer<number, number> = n => n * 2;
const compareNumbers: Comparator<number> = (a, b) => a - b;

console.log("Is positive:", isPositive(5));
console.log("Double:", double(21));

// Solution 3: Union Type Aliases
console.log("\n--- Union Type Aliases ---");

type Status = "pending" | "active" | "completed" | "cancelled";
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
type Result<T> = { success: true; data: T } | { success: false; error: string };

function processResult<T>(result: Result<T>): void {
    if (result.success) {
        console.log("Data:", result.data);
    } else {
        console.log("Error:", result.error);
    }
}

processResult({ success: true, data: "Hello" });

// Solution 4: Intersection Type Aliases
console.log("\n--- Intersection Type Aliases ---");

type HasId = { id: number };
type HasName = { name: string };
type HasTimestamp = { createdAt: Date; updatedAt: Date };

type Entity = HasId & HasName & HasTimestamp;

const entity: Entity = {
    id: 1,
    name: "Test",
    createdAt: new Date(),
    updatedAt: new Date()
};

console.log("Entity:", entity.name);

// Solution 5: Generic Type Aliases
console.log("\n--- Generic Type Aliases ---");

type Nullable<T> = T | null;
type Optional<T> = T | undefined;
type Maybe<T> = T | null | undefined;
type AsyncResult<T> = Promise<Result<T>>;
type Dictionary<T> = Record<string, T>;

type NullableUser = Nullable<User>;
type UserDictionary = Dictionary<User>;

const users: UserDictionary = {
    user1: { id: 1, email: "a@b.com", age: 25, isActive: true }
};

console.log("Users:", Object.keys(users));

// Solution 6: Conditional Type Aliases
console.log("\n--- Conditional Type Aliases ---");

type IsString<T> = T extends string ? true : false;
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
type ArrayElement<T> = T extends (infer E)[] ? E : never;

type Test1 = IsString<"hello">;  // true
type Test2 = IsString<42>;       // false
type Test3 = UnwrapPromise<Promise<string>>;  // string
type Test4 = ArrayElement<number[]>;  // number

// Solution 7: Recursive Type Aliases
console.log("\n--- Recursive Type Aliases ---");

type JSONValue = 
    | string 
    | number 
    | boolean 
    | null 
    | JSONValue[] 
    | { [key: string]: JSONValue };

type TreeNode<T> = {
    value: T;
    children: TreeNode<T>[];
};

type LinkedList<T> = {
    value: T;
    next: LinkedList<T> | null;
};

const json: JSONValue = {
    name: "John",
    age: 30,
    hobbies: ["reading", "coding"],
    address: {
        city: "New York"
    }
};

console.log("JSON:", JSON.stringify(json));

// Solution 8: Mapped Type Aliases
console.log("\n--- Mapped Type Aliases ---");

type Readonly<T> = { readonly [K in keyof T]: T[K] };
type Partial<T> = { [K in keyof T]?: T[K] };
type Required<T> = { [K in keyof T]-?: T[K] };

type Getters<T> = {
    [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type UserGetters = Getters<{ name: string; age: number }>;
// { getName: () => string; getAge: () => number }

// Solution 9: Type Alias vs Interface
console.log("\n--- Type vs Interface ---");

// Type alias - can represent any type
type StringOrNumber = string | number;
type Callback2 = () => void;

// Interface - only object shapes
interface Person {
    name: string;
}

// Interface can be extended
interface Employee extends Person {
    employeeId: number;
}

// Type can use intersection
type EmployeeType = Person & { employeeId: number };

// Interface can be merged (declaration merging)
interface Config {
    host: string;
}
interface Config {
    port: number;
}
// Config now has both host and port

// Solution 10: Practical Examples
console.log("\n--- Practical Examples ---");

// API types
type ApiEndpoint = `/${string}`;
type ApiMethod = "GET" | "POST" | "PUT" | "DELETE";
type ApiRequest<T> = {
    endpoint: ApiEndpoint;
    method: ApiMethod;
    body?: T;
    headers?: Record<string, string>;
};

// State management
type Action<T extends string, P = void> = P extends void
    ? { type: T }
    : { type: T; payload: P };

type AddUserAction = Action<"ADD_USER", User>;
type RemoveUserAction = Action<"REMOVE_USER", { id: ID }>;
type UserAction = AddUserAction | RemoveUserAction;

// Form types
type FormField<T> = {
    value: T;
    error?: string;
    touched: boolean;
};

type FormState<T> = {
    [K in keyof T]: FormField<T[K]>;
};

console.log("Type aliases provide flexible type definitions!");

