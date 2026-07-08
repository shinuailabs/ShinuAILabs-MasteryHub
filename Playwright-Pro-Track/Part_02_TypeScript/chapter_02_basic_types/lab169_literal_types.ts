/**
 * Lab 169: Literal Types
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Exact value types:
 * 
 * - String literals
 * - Number literals
 * - Boolean literals
 * - const assertions
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create literal types
 * 2. Use const assertions
 * 3. Combine with unions
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: String Literal Types
console.log("--- String Literal Types ---");

type Direction = "north" | "south" | "east" | "west";
type Status = "pending" | "active" | "completed";
type Size = "small" | "medium" | "large";

let direction: Direction = "north";
let status: Status = "active";
let size: Size = "medium";

console.log("Direction:", direction);
console.log("Status:", status);
console.log("Size:", size);

// Function with literal parameter
function move(dir: Direction): void {
    console.log(`Moving ${dir}`);
}

move("east");
// move("up"); // Error!

// Solution 2: Number Literal Types
console.log("\n--- Number Literal Types ---");

type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6;
type HttpStatus = 200 | 201 | 400 | 401 | 404 | 500;
type Port = 80 | 443 | 3000 | 8080;

let roll: DiceRoll = 4;
let httpStatus: HttpStatus = 200;
let port: Port = 3000;

console.log("Dice roll:", roll);
console.log("HTTP status:", httpStatus);
console.log("Port:", port);

// Solution 3: Boolean Literal Types
console.log("\n--- Boolean Literal Types ---");

type True = true;
type False = false;

// Useful in conditional types
type IsString<T> = T extends string ? true : false;

type Test1 = IsString<string>;  // true
type Test2 = IsString<number>;  // false

// Solution 4: const Assertions
console.log("\n--- const Assertions ---");

// Without const assertion
let mutableArray = [1, 2, 3];  // number[]
let mutableObject = { x: 10, y: 20 };  // { x: number, y: number }

// With const assertion
const immutableArray = [1, 2, 3] as const;  // readonly [1, 2, 3]
const immutableObject = { x: 10, y: 20 } as const;  // { readonly x: 10, readonly y: 20 }

console.log("Immutable array:", immutableArray);
console.log("Immutable object:", immutableObject);

// immutableArray.push(4); // Error!
// immutableObject.x = 15; // Error!

// Solution 5: Literal Inference
console.log("\n--- Literal Inference ---");

// let infers wider type
let letString = "hello";  // string

// const infers literal type
const constString = "hello";  // "hello"

// Function parameter inference
function handleRequest(url: string, method: "GET" | "POST"): void {
    console.log(`${method} ${url}`);
}

// This works
handleRequest("/api", "GET");

// This needs assertion
const req = { url: "/api", method: "GET" as const };
handleRequest(req.url, req.method);

// Or use as const on whole object
const req2 = { url: "/api", method: "GET" } as const;
handleRequest(req2.url, req2.method);

// Solution 6: Discriminated Unions with Literals
console.log("\n--- Discriminated Unions ---");

interface Circle {
    kind: "circle";
    radius: number;
}

interface Square {
    kind: "square";
    side: number;
}

interface Rectangle {
    kind: "rectangle";
    width: number;
    height: number;
}

type Shape = Circle | Square | Rectangle;

function getArea(shape: Shape): number {
    switch (shape.kind) {
        case "circle":
            return Math.PI * shape.radius ** 2;
        case "square":
            return shape.side ** 2;
        case "rectangle":
            return shape.width * shape.height;
    }
}

console.log("Circle area:", getArea({ kind: "circle", radius: 5 }));

// Solution 7: Template Literal Types
console.log("\n--- Template Literal Types ---");

type Color = "red" | "green" | "blue";
type Brightness = "light" | "dark";

type ColorVariant = `${Brightness}-${Color}`;
// "light-red" | "light-green" | "light-blue" | "dark-red" | "dark-green" | "dark-blue"

let variant: ColorVariant = "light-blue";
console.log("Color variant:", variant);

// Event names
type EventType = "click" | "focus" | "blur";
type EventHandler = `on${Capitalize<EventType>}`;
// "onClick" | "onFocus" | "onBlur"

// Solution 8: Literal Types in Objects
console.log("\n--- Literals in Objects ---");

type Config = {
    mode: "development" | "production" | "test";
    logLevel: "debug" | "info" | "warn" | "error";
    port: 3000 | 8080 | 443;
};

const config: Config = {
    mode: "development",
    logLevel: "debug",
    port: 3000
};

console.log("Config:", config);

// Solution 9: Narrowing with Literals
console.log("\n--- Narrowing ---");

type Animal = {
    type: "dog" | "cat" | "bird";
    name: string;
};

function makeSound(animal: Animal): string {
    switch (animal.type) {
        case "dog":
            return "Woof!";
        case "cat":
            return "Meow!";
        case "bird":
            return "Tweet!";
    }
}

console.log(makeSound({ type: "dog", name: "Rex" }));

// Solution 10: Practical Examples
console.log("\n--- Practical Examples ---");

// API Response
type ApiResponse<T> = {
    status: "success" | "error";
    data?: T;
    error?: string;
};

// Button component props
type ButtonProps = {
    variant: "primary" | "secondary" | "danger";
    size: "sm" | "md" | "lg";
    disabled?: boolean;
};

const button: ButtonProps = {
    variant: "primary",
    size: "md"
};

console.log("Button:", button);

// State machine
type TrafficLight = "red" | "yellow" | "green";

function nextLight(current: TrafficLight): TrafficLight {
    const transitions: Record<TrafficLight, TrafficLight> = {
        red: "green",
        green: "yellow",
        yellow: "red"
    };
    return transitions[current];
}

console.log("Next light:", nextLight("red"));

