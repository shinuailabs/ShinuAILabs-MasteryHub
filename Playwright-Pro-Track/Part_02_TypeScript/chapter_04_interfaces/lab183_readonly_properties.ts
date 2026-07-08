/**
 * Lab 183: Readonly Properties
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Immutable interface properties:
 * 
 * - readonly modifier
 * - Readonly utility type
 * - Deep readonly
 * - Immutability patterns
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create readonly properties
 * 2. Use Readonly utility type
 * 3. Implement immutable patterns
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Readonly Properties
console.log("--- Basic Readonly ---");

interface Point {
    readonly x: number;
    readonly y: number;
}

const point: Point = { x: 10, y: 20 };
console.log("Point:", point);
// point.x = 15; // Error: Cannot assign to 'x' because it is a read-only property

// Solution 2: Readonly with Mutable Properties
console.log("\n--- Mixed Properties ---");

interface User {
    readonly id: number;
    readonly createdAt: Date;
    name: string;
    email: string;
}

const user: User = {
    id: 1,
    createdAt: new Date(),
    name: "John",
    email: "john@example.com"
};

// Can modify mutable properties
user.name = "Jane";
user.email = "jane@example.com";

// Cannot modify readonly properties
// user.id = 2; // Error!

console.log("User:", user);

// Solution 3: Readonly Utility Type
console.log("\n--- Readonly Utility Type ---");

interface Config {
    host: string;
    port: number;
    ssl: boolean;
}

// Make all properties readonly
type ReadonlyConfig = Readonly<Config>;

const config: ReadonlyConfig = {
    host: "localhost",
    port: 3000,
    ssl: false
};

// config.host = "other"; // Error: all properties are readonly

console.log("Config:", config);

// Solution 4: Readonly Arrays
console.log("\n--- Readonly Arrays ---");

const numbers: readonly number[] = [1, 2, 3, 4, 5];
// numbers.push(6); // Error!
// numbers[0] = 10; // Error!

// ReadonlyArray type
const names: ReadonlyArray<string> = ["Alice", "Bob", "Charlie"];
// names.push("Dave"); // Error!

console.log("Numbers:", numbers);
console.log("Names:", names);

// Solution 5: Deep Readonly
console.log("\n--- Deep Readonly ---");

type DeepReadonly<T> = {
    readonly [P in keyof T]: T[P] extends object
        ? DeepReadonly<T[P]>
        : T[P];
};

interface NestedConfig {
    server: {
        host: string;
        port: number;
    };
    database: {
        url: string;
        name: string;
    };
}

type ImmutableConfig = DeepReadonly<NestedConfig>;

const immutableConfig: ImmutableConfig = {
    server: { host: "localhost", port: 3000 },
    database: { url: "mongodb://localhost", name: "mydb" }
};

// immutableConfig.server.host = "other"; // Error: deeply readonly

console.log("Immutable config:", immutableConfig);

// Solution 6: Readonly in Classes
console.log("\n--- Readonly in Classes ---");

class ImmutablePoint {
    readonly x: number;
    readonly y: number;
    
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    
    // Return new instance instead of mutating
    move(dx: number, dy: number): ImmutablePoint {
        return new ImmutablePoint(this.x + dx, this.y + dy);
    }
}

const p1 = new ImmutablePoint(10, 20);
const p2 = p1.move(5, 5);

console.log("P1:", p1.x, p1.y);
console.log("P2:", p2.x, p2.y);

// Solution 7: Readonly Function Parameters
console.log("\n--- Readonly Parameters ---");

function processItems(items: readonly number[]): number {
    // Cannot modify the array
    // items.push(4); // Error!
    return items.reduce((a, b) => a + b, 0);
}

const nums = [1, 2, 3];
console.log("Sum:", processItems(nums));

// Solution 8: Readonly vs const
console.log("\n--- Readonly vs const ---");

// const prevents reassignment
const constArray = [1, 2, 3];
constArray.push(4); // OK - array is mutable
// constArray = [5, 6]; // Error - cannot reassign

// readonly prevents mutation
const readonlyArray: readonly number[] = [1, 2, 3];
// readonlyArray.push(4); // Error - cannot mutate

// as const makes everything readonly and literal
const asConstArray = [1, 2, 3] as const;
// asConstArray.push(4); // Error
// Type is readonly [1, 2, 3]

console.log("const array:", constArray);

// Solution 9: Immutable Update Patterns
console.log("\n--- Immutable Updates ---");

interface State {
    readonly users: readonly User[];
    readonly count: number;
}

function addUser(state: State, user: User): State {
    return {
        ...state,
        users: [...state.users, user],
        count: state.count + 1
    };
}

const initialState: State = { users: [], count: 0 };
const newState = addUser(initialState, {
    id: 1,
    createdAt: new Date(),
    name: "John",
    email: "john@example.com"
});

console.log("Initial count:", initialState.count);
console.log("New count:", newState.count);

// Solution 10: Practical Example
console.log("\n--- Practical Example ---");

interface AppConfig {
    readonly apiUrl: string;
    readonly apiKey: string;
    readonly environment: "development" | "production";
    readonly features: Readonly<{
        darkMode: boolean;
        notifications: boolean;
    }>;
}

const appConfig: AppConfig = {
    apiUrl: "https://api.example.com",
    apiKey: "secret-key",
    environment: "production",
    features: {
        darkMode: true,
        notifications: true
    }
};

console.log("App config:", appConfig.environment);
console.log("Features:", appConfig.features);

