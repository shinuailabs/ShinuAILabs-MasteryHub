/**
 * Lab 239: Ambient Enums
 *
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Ambient enums for declarations:
 *
 * - declare enum syntax
 * - External library types
 * - No runtime code
 * - Declaration files
 *
 * =====================
 * EXERCISE:
 * =====================
 * 1. Understand ambient enums
 * 2. Use in declarations
 * 3. Know limitations
 *
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: What are Ambient Enums?
console.log("--- Ambient Enums ---");

// Ambient enums are declared with 'declare' keyword
// They describe enums that exist elsewhere (external libraries)
// No JavaScript code is generated for them

// Example (would be in .d.ts file):
// declare enum ExternalStatus {
//     Active = "active",
//     Inactive = "inactive"
// }

// Solution 2: Regular vs Ambient
console.log("\n--- Regular vs Ambient ---");

// Regular enum - generates JavaScript
enum RegularEnum {
    A = 1,
    B = 2
}

// Ambient enum - no JavaScript generated
// declare enum AmbientEnum {
//     A = 1,
//     B = 2
// }

// Regular enum creates this at runtime:
// var RegularEnum;
// (function (RegularEnum) {
//     RegularEnum[RegularEnum["A"] = 1] = "A";
//     RegularEnum[RegularEnum["B"] = 2] = "B";
// })(RegularEnum || (RegularEnum = {}));

console.log("Regular enum exists:", typeof RegularEnum);

// Solution 3: Simulating Ambient Enum
console.log("\n--- Simulating Ambient ---");

// In a .d.ts file, you might have:
// declare enum NodeEnv {
//     Development = "development",
//     Production = "production",
//     Test = "test"
// }

// For this demo, we'll create a regular enum
// that represents what an ambient enum would look like
enum NodeEnv {
    Development = "development",
    Production = "production",
    Test = "test"
}

function getConfig(env: NodeEnv): object {
    switch (env) {
        case NodeEnv.Development:
            return { debug: true, minify: false };
        case NodeEnv.Production:
            return { debug: false, minify: true };
        case NodeEnv.Test:
            return { debug: true, minify: false };
    }
}

console.log("Dev config:", getConfig(NodeEnv.Development));

// Solution 4: Ambient Const Enums
console.log("\n--- Ambient Const Enums ---");

// Ambient const enums are always inlined
// declare const enum HttpMethod {
//     GET = "GET",
//     POST = "POST"
// }

// When used, values are directly substituted
// const method = HttpMethod.GET; // Becomes: const method = "GET";

// For demo purposes:
const enum HttpMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE"
}

const method = HttpMethod.GET;
console.log("Method:", method);

// Solution 5: Declaration Files
console.log("\n--- Declaration Files ---");

// In external-lib.d.ts:
// declare enum ExternalLibStatus {
//     Ready = 0,
//     Loading = 1,
//     Error = 2
// }

// This tells TypeScript about an enum that exists
// in an external JavaScript library

// Example usage pattern:
interface ExternalLibConfig {
    status: number; // Would be ExternalLibStatus
    message: string;
}

// Solution 6: When to Use Ambient Enums
console.log("\n--- When to Use ---");

const useCases = [
    "1. Describing external JavaScript libraries",
    "2. Creating type definitions (.d.ts files)",
    "3. Declaring global enums",
    "4. Interfacing with non-TypeScript code"
];

useCases.forEach(u => console.log(u));

// Solution 7: Ambient Enum Limitations
console.log("\n--- Limitations ---");

// Ambient enums without initializers need special handling
// declare enum Uninitialized {
//     A,  // Value unknown at compile time
//     B,
//     C
// }

// Non-const ambient enums may not be inlined
// This can cause issues if the enum doesn't exist at runtime

const limitations = [
    "- No runtime object unless provided externally",
    "- Uninitialized members have unknown values",
    "- Can't iterate without runtime object",
    "- Must match external implementation exactly"
];

limitations.forEach(l => console.log(l));

// Solution 8: Best Practices
console.log("\n--- Best Practices ---");

// 1. Prefer const ambient enums when possible
// declare const enum SafeEnum {
//     A = "A",
//     B = "B"
// }

// 2. Always initialize ambient enum members
// declare enum InitializedEnum {
//     A = 0,
//     B = 1
// }

// 3. Use string values for safety
// declare enum StringEnum {
//     Active = "active",
//     Inactive = "inactive"
// }

const practices = [
    "✓ Use const for ambient enums when possible",
    "✓ Always initialize enum members",
    "✓ Prefer string values for safety",
    "✓ Document external dependencies",
    "✓ Test with actual external library"
];

practices.forEach(p => console.log(p));

// Solution 9: Alternative Approaches
console.log("\n--- Alternatives ---");

// Instead of ambient enums, consider:

// 1. Type declarations
type ExternalStatus = "active" | "inactive" | "pending";

// 2. Const objects with type
declare const ExternalLib: {
    readonly Status: {
        readonly Active: "active";
        readonly Inactive: "inactive";
    };
};

// 3. Interface with string literals
interface ExternalConfig {
    status: "ready" | "loading" | "error";
}

console.log("Alternatives available for type safety");

// Solution 10: Practical Example
console.log("\n--- Practical Example ---");

// Simulating an external library's enum
// In real scenario, this would be in .d.ts file

// External library provides:
const ExternalAPI = {
    ResponseCode: {
        Success: 200,
        NotFound: 404,
        Error: 500
    }
} as const;

type ResponseCode = typeof ExternalAPI.ResponseCode[keyof typeof ExternalAPI.ResponseCode];

function handleResponse(code: ResponseCode): string {
    switch (code) {
        case ExternalAPI.ResponseCode.Success:
            return "Success!";
        case ExternalAPI.ResponseCode.NotFound:
            return "Not found";
        case ExternalAPI.ResponseCode.Error:
            return "Server error";
        default:
            return "Unknown";
    }
}

console.log(handleResponse(ExternalAPI.ResponseCode.Success));
console.log(handleResponse(ExternalAPI.ResponseCode.NotFound));
