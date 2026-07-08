/**
 * Lab 240: Enum Best Practices
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Best practices for enums:
 * 
 * - Naming conventions
 * - When to use enums
 * - Common pitfalls
 * - Modern alternatives
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Apply naming conventions
 * 2. Choose appropriate type
 * 3. Avoid common pitfalls
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Naming Conventions
console.log("--- Naming Conventions ---");

// Enum name: PascalCase, singular
enum UserRole {
    Admin = "ADMIN",
    User = "USER",
    Guest = "GUEST"
}

// Members: PascalCase or UPPER_SNAKE_CASE
enum HttpStatus {
    OK = 200,
    NOT_FOUND = 404,
    INTERNAL_ERROR = 500
}

// String values: lowercase or UPPER_CASE
enum LogLevel {
    Debug = "debug",
    Info = "info",
    Error = "error"
}

console.log("Role:", UserRole.Admin);
console.log("Status:", HttpStatus.OK);
console.log("Level:", LogLevel.Debug);

// Solution 2: When to Use Enums
console.log("\n--- When to Use ---");

// ✓ Fixed set of related constants
enum Direction {
    North = "N",
    South = "S",
    East = "E",
    West = "W"
}

// ✓ Need runtime access to values
console.log("Directions:", Object.values(Direction));

// ✓ Need reverse mapping (numeric)
enum Priority {
    Low = 1,
    Medium = 2,
    High = 3
}
console.log("Priority 2 is:", Priority[2]);

// Solution 3: When NOT to Use Enums
console.log("\n--- When NOT to Use ---");

// ✗ Simple boolean flags - use boolean
// Bad: enum Enabled { Yes, No }
// Good: enabled: boolean

// ✗ Open-ended values - use string/number
// Bad: enum UserId { ... }
// Good: userId: string

// ✗ Single value - use const
// Bad: enum Pi { Value = 3.14159 }
// Good: const PI = 3.14159;

// Solution 4: Prefer String Enums
console.log("\n--- Prefer String Enums ---");

// String enums are more debuggable
enum Status {
    Active = "active",
    Inactive = "inactive"
}

// In logs/debugging, you see "active" not 0
console.log("Status:", Status.Active);

// JSON serialization is cleaner
const data = { status: Status.Active };
console.log("JSON:", JSON.stringify(data));

// Solution 5: Use Const Enums for Performance
console.log("\n--- Const Enums ---");

const enum FastEnum {
    A = 1,
    B = 2,
    C = 3
}

// Values are inlined - no runtime object
const value = FastEnum.A; // Compiles to: const value = 1;
console.log("Fast value:", value);

// Solution 6: Consider Const Objects
console.log("\n--- Const Objects ---");

// Modern alternative to enums
const Color = {
    Red: "#FF0000",
    Green: "#00FF00",
    Blue: "#0000FF"
} as const;

type Color = typeof Color[keyof typeof Color];

// Benefits:
// - No enum-specific syntax
// - Works with JavaScript
// - Accepts literal values
// - Fully iterable

console.log("Colors:", Object.values(Color));

// Solution 7: Avoid Common Pitfalls
console.log("\n--- Common Pitfalls ---");

// Pitfall 1: Numeric enum comparison
enum NumEnum { A = 0, B = 1 }
// if (numValue === 0) // Works but loses type safety
// Better: if (numValue === NumEnum.A)

// Pitfall 2: Forgetting exhaustive checks
function handleStatus(status: Status): string {
    switch (status) {
        case Status.Active:
            return "Active";
        case Status.Inactive:
            return "Inactive";
        // Add default with never for exhaustive check
        default:
            const _exhaustive: never = status;
            return _exhaustive;
    }
}

// Pitfall 3: Heterogeneous enums
// Avoid mixing string and number values

console.log("Pitfalls demonstrated");

// Solution 8: Type-Safe Enum Utilities
console.log("\n--- Enum Utilities ---");

function isValidEnum<T extends object>(
    enumObj: T,
    value: unknown
): value is T[keyof T] {
    return Object.values(enumObj).includes(value as T[keyof T]);
}

function getEnumKey<T extends object>(
    enumObj: T,
    value: T[keyof T]
): keyof T | undefined {
    return (Object.keys(enumObj) as (keyof T)[])
        .find(key => enumObj[key] === value);
}

console.log("Is 'active' valid?", isValidEnum(Status, "active"));
console.log("Key for 'active':", getEnumKey(Status, Status.Active));

// Solution 9: Documentation
console.log("\n--- Documentation ---");

/**
 * Represents the state of an order in the system.
 * 
 * @example
 * const order = { state: OrderState.Pending };
 */
enum OrderState {
    /** Order has been created but not yet processed */
    Pending = "pending",
    /** Order is being processed */
    Processing = "processing",
    /** Order has been completed */
    Completed = "completed",
    /** Order was cancelled */
    Cancelled = "cancelled"
}

console.log("Documented enum:", OrderState.Pending);

// Solution 10: Summary
console.log("\n--- Best Practices Summary ---");

const practices = [
    "✓ Use PascalCase for enum names",
    "✓ Prefer string enums for debugging",
    "✓ Use const enums for performance",
    "✓ Consider const objects as alternative",
    "✓ Always handle all cases (exhaustive)",
    "✓ Document enum purpose and values",
    "✓ Validate external enum values",
    "✗ Avoid heterogeneous enums",
    "✗ Don't use enums for open-ended values",
    "✗ Don't rely on numeric enum values"
];

practices.forEach(p => console.log(p));

