/**
 * Lab 016: Nullish Coalescing Operator (??)
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * The nullish coalescing operator (??) returns the right operand
 * when the left operand is null or undefined.
 * 
 * Difference from ||:
 * - || returns right side for ANY falsy value (0, "", false, null, undefined)
 * - ?? returns right side ONLY for null or undefined
 * 
 * This is important when 0 or "" are valid values!
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Compare ?? with ||
 * 2. Use ?? for safe defaults
 * 3. Chain ?? operators
 * 4. Combine with optional chaining
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic ?? Usage
console.log("--- Basic ?? ---");
const a = null ?? "default";
const b = undefined ?? "default";
const c = "value" ?? "default";

console.log("null ?? 'default':", a);       // "default"
console.log("undefined ?? 'default':", b);  // "default"
console.log("'value' ?? 'default':", c);    // "value"

// Solution 2: ?? vs || Comparison
console.log("\n--- ?? vs || ---");

// With falsy values that are valid
const count1 = 0 || 10;     // 10 (0 is falsy!)
const count2 = 0 ?? 10;     // 0 (0 is NOT nullish)

const text1 = "" || "default";   // "default" (empty string is falsy!)
const text2 = "" ?? "default";   // "" (empty string is NOT nullish)

const flag1 = false || true;     // true (false is falsy!)
const flag2 = false ?? true;     // false (false is NOT nullish)

console.log('0 || 10:', count1);
console.log('0 ?? 10:', count2);
console.log('"" || "default":', text1);
console.log('"" ?? "default":', text2);
console.log('false || true:', flag1);
console.log('false ?? true:', flag2);

// Solution 3: Practical Use Cases
console.log("\n--- Practical Use Cases ---");

// User settings where 0 is valid
const userSettings = {
    volume: 0,          // Valid setting (muted)
    brightness: null,   // Not set
    theme: ""          // Empty (use system default)
};

// Using || (WRONG for volume!)
const volume1 = userSettings.volume || 50;
console.log("Volume with ||:", volume1);  // 50 (wrong!)

// Using ?? (CORRECT)
const volume2 = userSettings.volume ?? 50;
console.log("Volume with ??:", volume2);  // 0 (correct!)

const brightness = userSettings.brightness ?? 100;
console.log("Brightness:", brightness);   // 100

// Solution 4: Chaining ??
console.log("\n--- Chaining ?? ---");

function getSetting(primary, secondary, fallback) {
    return primary ?? secondary ?? fallback;
}

console.log(getSetting(null, null, "fallback"));     // "fallback"
console.log(getSetting(null, "secondary", "fallback")); // "secondary"
console.log(getSetting("primary", "secondary", "fallback")); // "primary"

// Solution 5: ?? with Optional Chaining (?.)
console.log("\n--- ?? with Optional Chaining ---");

const user = {
    name: "John",
    settings: {
        notifications: true
    }
};

// Safely access nested property with default
const emailNotif = user?.settings?.emailNotifications ?? true;
const smsNotif = user?.settings?.smsNotifications ?? false;

console.log("Email notifications:", emailNotif);  // true (default)
console.log("SMS notifications:", smsNotif);      // false (default)

// Solution 6: Function Parameter Defaults
console.log("\n--- Function Parameters ---");

// Traditional approach
function greet1(name) {
    name = name ?? "Guest";
    return `Hello, ${name}!`;
}

// With default parameter (similar but different)
function greet2(name = "Guest") {
    return `Hello, ${name}!`;
}

console.log("greet1(null):", greet1(null));     // "Hello, Guest!"
console.log("greet2(null):", greet2(null));     // "Hello, null!" (default only for undefined)

// Solution 7: Cannot Mix with && or || without Parentheses
console.log("\n--- Operator Mixing ---");

// This would cause a syntax error:
// const result = a || b ?? c;

// Use parentheses to be explicit:
const x = null;
const y = undefined;
const z = "value";

const result1 = (x || y) ?? z;
const result2 = x || (y ?? z);

console.log("(x || y) ?? z:", result1);  // "value"
console.log("x || (y ?? z):", result2);  // "value"

// Solution 8: Real-World Example
console.log("\n--- Real-World Example ---");

const apiResponse = {
    data: {
        count: 0,
        items: [],
        message: ""
    }
};

// Safe extraction with meaningful defaults
const count = apiResponse?.data?.count ?? -1;
const items = apiResponse?.data?.items ?? [];
const message = apiResponse?.data?.message ?? "No message";

console.log("Count:", count);     // 0 (preserved!)
console.log("Items:", items);     // []
console.log("Message:", message); // "" (preserved!)

