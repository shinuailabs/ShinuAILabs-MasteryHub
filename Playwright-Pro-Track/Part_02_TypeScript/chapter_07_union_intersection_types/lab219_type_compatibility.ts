/**
 * Lab 219: Type Compatibility
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Structural type system:
 * 
 * - Structural typing
 * - Duck typing
 * - Excess property checks
 * - Function compatibility
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Understand structural typing
 * 2. Work with compatible types
 * 3. Handle excess properties
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Structural Typing
console.log("--- Structural Typing ---");

interface Point {
    x: number;
    y: number;
}

interface Coordinate {
    x: number;
    y: number;
}

// Same structure = compatible
const point: Point = { x: 10, y: 20 };
const coord: Coordinate = point;  // OK!

console.log("Coord:", coord);

// Solution 2: Duck Typing
console.log("\n--- Duck Typing ---");

interface HasLength {
    length: number;
}

function logLength(item: HasLength): void {
    console.log("Length:", item.length);
}

// All these have 'length' property
logLength("hello");        // string
logLength([1, 2, 3]);      // array
logLength({ length: 10 }); // object

// Solution 3: Subtype Compatibility
console.log("\n--- Subtype Compatibility ---");

interface Animal {
    name: string;
}

interface Dog extends Animal {
    breed: string;
}

let animal: Animal;
let dog: Dog = { name: "Rex", breed: "German Shepherd" };

// Dog is subtype of Animal
animal = dog;  // OK!
// dog = animal;  // Error: Animal doesn't have breed

console.log("Animal:", animal);

// Solution 4: Excess Property Checks
console.log("\n--- Excess Property Checks ---");

interface Config {
    host: string;
    port: number;
}

// Direct assignment - excess property check
// const config: Config = { host: "localhost", port: 3000, debug: true }; // Error!

// Via variable - no excess check
const options = { host: "localhost", port: 3000, debug: true };
const config: Config = options;  // OK!

console.log("Config:", config);

// Type assertion to bypass
const config2: Config = { host: "localhost", port: 3000, debug: true } as Config;

// Solution 5: Function Compatibility
console.log("\n--- Function Compatibility ---");

type Handler = (event: { type: string }) => void;

// Fewer parameters OK
const handler1: Handler = () => console.log("No params");
const handler2: Handler = (e) => console.log(e.type);

// More specific parameter OK
const handler3: Handler = (e: { type: string; target: unknown }) => {
    console.log(e.type);
};

handler1({ type: "click" });
handler2({ type: "click" });

// Solution 6: Return Type Compatibility
console.log("\n--- Return Type Compatibility ---");

type GetAnimal = () => Animal;
type GetDog = () => Dog;

// Subtype return is compatible
const getAnimal: GetAnimal = (): Dog => ({ name: "Rex", breed: "Lab" });

// Supertype return is NOT compatible
// const getDog: GetDog = (): Animal => ({ name: "Rex" }); // Error!

console.log("Animal:", getAnimal());

// Solution 7: Bivariance in Methods
console.log("\n--- Method Bivariance ---");

interface EventHandler {
    handle(event: Event): void;
}

class ClickHandler implements EventHandler {
    // Method parameters are bivariant
    handle(event: MouseEvent): void {
        console.log("Click at", event.x, event.y);
    }
}

// Solution 8: Generic Compatibility
console.log("\n--- Generic Compatibility ---");

interface Box<T> {
    value: T;
}

let stringBox: Box<string> = { value: "hello" };
let anyBox: Box<any> = stringBox;  // OK with any

// Different type parameters are incompatible
// let numberBox: Box<number> = stringBox; // Error!

console.log("Any box:", anyBox);

// Solution 9: Enum Compatibility
console.log("\n--- Enum Compatibility ---");

enum Status {
    Active,
    Inactive
}

enum Color {
    Red,
    Blue
}

let status: Status = Status.Active;
let num: number = status;  // Enum to number OK

// Different enums are incompatible
// let color: Color = status; // Error!

console.log("Status as number:", num);

// Solution 10: Practical Examples
console.log("\n--- Practical Examples ---");

// API response compatibility
interface BaseResponse {
    status: number;
    message: string;
}

interface UserResponse extends BaseResponse {
    data: { id: number; name: string };
}

function handleResponse(response: BaseResponse): void {
    console.log(`Status: ${response.status}`);
}

const userResponse: UserResponse = {
    status: 200,
    message: "OK",
    data: { id: 1, name: "John" }
};

handleResponse(userResponse);  // OK!

// Callback compatibility
type SimpleCallback = (value: string) => void;
type DetailedCallback = (value: string, index: number, array: string[]) => void;

const simple: SimpleCallback = (v) => console.log(v);
const detailed: DetailedCallback = simple;  // OK! Fewer params

["a", "b"].forEach(detailed);

// Object spread compatibility
interface Defaults {
    theme: string;
    fontSize: number;
}

interface UserSettings extends Defaults {
    username: string;
}

const defaults: Defaults = { theme: "dark", fontSize: 14 };
const settings: UserSettings = { ...defaults, username: "john" };

console.log("Settings:", settings);

