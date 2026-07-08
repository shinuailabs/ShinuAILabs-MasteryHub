/**
 * Lab 234: Const Enums
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Const enums for optimization:
 * 
 * - Inline values
 * - No runtime object
 * - Compilation benefits
 * - Limitations
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create const enums
 * 2. Understand inlining
 * 3. Know limitations
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Const Enum
console.log("--- Basic Const Enum ---");

const enum Direction {
    Up,
    Down,
    Left,
    Right
}

// Values are inlined at compile time
const direction = Direction.Up;
console.log("Direction:", direction); // Compiles to: console.log("Direction:", 0);

// Solution 2: String Const Enum
console.log("\n--- String Const Enum ---");

const enum HttpMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE"
}

function makeRequest(method: HttpMethod, url: string): void {
    console.log(`${method} ${url}`);
}

makeRequest(HttpMethod.GET, "/api/users");
// Compiles to: makeRequest("GET", "/api/users");

// Solution 3: Performance Benefits
console.log("\n--- Performance Benefits ---");

// Regular enum creates runtime object
enum RegularEnum {
    A = 1,
    B = 2,
    C = 3
}

// Const enum is completely removed
const enum ConstEnum {
    A = 1,
    B = 2,
    C = 3
}

// Regular: RegularEnum.A (object lookup)
// Const: 1 (inlined value)

console.log("Regular:", RegularEnum.A);
console.log("Const:", ConstEnum.A);

// Solution 4: Computed Values
console.log("\n--- Computed Values ---");

const enum Computed {
    A = 1,
    B = A * 2,      // 2
    C = B + 10,     // 12
    D = 1 << 3      // 8
}

console.log("A:", Computed.A);
console.log("B:", Computed.B);
console.log("C:", Computed.C);
console.log("D:", Computed.D);

// Solution 5: Limitations
console.log("\n--- Limitations ---");

const enum Status {
    Active = "active",
    Inactive = "inactive"
}

// Cannot use computed member access
// const key = "Active";
// Status[key]; // Error!

// Cannot iterate
// Object.values(Status); // Error at runtime!

// Cannot use in some contexts
// const status: Status = getStatusFromApi(); // May not work

// Solution 6: preserveConstEnums
console.log("\n--- preserveConstEnums ---");

// With tsconfig: "preserveConstEnums": true
// The enum object is kept but values are still inlined

const enum PreservedEnum {
    X = 1,
    Y = 2
}

// Still inlined in usage
const x = PreservedEnum.X; // Becomes: const x = 1;

console.log("X:", x);

// Solution 7: When to Use Const Enums
console.log("\n--- When to Use ---");

// Good use cases:
// 1. Performance-critical code
// 2. Large enums with many members
// 3. Enums used frequently
// 4. When you don't need runtime access

const enum LogLevel {
    Debug = 0,
    Info = 1,
    Warning = 2,
    Error = 3
}

function log(level: LogLevel, message: string): void {
    if (level >= LogLevel.Warning) {
        console.log(`[${level}] ${message}`);
    }
}

log(LogLevel.Info, "Info message");
log(LogLevel.Error, "Error message");

// Solution 8: Const Enum vs Regular
console.log("\n--- Comparison ---");

// Regular enum
enum RegularColor {
    Red = "#FF0000",
    Green = "#00FF00"
}

// Const enum
const enum ConstColor {
    Red = "#FF0000",
    Green = "#00FF00"
}

// Regular: creates object, allows iteration
console.log("Regular values:", Object.values(RegularColor));

// Const: no object, values inlined
const red = ConstColor.Red; // Becomes: const red = "#FF0000";
console.log("Const red:", red);

// Solution 9: Ambient Const Enums
console.log("\n--- Ambient Const Enums ---");

// In .d.ts files, const enums can be declared
// declare const enum ExternalEnum {
//     A = 1,
//     B = 2
// }

// These are always inlined and have no runtime representation

// Solution 10: Best Practices
console.log("\n--- Best Practices ---");

const practices = [
    "✓ Use const enums for performance",
    "✓ Use when you don't need runtime access",
    "✓ Prefer regular enums for debugging",
    "✓ Consider preserveConstEnums for libraries",
    "✓ Document const enum limitations",
    "✓ Test thoroughly when using const enums",
    "✗ Don't use if you need Object.values()",
    "✗ Don't use if you need dynamic access"
];

practices.forEach(p => console.log(p));

