/**
 * Lab 227: Truthiness Narrowing
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Narrowing with truthy/falsy checks:
 * 
 * - Falsy values
 * - Boolean coercion
 * - Null/undefined checks
 * - Empty string/array checks
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Use truthiness narrowing
 * 2. Handle falsy values
 * 3. Combine with other guards
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Basic Truthiness
console.log("--- Basic Truthiness ---");

function greet(name: string | null | undefined): string {
    if (name) {
        // name is string here (not null/undefined/empty)
        return `Hello, ${name}!`;
    }
    return "Hello, Guest!";
}

console.log(greet("John"));
console.log(greet(null));
console.log(greet(undefined));
console.log(greet("")); // Also falsy!

// Solution 2: Falsy Values
console.log("\n--- Falsy Values ---");

// Falsy: false, 0, -0, 0n, "", null, undefined, NaN

function describeFalsy(value: unknown): string {
    if (!value) {
        if (value === false) return "Boolean false";
        if (value === 0) return "Number zero";
        if (value === "") return "Empty string";
        if (value === null) return "Null";
        if (value === undefined) return "Undefined";
        if (Number.isNaN(value)) return "NaN";
        return "Other falsy";
    }
    return "Truthy value";
}

console.log(describeFalsy(false));
console.log(describeFalsy(0));
console.log(describeFalsy(""));
console.log(describeFalsy(null));
console.log(describeFalsy("hello"));

// Solution 3: Optional Chaining with Truthiness
console.log("\n--- Optional Chaining ---");

interface User {
    name: string;
    address?: {
        street?: string;
        city?: string;
    };
}

function getCity(user: User): string {
    if (user.address?.city) {
        return user.address.city;
    }
    return "Unknown";
}

console.log(getCity({ name: "John", address: { city: "NYC" } }));
console.log(getCity({ name: "Jane" }));

// Solution 4: Array Truthiness
console.log("\n--- Array Truthiness ---");

function processItems(items: string[] | null | undefined): void {
    if (items && items.length) {
        // items is string[] with at least one element
        console.log("Items:", items.join(", "));
    } else {
        console.log("No items");
    }
}

processItems(["a", "b", "c"]);
processItems([]);
processItems(null);

// Solution 5: Object Property Truthiness
console.log("\n--- Property Truthiness ---");

interface Config {
    debug?: boolean;
    timeout?: number;
    apiKey?: string;
}

function applyConfig(config: Config): void {
    if (config.debug) {
        console.log("Debug mode enabled");
    }
    
    if (config.timeout) {
        console.log(`Timeout: ${config.timeout}ms`);
    }
    
    if (config.apiKey) {
        console.log(`API Key: ${config.apiKey.substring(0, 4)}...`);
    }
}

applyConfig({ debug: true, timeout: 5000, apiKey: "secret123" });
applyConfig({ debug: false, timeout: 0 }); // Note: 0 is falsy!

// Solution 6: Double Negation
console.log("\n--- Double Negation ---");

function toBoolean(value: unknown): boolean {
    return !!value;
}

console.log("!!'' =", toBoolean(""));
console.log("!!'hello' =", toBoolean("hello"));
console.log("!!0 =", toBoolean(0));
console.log("!!42 =", toBoolean(42));
console.log("!!null =", toBoolean(null));
console.log("!!{} =", toBoolean({}));

// Solution 7: Combining Guards
console.log("\n--- Combining Guards ---");

type Response = {
    data?: unknown;
    error?: string;
};

function handleResponse(response: Response | null): void {
    if (!response) {
        console.log("No response");
        return;
    }
    
    if (response.error) {
        console.log("Error:", response.error);
        return;
    }
    
    if (response.data) {
        console.log("Data:", response.data);
        return;
    }
    
    console.log("Empty response");
}

handleResponse(null);
handleResponse({ error: "Not found" });
handleResponse({ data: { id: 1 } });
handleResponse({});

// Solution 8: String Truthiness
console.log("\n--- String Truthiness ---");

function formatName(
    firstName: string | null,
    lastName: string | null
): string {
    const parts: string[] = [];
    
    if (firstName) {
        parts.push(firstName);
    }
    
    if (lastName) {
        parts.push(lastName);
    }
    
    return parts.length ? parts.join(" ") : "Anonymous";
}

console.log(formatName("John", "Doe"));
console.log(formatName("John", null));
console.log(formatName(null, null));

// Solution 9: Nullish vs Falsy
console.log("\n--- Nullish vs Falsy ---");

function getValue(value: number | null | undefined): number {
    // Using || treats 0 as falsy
    const withOr = value || 100;
    
    // Using ?? only checks null/undefined
    const withNullish = value ?? 100;
    
    console.log(`Value: ${value}, ||: ${withOr}, ??: ${withNullish}`);
    return withNullish;
}

getValue(42);
getValue(0);    // Different results!
getValue(null);
getValue(undefined);

// Solution 10: Practical Example
console.log("\n--- Practical Example ---");

interface FormField {
    value: string;
    error?: string;
    touched?: boolean;
}

interface Form {
    username: FormField;
    email: FormField;
    password: FormField;
}

function validateForm(form: Form): string[] {
    const errors: string[] = [];
    
    if (!form.username.value) {
        errors.push("Username is required");
    }
    
    if (!form.email.value) {
        errors.push("Email is required");
    } else if (!form.email.value.includes("@")) {
        errors.push("Invalid email");
    }
    
    if (!form.password.value) {
        errors.push("Password is required");
    } else if (form.password.value.length < 8) {
        errors.push("Password too short");
    }
    
    return errors;
}

const form: Form = {
    username: { value: "john" },
    email: { value: "" },
    password: { value: "123" }
};

const errors = validateForm(form);
if (errors.length) {
    console.log("Validation errors:", errors);
} else {
    console.log("Form is valid");
}

