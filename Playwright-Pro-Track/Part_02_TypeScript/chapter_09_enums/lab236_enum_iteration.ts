/**
 * Lab 236: Enum Iteration
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Iterating over enum values:
 * 
 * - Object.keys/values
 * - Numeric vs string enums
 * - Filtering values
 * - Practical patterns
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Iterate numeric enums
 * 2. Iterate string enums
 * 3. Filter enum values
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Iterating Numeric Enum
console.log("--- Numeric Enum Iteration ---");

enum Direction {
    Up,
    Down,
    Left,
    Right
}

// Object.keys returns both names and values for numeric enums
console.log("All keys:", Object.keys(Direction));
// ["0", "1", "2", "3", "Up", "Down", "Left", "Right"]

// Filter to get only names
const directionNames = Object.keys(Direction)
    .filter(key => isNaN(Number(key)));
console.log("Names:", directionNames);

// Filter to get only values
const directionValues = Object.keys(Direction)
    .filter(key => !isNaN(Number(key)))
    .map(Number);
console.log("Values:", directionValues);

// Solution 2: Iterating String Enum
console.log("\n--- String Enum Iteration ---");

enum Color {
    Red = "red",
    Green = "green",
    Blue = "blue"
}

// String enums are simpler
console.log("Keys:", Object.keys(Color));
console.log("Values:", Object.values(Color));

// Iterate with entries
Object.entries(Color).forEach(([key, value]) => {
    console.log(`${key}: ${value}`);
});

// Solution 3: Generic Enum Iterator
console.log("\n--- Generic Iterator ---");

function getEnumKeys<T extends object>(enumObj: T): (keyof T)[] {
    return Object.keys(enumObj).filter(
        key => isNaN(Number(key))
    ) as (keyof T)[];
}

function getEnumValues<T extends object>(enumObj: T): T[keyof T][] {
    const keys = getEnumKeys(enumObj);
    return keys.map(key => enumObj[key]);
}

console.log("Direction keys:", getEnumKeys(Direction));
console.log("Direction values:", getEnumValues(Direction));
console.log("Color keys:", getEnumKeys(Color));
console.log("Color values:", getEnumValues(Color));

// Solution 4: Creating Select Options
console.log("\n--- Select Options ---");

enum Status {
    Pending = "pending",
    Active = "active",
    Completed = "completed",
    Cancelled = "cancelled"
}

interface SelectOption {
    label: string;
    value: string;
}

function enumToOptions<T extends object>(enumObj: T): SelectOption[] {
    return Object.entries(enumObj).map(([key, value]) => ({
        label: key,
        value: value as string
    }));
}

const statusOptions = enumToOptions(Status);
console.log("Status options:", statusOptions);

// Solution 5: Enum to Array
console.log("\n--- Enum to Array ---");

enum Priority {
    Low = 1,
    Medium = 2,
    High = 3,
    Critical = 4
}

function numericEnumToArray<T extends object>(
    enumObj: T
): { name: string; value: number }[] {
    return Object.entries(enumObj)
        .filter(([key]) => isNaN(Number(key)))
        .map(([name, value]) => ({ name, value: value as number }));
}

const priorities = numericEnumToArray(Priority);
console.log("Priorities:", priorities);

// Solution 6: Reverse Lookup Helper
console.log("\n--- Reverse Lookup ---");

function getEnumKeyByValue<T extends object>(
    enumObj: T,
    value: T[keyof T]
): keyof T | undefined {
    const keys = Object.keys(enumObj) as (keyof T)[];
    return keys.find(key => enumObj[key] === value);
}

console.log("Key for 'active':", getEnumKeyByValue(Status, "active" as Status));
console.log("Key for 2:", getEnumKeyByValue(Priority, 2 as Priority));

// Solution 7: Enum Validation
console.log("\n--- Enum Validation ---");

function isValidEnumValue<T extends object>(
    enumObj: T,
    value: unknown
): value is T[keyof T] {
    return Object.values(enumObj).includes(value as T[keyof T]);
}

console.log("Is 'active' valid Status?", isValidEnumValue(Status, "active"));
console.log("Is 'invalid' valid Status?", isValidEnumValue(Status, "invalid"));
console.log("Is 2 valid Priority?", isValidEnumValue(Priority, 2));
console.log("Is 10 valid Priority?", isValidEnumValue(Priority, 10));

// Solution 8: Enum Mapping
console.log("\n--- Enum Mapping ---");

enum HttpMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE"
}

const methodDescriptions: Record<HttpMethod, string> = {
    [HttpMethod.GET]: "Retrieve data",
    [HttpMethod.POST]: "Create new data",
    [HttpMethod.PUT]: "Update existing data",
    [HttpMethod.DELETE]: "Remove data"
};

Object.entries(methodDescriptions).forEach(([method, desc]) => {
    console.log(`${method}: ${desc}`);
});

// Solution 9: Filtering Enums
console.log("\n--- Filtering Enums ---");

enum Permission {
    Read = 1,
    Write = 2,
    Delete = 4,
    Admin = 8
}

// Get permissions above a threshold
const highPermissions = numericEnumToArray(Permission)
    .filter(p => p.value >= 4);
console.log("High permissions:", highPermissions);

// Solution 10: Practical Example
console.log("\n--- Practical Example ---");

enum UserRole {
    Guest = "guest",
    User = "user",
    Moderator = "moderator",
    Admin = "admin"
}

const roleHierarchy: Record<UserRole, number> = {
    [UserRole.Guest]: 0,
    [UserRole.User]: 1,
    [UserRole.Moderator]: 2,
    [UserRole.Admin]: 3
};

function getRolesAbove(role: UserRole): UserRole[] {
    const level = roleHierarchy[role];
    return (Object.keys(UserRole) as (keyof typeof UserRole)[])
        .map(key => UserRole[key])
        .filter(r => roleHierarchy[r] > level);
}

console.log("Roles above User:", getRolesAbove(UserRole.User));
console.log("Roles above Moderator:", getRolesAbove(UserRole.Moderator));

