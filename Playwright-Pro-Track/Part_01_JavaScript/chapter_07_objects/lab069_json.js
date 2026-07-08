/**
 * Lab 069: JSON (JavaScript Object Notation)
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * JSON is a text format for data exchange.
 * 
 * Methods:
 * - JSON.stringify(): Object to JSON string
 * - JSON.parse(): JSON string to object
 * 
 * JSON supports:
 * - Objects, arrays, strings, numbers, booleans, null
 * 
 * JSON does NOT support:
 * - Functions, undefined, symbols, dates (as dates)
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Convert objects to JSON
 * 2. Parse JSON strings
 * 3. Handle special cases
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: JSON.stringify()
console.log("--- JSON.stringify() ---");

const user = {
    name: "Alice",
    age: 25,
    active: true,
    hobbies: ["reading", "coding"]
};

const json = JSON.stringify(user);
console.log("JSON:", json);
console.log("Type:", typeof json);

// Solution 2: JSON.parse()
console.log("\n--- JSON.parse() ---");

const jsonString = '{"name":"Bob","age":30,"city":"NYC"}';
const parsed = JSON.parse(jsonString);

console.log("Parsed:", parsed);
console.log("Name:", parsed.name);
console.log("Type:", typeof parsed);

// Solution 3: Pretty Print
console.log("\n--- Pretty Print ---");

const data = { a: 1, b: { c: 2, d: 3 }, e: [4, 5, 6] };

// With indentation
const pretty = JSON.stringify(data, null, 2);
console.log("Pretty:\n" + pretty);

// With tabs
const tabbed = JSON.stringify(data, null, "\t");
console.log("Tabbed:\n" + tabbed);

// Solution 4: Replacer Function
console.log("\n--- Replacer Function ---");

const sensitive = {
    username: "alice",
    password: "secret123",
    email: "alice@test.com"
};

// Filter out password
const safe = JSON.stringify(sensitive, (key, value) => {
    if (key === "password") return undefined;
    return value;
});
console.log("Safe:", safe);

// Transform values
const transformed = JSON.stringify(sensitive, (key, value) => {
    if (typeof value === "string") return value.toUpperCase();
    return value;
});
console.log("Transformed:", transformed);

// Solution 5: Replacer Array
console.log("\n--- Replacer Array ---");

const full = { a: 1, b: 2, c: 3, d: 4 };
const partial = JSON.stringify(full, ["a", "c"]);
console.log("Partial:", partial);

// Solution 6: Reviver Function
console.log("\n--- Reviver Function ---");

const jsonWithDate = '{"name":"Event","date":"2024-01-15T10:30:00.000Z"}';

const withDate = JSON.parse(jsonWithDate, (key, value) => {
    if (key === "date") return new Date(value);
    return value;
});

console.log("With date:", withDate);
console.log("Date type:", withDate.date instanceof Date);

// Solution 7: Handling Special Values
console.log("\n--- Special Values ---");

const special = {
    func: function() {},
    undef: undefined,
    sym: Symbol("test"),
    date: new Date(),
    regex: /test/g,
    nan: NaN,
    infinity: Infinity
};

console.log("Stringified:", JSON.stringify(special));
// Functions, undefined, symbols are omitted
// Date becomes string, NaN/Infinity become null

// Solution 8: toJSON Method
console.log("\n--- toJSON Method ---");

const customObj = {
    name: "Custom",
    secret: "hidden",
    
    toJSON() {
        return {
            name: this.name,
            serializedAt: new Date().toISOString()
        };
    }
};

console.log("Custom JSON:", JSON.stringify(customObj));

// Solution 9: Deep Clone with JSON
console.log("\n--- Deep Clone ---");

const original = {
    a: 1,
    b: { c: 2, d: { e: 3 } },
    arr: [1, 2, [3, 4]]
};

const clone = JSON.parse(JSON.stringify(original));
clone.b.c = 100;

console.log("Original b.c:", original.b.c);
console.log("Clone b.c:", clone.b.c);

// Limitations: loses functions, dates, undefined, etc.

// Solution 10: Error Handling
console.log("\n--- Error Handling ---");

function safeParse(jsonString) {
    try {
        return { data: JSON.parse(jsonString), error: null };
    } catch (e) {
        return { data: null, error: e.message };
    }
}

console.log("Valid:", safeParse('{"a":1}'));
console.log("Invalid:", safeParse('{invalid}'));

// Solution 11: Circular Reference
console.log("\n--- Circular Reference ---");

const circular = { name: "Circular" };
circular.self = circular;

try {
    JSON.stringify(circular);
} catch (e) {
    console.log("Circular error:", e.message);
}

// Solution with custom replacer
function stringifyWithCircular(obj) {
    const seen = new WeakSet();
    return JSON.stringify(obj, (key, value) => {
        if (typeof value === "object" && value !== null) {
            if (seen.has(value)) return "[Circular]";
            seen.add(value);
        }
        return value;
    });
}

console.log("With circular handling:", stringifyWithCircular(circular));

