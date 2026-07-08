/**
 * Lab 233: Heterogeneous Enums
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Mixed string and numeric enums:
 * 
 * - Combining types
 * - Use cases
 * - Limitations
 * - Best practices
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Create heterogeneous enums
 * 2. Understand limitations
 * 3. Know when to use
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Heterogeneous Enum
console.log("--- Heterogeneous Enum ---");

enum Mixed {
    No = 0,
    Yes = "YES"
}

console.log("No:", Mixed.No);
console.log("Yes:", Mixed.Yes);

// Solution 2: Response Codes
console.log("\n--- Response Codes ---");

enum Response {
    Success = 1,
    Error = "ERROR",
    Pending = 0,
    Unknown = "UNKNOWN"
}

function handleResponse(response: Response): string {
    switch (response) {
        case Response.Success:
            return "Operation successful";
        case Response.Error:
            return "An error occurred";
        case Response.Pending:
            return "Operation pending";
        case Response.Unknown:
            return "Unknown status";
    }
}

console.log(handleResponse(Response.Success));
console.log(handleResponse(Response.Error));

// Solution 3: Why Avoid Heterogeneous
console.log("\n--- Why Avoid ---");

// Heterogeneous enums are confusing
// - Mixed types make code harder to understand
// - Reverse mapping only works for numeric members
// - Type checking becomes complex

enum Confusing {
    A = 0,
    B = "B",
    C = 1,
    D = "D"
}

// Reverse mapping only for numbers
console.log("Confusing[0]:", Confusing[0]); // "A"
console.log("Confusing[1]:", Confusing[1]); // "C"
// console.log("Confusing['B']:", Confusing["B"]); // undefined

// Solution 4: Better Alternatives
console.log("\n--- Better Alternatives ---");

// Use separate enums
enum NumericStatus {
    Inactive = 0,
    Active = 1,
    Pending = 2
}

enum StringStatus {
    Inactive = "inactive",
    Active = "active",
    Pending = "pending"
}

// Or use union types
type Status = 0 | 1 | "active" | "inactive";

// Solution 5: Const Assertions Instead
console.log("\n--- Const Assertions ---");

const ResponseCodes = {
    Success: 200,
    Created: 201,
    Error: "ERROR",
    NotFound: "NOT_FOUND"
} as const;

type ResponseCode = typeof ResponseCodes[keyof typeof ResponseCodes];

function handleCode(code: ResponseCode): void {
    console.log("Handling code:", code);
}

handleCode(ResponseCodes.Success);
handleCode(ResponseCodes.Error);

// Solution 6: When Heterogeneous Might Be OK
console.log("\n--- Valid Use Cases ---");

// Legacy API compatibility
enum LegacyApi {
    OldSuccess = 1,
    OldError = 2,
    NewSuccess = "SUCCESS",
    NewError = "ERROR"
}

// Transitional code
function handleLegacy(response: LegacyApi): string {
    if (typeof response === "number") {
        return `Legacy response: ${response}`;
    }
    return `New response: ${response}`;
}

console.log(handleLegacy(LegacyApi.OldSuccess));
console.log(handleLegacy(LegacyApi.NewSuccess));

// Solution 7: Type Checking Challenges
console.log("\n--- Type Checking ---");

enum HeteroEnum {
    Num = 42,
    Str = "string"
}

function processHetero(value: HeteroEnum): void {
    // Need to check type at runtime
    if (typeof value === "number") {
        console.log("Numeric value:", value);
    } else {
        console.log("String value:", value);
    }
}

processHetero(HeteroEnum.Num);
processHetero(HeteroEnum.Str);

// Solution 8: Discriminated Union Alternative
console.log("\n--- Discriminated Union ---");

type NumericResponse = {
    type: "numeric";
    code: number;
};

type StringResponse = {
    type: "string";
    message: string;
};

type ApiResponse = NumericResponse | StringResponse;

function handleApiResponse(response: ApiResponse): void {
    if (response.type === "numeric") {
        console.log("Code:", response.code);
    } else {
        console.log("Message:", response.message);
    }
}

handleApiResponse({ type: "numeric", code: 200 });
handleApiResponse({ type: "string", message: "OK" });

// Solution 9: Best Practices Summary
console.log("\n--- Best Practices ---");

const practices = [
    "1. Avoid heterogeneous enums when possible",
    "2. Use string enums for readability",
    "3. Use numeric enums for performance",
    "4. Consider const objects with 'as const'",
    "5. Use discriminated unions for complex cases",
    "6. Document any heterogeneous enum usage",
    "7. Be consistent within a codebase"
];

practices.forEach(p => console.log(p));

// Solution 10: Migration Example
console.log("\n--- Migration Example ---");

// Old heterogeneous enum
enum OldEnum {
    A = 0,
    B = "B"
}

// Migrated to const object
const NewEnum = {
    A: 0,
    B: "B"
} as const;

type NewEnumType = typeof NewEnum[keyof typeof NewEnum];

// Usage remains similar
console.log("Old:", OldEnum.A, OldEnum.B);
console.log("New:", NewEnum.A, NewEnum.B);

