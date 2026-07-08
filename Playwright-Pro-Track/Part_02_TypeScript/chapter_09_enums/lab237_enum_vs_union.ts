/**
 * Lab 237: Enum vs Union Types
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Comparing enums and union types:
 * 
 * - When to use each
 * - Trade-offs
 * - Performance
 * - Type safety
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Compare enum and union
 * 2. Understand trade-offs
 * 3. Choose appropriately
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Comparison
console.log("--- Basic Comparison ---");

// Enum approach
enum DirectionEnum {
    Up = "UP",
    Down = "DOWN",
    Left = "LEFT",
    Right = "RIGHT"
}

// Union type approach
type DirectionUnion = "UP" | "DOWN" | "LEFT" | "RIGHT";

// Both work similarly
function moveEnum(dir: DirectionEnum): void {
    console.log("Enum move:", dir);
}

function moveUnion(dir: DirectionUnion): void {
    console.log("Union move:", dir);
}

moveEnum(DirectionEnum.Up);
moveUnion("UP");

// Solution 2: Runtime Behavior
console.log("\n--- Runtime Behavior ---");

// Enum exists at runtime
console.log("Enum object:", DirectionEnum);
console.log("Enum.Up:", DirectionEnum.Up);

// Union type is erased at runtime
// DirectionUnion doesn't exist at runtime
// It's purely a compile-time construct

// Solution 3: Iteration Differences
console.log("\n--- Iteration ---");

// Can iterate enum
console.log("Enum values:", Object.values(DirectionEnum));

// Cannot iterate union type directly
// Need to create array manually
const directionValues: DirectionUnion[] = ["UP", "DOWN", "LEFT", "RIGHT"];
console.log("Union values:", directionValues);

// Solution 4: Type Safety
console.log("\n--- Type Safety ---");

// Enum requires using enum member
// moveEnum("UP"); // Error! Must use DirectionEnum.Up

// Union accepts literal directly
moveUnion("UP"); // OK!

// Solution 5: Const Object Alternative
console.log("\n--- Const Object ---");

const Direction = {
    Up: "UP",
    Down: "DOWN",
    Left: "LEFT",
    Right: "RIGHT"
} as const;

type DirectionConst = typeof Direction[keyof typeof Direction];

function moveConst(dir: DirectionConst): void {
    console.log("Const move:", dir);
}

moveConst(Direction.Up);
moveConst("UP"); // Also works!

// Best of both worlds:
// - Named constants like enum
// - Accepts literals like union
// - Iterable like enum

// Solution 6: Performance Comparison
console.log("\n--- Performance ---");

// Enum: Creates runtime object
// - Small memory overhead
// - Object property lookup

// Union: No runtime overhead
// - Purely compile-time
// - Direct value comparison

// Const enum: Best performance
const enum FastDirection {
    Up = "UP",
    Down = "DOWN"
}
// Values are inlined, no object created

// Solution 7: Extensibility
console.log("\n--- Extensibility ---");

// Enums can be extended (declaration merging)
enum ExtendableEnum {
    A = "A"
}

// In another file/module:
// enum ExtendableEnum {
//     B = "B"
// }

// Union types cannot be extended
// Must create new type
type BaseUnion = "A" | "B";
type ExtendedUnion = BaseUnion | "C" | "D";

// Solution 8: Use Case Recommendations
console.log("\n--- Recommendations ---");

// Use ENUM when:
// - Need runtime access to values
// - Need reverse mapping (numeric)
// - Working with external APIs expecting specific values
// - Need to iterate over all values

// Use UNION when:
// - Simple set of literal values
// - No need for runtime object
// - Want to accept literal values directly
// - Smaller bundle size matters

// Use CONST OBJECT when:
// - Want named constants
// - Need iteration
// - Want to accept literals
// - Best of both worlds

// Solution 9: Practical Examples
console.log("\n--- Practical Examples ---");

// API Status - Enum (need runtime access)
enum ApiStatus {
    Loading = "loading",
    Success = "success",
    Error = "error"
}

// HTTP Methods - Union (simple literals)
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

// Colors - Const Object (named + iterable)
const Colors = {
    Red: "#FF0000",
    Green: "#00FF00",
    Blue: "#0000FF"
} as const;

type Color = typeof Colors[keyof typeof Colors];

// Solution 10: Migration Example
console.log("\n--- Migration ---");

// From enum to const object
enum OldStatus {
    Active = "active",
    Inactive = "inactive"
}

// Migrated version
const NewStatus = {
    Active: "active",
    Inactive: "inactive"
} as const;

type NewStatusType = typeof NewStatus[keyof typeof NewStatus];

// Usage comparison
function handleOld(status: OldStatus): void {
    console.log("Old:", status);
}

function handleNew(status: NewStatusType): void {
    console.log("New:", status);
}

handleOld(OldStatus.Active);
handleNew(NewStatus.Active);
handleNew("active"); // Union-like flexibility

// Summary
console.log("\n--- Summary ---");
const summary = [
    "Enum: Runtime object, type-safe, iterable",
    "Union: Compile-time only, accepts literals",
    "Const Object: Best of both, recommended",
    "Const Enum: Best performance, limited use"
];
summary.forEach(s => console.log(s));

