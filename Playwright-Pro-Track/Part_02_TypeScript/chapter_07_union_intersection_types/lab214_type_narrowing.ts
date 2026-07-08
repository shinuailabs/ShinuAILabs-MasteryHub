/**
 * Lab 214: Type Narrowing
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Narrowing union types:
 * 
 * - typeof guards
 * - instanceof guards
 * - in operator
 * - Custom type guards
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Use typeof narrowing
 * 2. Use instanceof narrowing
 * 3. Create custom type guards
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: typeof Narrowing
console.log("--- typeof Narrowing ---");

function processValue(value: string | number | boolean): string {
    if (typeof value === "string") {
        // TypeScript knows value is string here
        return value.toUpperCase();
    }
    if (typeof value === "number") {
        // TypeScript knows value is number here
        return value.toFixed(2);
    }
    // TypeScript knows value is boolean here
    return value ? "Yes" : "No";
}

console.log(processValue("hello"));
console.log(processValue(42.5));
console.log(processValue(true));

// Solution 2: Truthiness Narrowing
console.log("\n--- Truthiness Narrowing ---");

function printLength(value: string | null | undefined): void {
    if (value) {
        // value is string here (not null/undefined)
        console.log(`Length: ${value.length}`);
    } else {
        console.log("No value provided");
    }
}

printLength("hello");
printLength(null);
printLength(undefined);

// Solution 3: Equality Narrowing
console.log("\n--- Equality Narrowing ---");

function compare(a: string | number, b: string | number): boolean {
    if (a === b) {
        // Both are the same type and value
        return true;
    }
    if (typeof a === "string" && typeof b === "string") {
        return a.toLowerCase() === b.toLowerCase();
    }
    return false;
}

console.log(compare("Hello", "hello"));
console.log(compare(42, 42));

// Solution 4: in Operator Narrowing
console.log("\n--- in Operator Narrowing ---");

type Fish = { swim: () => void };
type Bird = { fly: () => void };
type Human = { walk: () => void; swim: () => void };

function move(animal: Fish | Bird | Human): void {
    if ("swim" in animal) {
        animal.swim();
    }
    if ("fly" in animal) {
        animal.fly();
    }
    if ("walk" in animal) {
        animal.walk();
    }
}

const fish: Fish = { swim: () => console.log("Swimming") };
move(fish);

// Solution 5: instanceof Narrowing
console.log("\n--- instanceof Narrowing ---");

class Dog {
    bark() { console.log("Woof!"); }
}

class Cat {
    meow() { console.log("Meow!"); }
}

function makeNoise(animal: Dog | Cat): void {
    if (animal instanceof Dog) {
        animal.bark();
    } else {
        animal.meow();
    }
}

makeNoise(new Dog());
makeNoise(new Cat());

// Solution 6: Custom Type Guards
console.log("\n--- Custom Type Guards ---");

interface Car {
    type: "car";
    wheels: 4;
    drive(): void;
}

interface Motorcycle {
    type: "motorcycle";
    wheels: 2;
    ride(): void;
}

type Vehicle = Car | Motorcycle;

// Type predicate function
function isCar(vehicle: Vehicle): vehicle is Car {
    return vehicle.type === "car";
}

function isMotorcycle(vehicle: Vehicle): vehicle is Motorcycle {
    return vehicle.type === "motorcycle";
}

function useVehicle(vehicle: Vehicle): void {
    if (isCar(vehicle)) {
        vehicle.drive();
    } else if (isMotorcycle(vehicle)) {
        vehicle.ride();
    }
}

// Solution 7: Assertion Functions
console.log("\n--- Assertion Functions ---");

function assertIsString(value: unknown): asserts value is string {
    if (typeof value !== "string") {
        throw new Error("Value must be a string");
    }
}

function assertIsDefined<T>(value: T): asserts value is NonNullable<T> {
    if (value === null || value === undefined) {
        throw new Error("Value must be defined");
    }
}

function processInput(input: unknown): void {
    assertIsString(input);
    // TypeScript knows input is string here
    console.log(input.toUpperCase());
}

processInput("hello");

// Solution 8: Discriminated Union Narrowing
console.log("\n--- Discriminated Union ---");

type Success<T> = { status: "success"; data: T };
type Failure = { status: "failure"; error: string };
type Result<T> = Success<T> | Failure;

function handleResult<T>(result: Result<T>): T | null {
    if (result.status === "success") {
        return result.data;
    }
    console.error(result.error);
    return null;
}

console.log(handleResult({ status: "success", data: 42 }));
console.log(handleResult({ status: "failure", error: "Not found" }));

// Solution 9: Array Type Guards
console.log("\n--- Array Type Guards ---");

function isStringArray(arr: unknown[]): arr is string[] {
    return arr.every(item => typeof item === "string");
}

function isNumberArray(arr: unknown[]): arr is number[] {
    return arr.every(item => typeof item === "number");
}

function processArray(arr: unknown[]): void {
    if (isStringArray(arr)) {
        console.log("Strings:", arr.join(", "));
    } else if (isNumberArray(arr)) {
        console.log("Sum:", arr.reduce((a, b) => a + b, 0));
    }
}

processArray(["a", "b", "c"]);
processArray([1, 2, 3]);

// Solution 10: Practical Example
console.log("\n--- Practical Example ---");

interface User {
    id: number;
    name: string;
    email: string;
}

interface Admin extends User {
    role: "admin";
    permissions: string[];
}

interface Guest {
    sessionId: string;
}

type Visitor = User | Admin | Guest;

function isUser(visitor: Visitor): visitor is User {
    return "id" in visitor && "name" in visitor;
}

function isAdmin(visitor: Visitor): visitor is Admin {
    return isUser(visitor) && "role" in visitor && visitor.role === "admin";
}

function isGuest(visitor: Visitor): visitor is Guest {
    return "sessionId" in visitor && !("id" in visitor);
}

function greetVisitor(visitor: Visitor): string {
    if (isAdmin(visitor)) {
        return `Welcome Admin ${visitor.name}!`;
    }
    if (isUser(visitor)) {
        return `Hello ${visitor.name}!`;
    }
    return `Welcome Guest (${visitor.sessionId})!`;
}

console.log(greetVisitor({ id: 1, name: "John", email: "john@example.com" }));
console.log(greetVisitor({ sessionId: "abc123" }));

