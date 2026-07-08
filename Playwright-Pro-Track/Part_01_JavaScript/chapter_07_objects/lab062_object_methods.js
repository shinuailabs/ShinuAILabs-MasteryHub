/**
 * Lab 062: Object Methods
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Built-in Object methods for manipulation:
 * 
 * - Object.assign: Copy/merge objects
 * - Object.freeze: Make immutable
 * - Object.seal: Prevent add/delete
 * - Object.keys/values/entries: Get data
 * - Object.fromEntries: Create from entries
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Use Object static methods
 * 2. Understand freeze vs seal
 * 3. Transform objects
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

// Solution 1: Object.assign
console.log("--- Object.assign ---");

const target = { a: 1, b: 2 };
const source1 = { b: 3, c: 4 };
const source2 = { d: 5 };

// Merge (mutates target)
const result = Object.assign(target, source1, source2);
console.log("Target:", target);
console.log("Result:", result);
console.log("Same object:", target === result);

// Clone (non-mutating)
const original = { x: 1, y: 2 };
const clone = Object.assign({}, original);
console.log("Clone:", clone);

// Solution 2: Object.freeze
console.log("\n--- Object.freeze ---");

const frozen = Object.freeze({ a: 1, b: 2 });

// These silently fail (or throw in strict mode)
frozen.a = 100;      // Can't modify
frozen.c = 3;        // Can't add
delete frozen.a;     // Can't delete

console.log("Frozen:", frozen);
console.log("Is frozen:", Object.isFrozen(frozen));

// Shallow freeze only!
const nested = Object.freeze({ inner: { value: 1 } });
nested.inner.value = 100; // This works!
console.log("Nested modified:", nested);

// Solution 3: Object.seal
console.log("\n--- Object.seal ---");

const sealed = Object.seal({ a: 1, b: 2 });

sealed.a = 100;      // Can modify
sealed.c = 3;        // Can't add
delete sealed.a;     // Can't delete

console.log("Sealed:", sealed);
console.log("Is sealed:", Object.isSealed(sealed));

// Solution 4: Object.keys/values/entries
console.log("\n--- keys/values/entries ---");

const person = { name: "Alice", age: 25, city: "NYC" };

console.log("Keys:", Object.keys(person));
console.log("Values:", Object.values(person));
console.log("Entries:", Object.entries(person));

// Solution 5: Object.fromEntries
console.log("\n--- Object.fromEntries ---");

const entries = [["a", 1], ["b", 2], ["c", 3]];
const obj = Object.fromEntries(entries);
console.log("From entries:", obj);

// Transform object
const prices = { apple: 1.5, banana: 0.75, orange: 2.0 };
const doubled = Object.fromEntries(
    Object.entries(prices).map(([key, value]) => [key, value * 2])
);
console.log("Doubled prices:", doubled);

// Solution 6: Object.getOwnPropertyNames
console.log("\n--- getOwnPropertyNames ---");

const obj2 = { a: 1 };
Object.defineProperty(obj2, "hidden", {
    value: "secret",
    enumerable: false
});

console.log("Keys:", Object.keys(obj2)); // Only enumerable
console.log("Property names:", Object.getOwnPropertyNames(obj2)); // All

// Solution 7: Object.getOwnPropertyDescriptor
console.log("\n--- Property Descriptors ---");

const obj3 = { name: "Test" };
const descriptor = Object.getOwnPropertyDescriptor(obj3, "name");
console.log("Descriptor:", descriptor);

// Solution 8: Object.defineProperty
console.log("\n--- defineProperty ---");

const obj4 = {};
Object.defineProperty(obj4, "readonly", {
    value: "can't change",
    writable: false,
    enumerable: true,
    configurable: false
});

obj4.readonly = "new value"; // Fails silently
console.log("Readonly:", obj4.readonly);

// Getter/Setter
const obj5 = {
    _value: 0
};
Object.defineProperty(obj5, "value", {
    get() { return this._value; },
    set(v) { this._value = v > 0 ? v : 0; }
});

obj5.value = 10;
console.log("Value:", obj5.value);
obj5.value = -5;
console.log("After negative:", obj5.value);

// Solution 9: Object.is
console.log("\n--- Object.is ---");

console.log("Object.is(1, 1):", Object.is(1, 1));
console.log("Object.is(NaN, NaN):", Object.is(NaN, NaN)); // true!
console.log("NaN === NaN:", NaN === NaN); // false
console.log("Object.is(0, -0):", Object.is(0, -0)); // false
console.log("0 === -0:", 0 === -0); // true

// Solution 10: Object.hasOwn (ES2022)
console.log("\n--- Object.hasOwn ---");

const obj6 = { a: 1 };
console.log("hasOwn('a'):", Object.hasOwn(obj6, "a"));
console.log("hasOwn('toString'):", Object.hasOwn(obj6, "toString"));

// Safer than hasOwnProperty
const obj7 = Object.create(null); // No prototype
obj7.key = "value";
// obj7.hasOwnProperty("key"); // Error!
console.log("hasOwn on null proto:", Object.hasOwn(obj7, "key"));

