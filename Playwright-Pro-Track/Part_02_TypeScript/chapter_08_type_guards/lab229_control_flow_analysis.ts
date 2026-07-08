/**
 * Lab 229: Control Flow Analysis
 *
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * TypeScript's control flow analysis:
 *
 * - Type narrowing in branches
 * - Reachability analysis
 * - Assignment analysis
 * - Return type inference
 *
 * =====================
 * EXERCISE:
 * =====================
 * 1. Understand control flow
 * 2. Use branch narrowing
 * 3. Handle unreachable code
 *
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: If/Else Narrowing
console.log("--- If/Else Narrowing ---");

function processValue(value: string | number): string {
    if (typeof value === "string") {
        // value is string in this branch
        return value.toUpperCase();
    } else {
        // value is number in this branch
        return value.toFixed(2);
    }
    // No code after - all paths return
}

console.log(processValue("hello"));
console.log(processValue(42.5));

// Solution 2: Early Return Pattern
console.log("\n--- Early Return ---");

function greet(name: string | null | undefined): string {
    if (name === null) {
        return "Hello, Anonymous!";
    }

    if (name === undefined) {
        return "Hello, Unknown!";
    }

    // name is string here
    return `Hello, ${name}!`;
}

console.log(greet("John"));
console.log(greet(null));

// Solution 3: Assignment Analysis
console.log("\n--- Assignment Analysis ---");

function initialize(condition: boolean): string {
    let result: string;

    if (condition) {
        result = "Condition true";
    } else {
        result = "Condition false";
    }

    // TypeScript knows result is assigned
    return result;
}

console.log(initialize(true));
console.log(initialize(false));

// Solution 4: Loop Analysis
console.log("\n--- Loop Analysis ---");

function findFirst(items: (string | number)[]): string | number | undefined {
    for (const item of items) {
        if (typeof item === "string") {
            return item; // Returns string
        }
    }
    return undefined;
}

console.log(findFirst([1, 2, "hello", 3]));
console.log(findFirst([1, 2, 3]));

// Solution 5: Switch Statement
console.log("\n--- Switch Statement ---");

type Shape =
    | { kind: "circle"; radius: number }
    | { kind: "square"; side: number }
    | { kind: "rectangle"; width: number; height: number };

function getArea(shape: Shape): number {
    switch (shape.kind) {
        case "circle":
            // shape is Circle
            return Math.PI * shape.radius ** 2;
        case "square":
            // shape is Square
            return shape.side ** 2;
        case "rectangle":
            // shape is Rectangle
            return shape.width * shape.height;
    }
}

console.log(getArea({ kind: "circle", radius: 5 }));

// Solution 6: Throw Narrowing
console.log("\n--- Throw Narrowing ---");

function assertDefined<T>(value: T | null | undefined): T {
    if (value === null || value === undefined) {
        throw new Error("Value is not defined");
    }
    // value is T here
    return value;
}

function process(value: string | null): string {
    const defined = assertDefined(value);
    // defined is string
    return defined.toUpperCase();
}

console.log(process("hello"));

// Solution 7: Nested Conditions
console.log("\n--- Nested Conditions ---");

interface User {
    name: string;
    address?: {
        city?: string;
        country?: string;
    };
}

function getLocation(user: User): string {
    if (user.address) {
        // user.address is defined
        if (user.address.city) {
            // user.address.city is defined
            if (user.address.country) {
                return `${user.address.city}, ${user.address.country}`;
            }
            return user.address.city;
        }
    }
    return "Unknown";
}

console.log(getLocation({ name: "John", address: { city: "NYC", country: "USA" } }));
console.log(getLocation({ name: "Jane" }));

// Solution 8: Logical Operators
console.log("\n--- Logical Operators ---");

function processInput(input: string | null | undefined): string {
    // && narrowing
    if (input && input.length > 0) {
        return input.trim();
    }

    return "default";
}

function getValue(a: number | null, b: number | null): number {
    // || with narrowing
    return a ?? b ?? 0;
}

console.log(processInput("  hello  "));
console.log(processInput(null));
console.log(getValue(5, 10));
console.log(getValue(null, 10));

// Solution 9: Type Predicates in Flow
console.log("\n--- Type Predicates ---");

interface Cat { meow(): void; }
interface Dog { bark(): void; }

function isCat(animal: Cat | Dog): animal is Cat {
    return "meow" in animal;
}

function makeSound(animal: Cat | Dog): void {
    if (isCat(animal)) {
        // animal is Cat
        animal.meow();
    } else {
        // animal is Dog
        animal.bark();
    }
}

makeSound({ meow: () => console.log("Meow!") });
makeSound({ bark: () => console.log("Woof!") });

// Solution 10: Practical Example
console.log("\n--- Practical Example ---");

type Result<T, E> =
    | { success: true; value: T }
    | { success: false; error: E };

function processResult<T, E>(
    result: Result<T, E>,
    onSuccess: (value: T) => void,
    onError: (error: E) => void
): void {
    if (result.success) {
        // result is success variant
        onSuccess(result.value);
    } else {
        // result is error variant
        onError(result.error);
    }
}

processResult(
    { success: true, value: 42 },
    (v) => console.log("Success:", v),
    (e) => console.log("Error:", e)
);

processResult(
    { success: false, error: "Not found" },
    (v) => console.log("Success:", v),
    (e) => console.log("Error:", e)
);
