/**
 * Lab 163: Object Types
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Typing objects in TypeScript:
 * 
 * - Inline object types
 * - Optional properties
 * - Readonly properties
 * - Index signatures
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Define object types
 * 2. Use optional properties
 * 3. Create readonly objects
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Inline Object Types
console.log("--- Inline Object Types ---");

let user: { name: string; age: number; email: string } = {
    name: "John",
    age: 30,
    email: "john@example.com"
};

console.log("User:", user);

// Function with object parameter
function printUser(user: { name: string; age: number }): void {
    console.log(`${user.name} is ${user.age} years old`);
}

printUser({ name: "Jane", age: 25 });

// Solution 2: Optional Properties
console.log("\n--- Optional Properties ---");

let config: {
    host: string;
    port: number;
    ssl?: boolean;
    timeout?: number;
} = {
    host: "localhost",
    port: 3000
    // ssl and timeout are optional
};

console.log("Config:", config);

// Accessing optional properties
console.log("SSL:", config.ssl); // undefined
console.log("SSL with default:", config.ssl ?? false);

// Solution 3: Readonly Properties
console.log("\n--- Readonly Properties ---");

let point: {
    readonly x: number;
    readonly y: number;
} = {
    x: 10,
    y: 20
};

console.log("Point:", point);
// point.x = 15; // Error: Cannot assign to 'x' because it is a read-only property

// Readonly utility type
type ReadonlyPoint = Readonly<{ x: number; y: number }>;
const p: ReadonlyPoint = { x: 5, y: 10 };

// Solution 4: Index Signatures
console.log("\n--- Index Signatures ---");

// Object with dynamic keys
let dictionary: { [key: string]: number } = {
    apple: 1,
    banana: 2,
    cherry: 3
};

dictionary["date"] = 4; // OK
console.log("Dictionary:", dictionary);

// With specific properties
let mixedObject: {
    name: string;
    [key: string]: string | number;
} = {
    name: "John",
    age: 30,
    city: "NYC"
};

console.log("Mixed object:", mixedObject);

// Solution 5: Nested Objects
console.log("\n--- Nested Objects ---");

let company: {
    name: string;
    address: {
        street: string;
        city: string;
        country: string;
    };
    employees: {
        name: string;
        role: string;
    }[];
} = {
    name: "Tech Corp",
    address: {
        street: "123 Main St",
        city: "San Francisco",
        country: "USA"
    },
    employees: [
        { name: "Alice", role: "Developer" },
        { name: "Bob", role: "Designer" }
    ]
};

console.log("Company:", company.name);
console.log("City:", company.address.city);

// Solution 6: Object Type Aliases
console.log("\n--- Type Aliases ---");

type Person = {
    name: string;
    age: number;
    email?: string;
};

type Address = {
    street: string;
    city: string;
    zipCode: string;
};

type PersonWithAddress = Person & {
    address: Address;
};

const personWithAddress: PersonWithAddress = {
    name: "John",
    age: 30,
    address: {
        street: "123 Main St",
        city: "NYC",
        zipCode: "10001"
    }
};

console.log("Person with address:", personWithAddress.name);

// Solution 7: Record Type
console.log("\n--- Record Type ---");

// Record<Keys, Type>
type Roles = "admin" | "user" | "guest";
type RolePermissions = Record<Roles, string[]>;

const permissions: RolePermissions = {
    admin: ["read", "write", "delete"],
    user: ["read", "write"],
    guest: ["read"]
};

console.log("Admin permissions:", permissions.admin);

// Solution 8: Partial and Required
console.log("\n--- Partial and Required ---");

type User = {
    id: number;
    name: string;
    email: string;
};

// All properties optional
type PartialUser = Partial<User>;
const partialUser: PartialUser = { name: "John" };

// All properties required
type RequiredUser = Required<PartialUser>;

console.log("Partial user:", partialUser);

// Solution 9: Pick and Omit
console.log("\n--- Pick and Omit ---");

type FullUser = {
    id: number;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
};

// Pick specific properties
type UserPreview = Pick<FullUser, "id" | "name">;
const preview: UserPreview = { id: 1, name: "John" };

// Omit specific properties
type PublicUser = Omit<FullUser, "password">;
const publicUser: PublicUser = {
    id: 1,
    name: "John",
    email: "john@example.com",
    createdAt: new Date()
};

console.log("Preview:", preview);
console.log("Public user:", publicUser.name);

// Solution 10: Practical Examples
console.log("\n--- Practical Examples ---");

// API Response type
type ApiResponse<T> = {
    data: T;
    status: number;
    message: string;
    timestamp: Date;
};

type UserData = { id: number; name: string };
const response: ApiResponse<UserData> = {
    data: { id: 1, name: "John" },
    status: 200,
    message: "Success",
    timestamp: new Date()
};

console.log("API Response:", response.data);

