/**
 * Lab 166: Union Types
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Combining types with unions:
 * 
 * - Union type syntax
 * - Type narrowing
 * - Discriminated unions
 * - Common patterns
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create union types
 * 2. Narrow union types
 * 3. Use discriminated unions
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Union Types
console.log("--- Basic Union Types ---");

let id: string | number;
id = "abc123";
console.log("String ID:", id);

id = 12345;
console.log("Number ID:", id);

// Function with union parameter
function printId(id: string | number): void {
    console.log("ID:", id);
}

printId("user-123");
printId(456);

// Solution 2: Union Type Narrowing
console.log("\n--- Type Narrowing ---");

function formatValue(value: string | number): string {
    // typeof narrowing
    if (typeof value === "string") {
        return value.toUpperCase();
    }
    return value.toFixed(2);
}

console.log(formatValue("hello"));
console.log(formatValue(42.567));

// Solution 3: Union with Arrays
console.log("\n--- Union with Arrays ---");

// Array of union type
let mixed: (string | number)[] = [1, "two", 3, "four"];
console.log("Mixed array:", mixed);

// Union of array types
let arrayOrString: string[] | string = "hello";
arrayOrString = ["h", "e", "l", "l", "o"];

// Solution 4: Literal Union Types
console.log("\n--- Literal Unions ---");

type Direction = "north" | "south" | "east" | "west";
type Status = "pending" | "active" | "completed" | "cancelled";

let direction: Direction = "north";
let status: Status = "active";

console.log("Direction:", direction);
console.log("Status:", status);

function move(direction: Direction): void {
    console.log(`Moving ${direction}`);
}

move("east");

// Solution 5: Discriminated Unions
console.log("\n--- Discriminated Unions ---");

interface Circle {
    kind: "circle";
    radius: number;
}

interface Rectangle {
    kind: "rectangle";
    width: number;
    height: number;
}

interface Triangle {
    kind: "triangle";
    base: number;
    height: number;
}

type Shape = Circle | Rectangle | Triangle;

function getArea(shape: Shape): number {
    switch (shape.kind) {
        case "circle":
            return Math.PI * shape.radius ** 2;
        case "rectangle":
            return shape.width * shape.height;
        case "triangle":
            return 0.5 * shape.base * shape.height;
    }
}

console.log("Circle area:", getArea({ kind: "circle", radius: 5 }));
console.log("Rectangle area:", getArea({ kind: "rectangle", width: 4, height: 6 }));

// Solution 6: Union with null/undefined
console.log("\n--- Nullable Unions ---");

type MaybeString = string | null;
type OptionalNumber = number | undefined;

function greet(name: MaybeString): string {
    if (name === null) {
        return "Hello, stranger!";
    }
    return `Hello, ${name}!`;
}

console.log(greet("John"));
console.log(greet(null));

// Solution 7: Union in Function Returns
console.log("\n--- Function Returns ---");

interface Success<T> {
    success: true;
    data: T;
}

interface Failure {
    success: false;
    error: string;
}

type Result<T> = Success<T> | Failure;

function fetchUser(id: number): Result<{ name: string }> {
    if (id > 0) {
        return { success: true, data: { name: "John" } };
    }
    return { success: false, error: "Invalid ID" };
}

const result = fetchUser(1);
if (result.success) {
    console.log("User:", result.data.name);
} else {
    console.log("Error:", result.error);
}

// Solution 8: Type Guards with Unions
console.log("\n--- Type Guards ---");

interface Dog {
    bark(): void;
    breed: string;
}

interface Cat {
    meow(): void;
    color: string;
}

type Pet = Dog | Cat;

function isDog(pet: Pet): pet is Dog {
    return "bark" in pet;
}

function handlePet(pet: Pet): void {
    if (isDog(pet)) {
        console.log("Dog breed:", pet.breed);
    } else {
        console.log("Cat color:", pet.color);
    }
}

handlePet({ bark: () => {}, breed: "Labrador" });
handlePet({ meow: () => {}, color: "orange" });

// Solution 9: Union Type Utilities
console.log("\n--- Union Utilities ---");

// Extract from union
type StringOrNumber = string | number | boolean;
type OnlyString = Extract<StringOrNumber, string>; // string

// Exclude from union
type NotBoolean = Exclude<StringOrNumber, boolean>; // string | number

// NonNullable
type MaybeValue = string | null | undefined;
type DefiniteValue = NonNullable<MaybeValue>; // string

// Solution 10: Practical Examples
console.log("\n--- Practical Examples ---");

// API Response
type ApiResponse<T> = 
    | { status: "loading" }
    | { status: "success"; data: T }
    | { status: "error"; error: string };

function handleResponse<T>(response: ApiResponse<T>): void {
    switch (response.status) {
        case "loading":
            console.log("Loading...");
            break;
        case "success":
            console.log("Data:", response.data);
            break;
        case "error":
            console.log("Error:", response.error);
            break;
    }
}

handleResponse({ status: "loading" });
handleResponse({ status: "success", data: { id: 1 } });
handleResponse({ status: "error", error: "Not found" });

