/**
 * Lab 215: Literal Types
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
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
type Status = "pending" | "active" | "completed";

let direction: Direction = "north";
// direction = "up"; // Error: not assignable

function move(dir: Direction): void {
    console.log(`Moving ${dir}`);
}

move("south");

// Solution 2: Number Literal Types
console.log("\n--- Number Literal Types ---");

type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6;
type HttpStatus = 200 | 201 | 400 | 401 | 403 | 404 | 500;
type Port = 80 | 443 | 3000 | 8080;

function rollDice(): DiceRoll {
    return (Math.floor(Math.random() * 6) + 1) as DiceRoll;
}

console.log("Dice roll:", rollDice());

// Solution 3: Boolean Literal Types
console.log("\n--- Boolean Literal Types ---");

type True = true;
type False = false;

type Success = { success: true; data: unknown };
type Failure = { success: false; error: string };

function process(flag: true): Success;
function process(flag: false): Failure;
function process(flag: boolean): Success | Failure {
    if (flag) {
        return { success: true, data: "result" };
    }
    return { success: false, error: "failed" };
}

console.log(process(true));
console.log(process(false));

// Solution 4: const Assertions
console.log("\n--- const Assertions ---");

// Without const assertion
const config1 = {
    url: "https://api.example.com",
    method: "GET"
};
// config1.method is string

// With const assertion
const config2 = {
    url: "https://api.example.com",
    method: "GET"
} as const;
// config2.method is "GET"

// Array with const
const directions = ["north", "south", "east", "west"] as const;
type DirectionFromArray = typeof directions[number];

console.log("Config method:", config2.method);

// Solution 5: Literal Inference
console.log("\n--- Literal Inference ---");

// let infers wider type
let status1 = "pending"; // string

// const infers literal type
const status2 = "pending"; // "pending"

// Function parameter with literal
function setStatus(status: "pending" | "active"): void {
    console.log(`Status: ${status}`);
}

// Need type assertion or const
const myStatus = "pending" as const;
setStatus(myStatus);

// Solution 6: Template Literal Types
console.log("\n--- Template Literal Types ---");

type Color = "red" | "green" | "blue";
type Size = "small" | "medium" | "large";

type ColorSize = `${Color}-${Size}`;
// "red-small" | "red-medium" | "red-large" | ...

type EventName = "click" | "focus" | "blur";
type Handler = `on${Capitalize<EventName>}`;
// "onClick" | "onFocus" | "onBlur"

const handler: Handler = "onClick";
console.log("Handler:", handler);

// Solution 7: Literal Types in Objects
console.log("\n--- Literal in Objects ---");

interface Button {
    type: "button" | "submit" | "reset";
    size: "small" | "medium" | "large";
    variant: "primary" | "secondary" | "danger";
}

const submitButton: Button = {
    type: "submit",
    size: "medium",
    variant: "primary"
};

console.log("Button:", submitButton);

// Solution 8: Discriminated Unions with Literals
console.log("\n--- Discriminated Unions ---");

type Circle = { kind: "circle"; radius: number };
type Square = { kind: "square"; side: number };
type Rectangle = { kind: "rectangle"; width: number; height: number };

type Shape = Circle | Square | Rectangle;

function area(shape: Shape): number {
    switch (shape.kind) {
        case "circle":
            return Math.PI * shape.radius ** 2;
        case "square":
            return shape.side ** 2;
        case "rectangle":
            return shape.width * shape.height;
    }
}

console.log("Circle area:", area({ kind: "circle", radius: 5 }));

// Solution 9: Enum-like Patterns
console.log("\n--- Enum-like Patterns ---");

// Using const object instead of enum
const Colors = {
    Red: "RED",
    Green: "GREEN",
    Blue: "BLUE"
} as const;

type ColorValue = typeof Colors[keyof typeof Colors];
// "RED" | "GREEN" | "BLUE"

function setColor(color: ColorValue): void {
    console.log(`Color: ${color}`);
}

setColor(Colors.Red);

// Solution 10: Practical Examples
console.log("\n--- Practical Examples ---");

// API endpoint configuration
type ApiConfig = {
    method: "GET" | "POST" | "PUT" | "DELETE";
    endpoint: string;
    auth: "none" | "basic" | "bearer";
};

const apiConfig: ApiConfig = {
    method: "POST",
    endpoint: "/api/users",
    auth: "bearer"
};

// State machine
type TrafficLight = "red" | "yellow" | "green";

function nextLight(current: TrafficLight): TrafficLight {
    switch (current) {
        case "red": return "green";
        case "green": return "yellow";
        case "yellow": return "red";
    }
}

console.log("Next light:", nextLight("red"));

// Keyboard shortcuts
type Modifier = "ctrl" | "alt" | "shift" | "meta";
type Key = "a" | "b" | "c" | "s" | "z";
type Shortcut = `${Modifier}+${Key}`;

const saveShortcut: Shortcut = "ctrl+s";
console.log("Shortcut:", saveShortcut);

