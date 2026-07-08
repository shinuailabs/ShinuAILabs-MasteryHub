/**
 * Lab 173: Object Type Annotations
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Typing objects in TypeScript:
 * 
 * - Inline object types
 * - Type aliases
 * - Interfaces
 * - Nested objects
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create object type annotations
 * 2. Use interfaces and type aliases
 * 3. Handle nested objects
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Inline Object Types
console.log("--- Inline Object Types ---");

let user: { name: string; age: number } = {
    name: "John",
    age: 30
};

function printUser(user: { name: string; age: number }): void {
    console.log(`${user.name} is ${user.age} years old`);
}

printUser(user);

// Solution 2: Type Aliases for Objects
console.log("\n--- Type Aliases ---");

type User = {
    id: number;
    name: string;
    email: string;
};

type Product = {
    id: number;
    name: string;
    price: number;
    inStock: boolean;
};

const typedUser: User = {
    id: 1,
    name: "John",
    email: "john@example.com"
};

const product: Product = {
    id: 101,
    name: "Widget",
    price: 29.99,
    inStock: true
};

console.log("User:", typedUser);
console.log("Product:", product);

// Solution 3: Interfaces
console.log("\n--- Interfaces ---");

interface IUser {
    id: number;
    name: string;
    email: string;
}

interface IProduct {
    id: number;
    name: string;
    price: number;
}

// Interfaces can be extended
interface IAdmin extends IUser {
    permissions: string[];
}

const admin: IAdmin = {
    id: 1,
    name: "Admin",
    email: "admin@example.com",
    permissions: ["read", "write", "delete"]
};

console.log("Admin:", admin);

// Solution 4: Optional Properties
console.log("\n--- Optional Properties ---");

type Config = {
    host: string;
    port: number;
    ssl?: boolean;
    timeout?: number;
};

const minimalConfig: Config = {
    host: "localhost",
    port: 3000
};

const fullConfig: Config = {
    host: "example.com",
    port: 443,
    ssl: true,
    timeout: 5000
};

console.log("Minimal:", minimalConfig);
console.log("Full:", fullConfig);

// Solution 5: Readonly Properties
console.log("\n--- Readonly Properties ---");

type Point = {
    readonly x: number;
    readonly y: number;
};

const point: Point = { x: 10, y: 20 };
// point.x = 15; // Error!

// Readonly utility type
type ReadonlyUser = Readonly<User>;

const frozenUser: ReadonlyUser = {
    id: 1,
    name: "John",
    email: "john@example.com"
};
// frozenUser.name = "Jane"; // Error!

console.log("Point:", point);

// Solution 6: Nested Objects
console.log("\n--- Nested Objects ---");

type Address = {
    street: string;
    city: string;
    country: string;
    zipCode: string;
};

type Person = {
    name: string;
    age: number;
    address: Address;
    contacts: {
        email: string;
        phone?: string;
    };
};

const person: Person = {
    name: "John",
    age: 30,
    address: {
        street: "123 Main St",
        city: "New York",
        country: "USA",
        zipCode: "10001"
    },
    contacts: {
        email: "john@example.com",
        phone: "555-1234"
    }
};

console.log("Person:", person.name, person.address.city);

// Solution 7: Index Signatures
console.log("\n--- Index Signatures ---");

type Dictionary = {
    [key: string]: string;
};

type NumberMap = {
    [key: string]: number;
};

const colors: Dictionary = {
    red: "#ff0000",
    green: "#00ff00",
    blue: "#0000ff"
};

const scores: NumberMap = {
    alice: 95,
    bob: 87,
    charlie: 92
};

console.log("Red:", colors.red);
console.log("Alice score:", scores.alice);

// Solution 8: Mixed Index and Properties
console.log("\n--- Mixed Properties ---");

type FlexibleUser = {
    id: number;
    name: string;
    [key: string]: string | number;
};

const flexUser: FlexibleUser = {
    id: 1,
    name: "John",
    email: "john@example.com",
    age: 30
};

console.log("Flexible user:", flexUser);

// Solution 9: Object Methods
console.log("\n--- Object Methods ---");

type Calculator = {
    value: number;
    add(n: number): Calculator;
    subtract(n: number): Calculator;
    getResult(): number;
};

const calc: Calculator = {
    value: 0,
    add(n) {
        this.value += n;
        return this;
    },
    subtract(n) {
        this.value -= n;
        return this;
    },
    getResult() {
        return this.value;
    }
};

const result = calc.add(10).add(5).subtract(3).getResult();
console.log("Calculator result:", result);

// Solution 10: Practical Examples
console.log("\n--- Practical Examples ---");

// API Response
type ApiResponse<T> = {
    data: T;
    status: number;
    message: string;
    timestamp: Date;
};

// Form data
type LoginForm = {
    username: string;
    password: string;
    rememberMe?: boolean;
};

// Event
type Event = {
    type: string;
    target: { id: string };
    timestamp: number;
};

const response: ApiResponse<User> = {
    data: { id: 1, name: "John", email: "john@example.com" },
    status: 200,
    message: "Success",
    timestamp: new Date()
};

console.log("API Response:", response.data.name);

